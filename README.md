# NOVA Shopping
**Discover better. Shop smarter.**

NOVA is a marketplace starter with a responsive storefront and an integration-ready foundation for customer accounts and secure payments.

## Included in this release
- Responsive storefront, category navigation, search, sorting, sale filters, product cards
- Cart and saved products
- Supabase customer sign-up, sign-in, session state, sign-out and order-history UI
- Stripe-hosted Checkout integration through a Supabase Edge Function
- Server-side product price and inventory validation (client-submitted prices are never trusted)
- Stripe webhook endpoint scaffold for payment confirmation
- Supabase SQL schema with row-level security for profiles, products, sellers, addresses, orders, reviews, price alerts, rewards, shared shopping lists and price history
- Customer-selected product comparison, account-backed price alerts, shopping lists with public share links, seller applications, and a rewards ledger
- Authenticated NOVA AI shopping assistant using the live Supabase product catalog

## Run the static storefront
Open `index.html` in a browser or serve the repository with a local web server. Copy `config.example.js` to `config.js` and set the Supabase project URL and anon key. The anon key is intended for browser use; never place a service-role key or Stripe secret in frontend files.

## Enable customer accounts and payments
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `config.example.js` to `config.js` and set `supabaseUrl` and `supabaseAnonKey`.
4. Run `supabase/production-hardening.sql` after the core schema migration. This adds idempotent paid-order processing, inventory decrement, and rewards crediting.
5. Deploy `supabase/functions/create-checkout/index.ts`, `supabase/functions/stripe-webhook/index.ts`, and `supabase/functions/nova-ai/index.ts`.
6. Set Edge Function secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `OPENAI_API_KEY`, and `SITE_URL`.
7. In Stripe, add a webhook endpoint pointing to the deployed `stripe-webhook` function and subscribe to `checkout.session.completed` and `checkout.session.expired`.
8. Configure the deployed site URL in Supabase Auth redirect settings and Stripe Checkout return URLs.

Use Stripe test mode first. Real payments require a verified Stripe account, live keys, webhook configuration, business/tax compliance, refund and dispute handling, and a production security review. Never commit real keys to GitHub.

## Important current limitations
This is still a starter, not a production-ready Amazon-scale marketplace. The sample catalog is local demo data; the SQL seeds corresponding catalog records for checkout. Checkout is disabled until Supabase and Stripe are configured. The webhook confirms payments, decrements inventory under database row locks, and credits rewards once per order. Production still needs refunds/disputes, fulfillment/shipping, tax calculation, scheduled price-alert delivery, seller verification/payouts, review moderation, abuse controls, and a security/compliance review. Seller application approval, seller dashboards/payouts, shipping/tax calculation, review moderation, live price monitoring/notifications, social list sharing, AI-provider integration and customer support workflows still need implementation. The AI shopping assistant calls OpenAI from a server-side Edge Function and grounds its suggestions in the active Supabase catalog. Price alerts are saved, but automatic email/SMS alert delivery still requires a scheduled notification worker. Seller applications can be submitted, but approval, seller dashboards and payouts are not implemented. Shared lists are readable by public token only after the recipient opens the deployed storefront.

## Security notes
- Keep Supabase service-role and Stripe secret keys in Edge Function secrets only.
- Enable email confirmation, configure allowed redirect URLs, and use MFA for administrators.
- Review RLS policies and test them with separate customer and seller accounts before launch.
- Add rate limits, abuse prevention, audit logging, backups, privacy/terms/refund policies and payment compliance before accepting live transactions.
