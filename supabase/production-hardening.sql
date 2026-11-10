
-- Run after schema.sql. Paid order processing is idempotent and locks stock rows.
create unique index if not exists reward_ledger_one_order_reward
  on public.reward_ledger(order_id) where order_id is not null;

create or replace function public.complete_nova_order(p_order_id uuid,p_session_id text)
returns boolean language plpgsql security definer set search_path=public as $$
declare
  o public.orders%rowtype;
  item record;
begin
  select * into o from public.orders where id=p_order_id for update;
  if not found then return false; end if;
  if o.status='paid' then return true; end if;
  if o.status<>'pending' then return false; end if;

  -- Lock every affected product in a stable order before checking or changing stock.
  for item in
    select p.id,p.inventory,sum(oi.quantity)::integer as quantity
    from public.products p join public.order_items oi on oi.product_id=p.id
    where oi.order_id=p_order_id group by p.id,p.inventory order by p.id for update of p
  loop
    if item.inventory < item.quantity then
      update public.orders set status='inventory_review',stripe_session_id=p_session_id where id=p_order_id;
      return false;
    end if;
  end loop;

  update public.products p set inventory=p.inventory-q.quantity
  from (select product_id,sum(quantity)::integer quantity from public.order_items
        where order_id=p_order_id and product_id is not null group by product_id) q
  where p.id=q.product_id;
  update public.orders set status='paid',stripe_session_id=p_session_id where id=p_order_id;
  insert into public.reward_ledger(user_id,points,reason,order_id)
  values(o.user_id,greatest(1,floor(o.total_cents/100)::integer),'Points earned from order',p_order_id)
  on conflict(order_id) where order_id is not null do nothing;
  return true;
end; $$;
revoke all on function public.complete_nova_order(uuid,text) from public,anon,authenticated;
grant execute on function public.complete_nova_order(uuid,text) to service_role;
