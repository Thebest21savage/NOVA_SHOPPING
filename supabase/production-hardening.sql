
create unique index if not exists reward_ledger_one_order_reward on public.reward_ledger(order_id) where order_id is not null;
create or replace function public.complete_nova_order(p_order_id uuid,p_session_id text)
returns boolean language plpgsql security definer set search_path=public as $$
declare o public.orders%rowtype; item record;
begin
 select * into o from public.orders where id=p_order_id for update;
 if not found then return false; end if;
 if o.status='paid' then return true; end if;
 if o.status<>'pending' then return false; end if;
 for item in select product_id,sum(quantity)::integer quantity from public.order_items where order_id=p_order_id and product_id is not null group by product_id loop
  update public.products set inventory=inventory-item.quantity where id=item.product_id and inventory>=item.quantity;
  if not found then update public.orders set status='inventory_review',stripe_session_id=p_session_id where id=p_order_id; return false; end if;
 end loop;
 update public.orders set status='paid',stripe_session_id=p_session_id where id=p_order_id;
 insert into public.reward_ledger(user_id,points,reason,order_id) values(o.user_id,greatest(1,floor(o.total_cents/100)::integer),'Points earned from order',p_order_id) on conflict(order_id) where order_id is not null do nothing;
 return true;
end; $$;
revoke all on function public.complete_nova_order(uuid,text) from public,anon,authenticated;
grant execute on function public.complete_nova_order(uuid,text) to service_role;
