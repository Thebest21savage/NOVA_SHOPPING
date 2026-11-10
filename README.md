# NOVA Shopping
**Discover better. Shop smarter.**

NOVA is a marketplace starter with a responsive storefront and an integration-ready foundation for customer accounts and secure payments.

## Included in this release
- Responsive storefront, category navigation, sorting, filters, and a live eBay Browse API product-search integration
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

## Enable live product discovery\n1. Create an eBay Developer account and obtain an Application (Client ID) and Cert ID (Client Secret) for the Buy Browse API. eBay may require production API access approval.\n2. Deploy `supabase/functions/ebay-search/index.ts` as the `ebay-search` Supabase Edge Function.\n3. Add `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` as Supabase Edge Function secrets. Optionally set `EBAY_MARKETPLACE_ID=EBAY_US`. Never put these credentials in `config.js` or GitHub.\n4. Ensure `SITE_URL` is set to the storefront origin, and deploy the site over HTTPS.\n5. Search for a product in NOVA. Results are live eBay listings; each listing opens on eBay for purchase. NOVA does not process those external transactions. Confirm your eBay API license, affiliate requirements, and display policies before public launch.\n\nThe homepage still contains clearly labelled sample showcase cards for layout testing. They are not verified products, their displayed ratings/prices are not live, and checkout is intentionally disabled for them. Live search is the real-product path.\n\n## Enable customer accounts and payments
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
This is still a starter, not a production-ready Amazon-scale marketplace. The homepage sample catalog is local demo data and is not purchasable. Live product discovery uses the eBay Browse API Edge Function and requires eBay developer credentials. External purchases happen on eBay. Stripe checkout is disabled for the sample catalog. The webhook confirms payments, decrements inventory under database row locks, and credits rewards once per order. Production still needs refunds/disputes, fulfillment/shipping, tax calculation, scheduled price-alert delivery, seller verification/payouts, review moderation, abuse controls, and a security/compliance review. Seller application approval, seller dashboards/payouts, shipping/tax calculation, review moderation, live price monitoring/notifications, advanced AI product-search tools and customer support workflows still need implementation. NOVA AI is a conversational assistant powered by OpenAI (`gpt-4.1-mini`) through the server-side `nova-ai` Edge Function. It keeps recent chat turns in the open browser session and uses the active Supabase catalog to ground product recommendations. It requires a signed-in customer, a deployed function, and the `OPENAI_API_KEY` Edge Function secret. It does not yet search live eBay listings from inside the AI conversation. Price alerts are saved, but automatic email/SMS alert delivery still requires a scheduled notification worker. Seller applications can be submitted, but approval, seller dashboards and payouts are not implemented. Shared lists are readable by public token only after the recipient opens the deployed storefront.

## Security notes
- Keep Supabase service-role and Stripe secret keys in Edge Function secrets only.
- Enable email confirmation, configure allowed redirect URLs, and use MFA for administrators.
- Review RLS policies and test them with separate customer and seller accounts before launch.
- Add rate limits, abuse prevention, audit logging, backups, privacy/terms/refund policies and payment compliance before accepting live transactions.
