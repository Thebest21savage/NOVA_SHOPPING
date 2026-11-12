# NOVA Shopping

**Discover better. Shop smarter.**

NOVA is a shopping storefront with product discovery, a product detail experience, customer accounts, saved items, a cart, and an integration-ready Supabase and Stripe foundation.

The storefront uses a light, editorial retail layout with locally stored sample product illustrations. Ratings, previous prices, comparison sources, and delivery examples are demo content, not live marketplace data. The NOVA AI budget helper filters the local sample catalog; it does not use an AI service or a customer taste profile.

## Project structure

```text
NOVA_SHOPPING/
├── index.html
├── pages/
│   └── product.html     # Product detail, decision, review, and buying experience
├── assets/
│   └── images/           # Original local product and category illustrations
├── css/
│   ├── main.css          # Design tokens, base styles, header, hero, page layout
│   ├── components.css    # Product cards, categories, tools, dialogs, responsive rules
│   └── animations.css    # Motion, ambient effects, reduced-motion support
│   ├── product-detail.css # Product page layout, media, decision sections, responsive styles
├── js/
│   ├── products.js       # Sample catalog, categories, product and comparison rendering
│   ├── cart.js           # Cart and saved-item state, local storage, cart drawer
│   ├── search.js         # Search, categories, filters, sorting, discovery state
│   ├── auth.js           # Supabase sign-in, sign-up, sign-out, and order history
│   ├── checkout.js       # Shared Stripe Checkout handoff
│   ├── product-detail-data.js # Product-specific decision notes for the sample catalog
│   ├── product-page.js   # Product page gallery, reviews, comparisons, and interactions
│   ├── app.js            # Homepage wiring, NOVA Tools, and feature actions
├── supabase/
│   ├── config.toml
│   ├── schema.sql
│   └── functions/
│       ├── create-checkout/index.ts
│       └── stripe-webhook/index.ts
├── .gitignore
├── config.example.js
└── README.md
```

Product detail links open `pages/product.html?id=<product-id>`. Search, account, cart, and order history continue to use the shared storefront modules. Separate search and profile routes are not currently implemented.

## Run locally

The app uses JavaScript modules, so serve the project over HTTP instead of opening `index.html` directly with a `file://` URL.

1. Copy `config.example.js` to `config.js` and set the Supabase project URL and public anon key if you want to enable account features.
2. Start a local server from the repository root. For example, with Python on Windows:

   ```powershell
   py -m http.server 8000
   ```

   Or on macOS/Linux:

   ```sh
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000` in a browser.

The storefront can be browsed without Supabase configuration. Account and checkout actions will explain when a service is not configured.

## Frontend modules

- `products.js` owns the sample catalog, category data, and product/comparison markup.
- `cart.js` owns the cart and saved-product lists in `localStorage`.
- `search.js` owns the current search, category, filter, sort, and discovery selections.
- `auth.js` connects the account UI and order history to Supabase.
- `app.js` joins the modules and handles checkout and the NOVA Tools actions.
- `checkout.js` shares the existing Supabase Edge Function checkout handoff between the homepage and product page.
- `product-detail-data.js` contains clearly labeled prototype notes for each seeded sample product. Review, video, buying-option, and price-history examples are illustrative; they are not live feeds.
- `product-page.js` renders product details, gallery states, comparison, local price-alert preferences, and the responsive section navigation.

Stylesheets are loaded in order: `main.css`, `components.css`, then `animations.css`.

Product and category art is stored in `assets/images/` and loaded locally. The homepage's comparison panel uses illustrative sample offers and price history; live seller offers and historical price feeds are not connected. Product spotlight panels are illustrations rather than videos or customer uploads.

## Supabase and Stripe setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Set `supabaseUrl` and `supabaseAnonKey` in your local `config.js`.
4. Deploy `supabase/functions/create-checkout/index.ts` and `supabase/functions/stripe-webhook/index.ts`.
5. Set these Edge Function secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SITE_URL`.
6. Configure a Stripe webhook for `checkout.session.completed` and `checkout.session.expired`.
7. Add the deployed site URL to Supabase Auth redirect settings and configure the Stripe Checkout return URLs.

Use Stripe test mode first. Do not put a Supabase service-role key or Stripe secret in `config.js`, frontend JavaScript, or any committed file. The browser anon key is intended to be public; protect data with reviewed row-level security policies.

## Current feature boundaries

- Checkout is disabled until Supabase and Stripe are configured. The Edge Function validates product prices and inventory server-side.
- The sample catalog is local demo data; the SQL file seeds matching product records.
- Price targets can be stored in Supabase when accounts are configured. Automatic price-drop notifications need a separate monitoring service.
- Rewards balance and seller application status use the existing schema, but reward earning/redemption and seller storefronts/payouts are not enabled.
- Shared lists, group voting, shipping/tax calculations, review moderation, production fulfillment, refund/dispute handling, customer support, and an AI-provider integration still need implementation.
- NOVA AI suggestions use the sample catalog and budget locally; they are not generated by an AI service.

Before accepting live payments, review RLS policies, fulfillment, inventory updates, idempotency, refunds and disputes, rate limits, backups, privacy/terms/refund policies, and payment compliance.

