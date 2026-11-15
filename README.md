# MemoryOrb storefront

Restored original English website, photography and six colours. Prices are in USD: Single $24.99, Pair $44.98, Collection $59.97. Cart discounts apply to all colours together: one orb $24.99, two $22.49 each, three or more $19.99 each.

Vercel project: ai-dropship/my-proje. Source: maxxxiss/memoryorb-store, main branch. Build: node build.mjs. Public files are copied to public/. The original contact and tracking endpoints remain available.

Stripe checkout verifies prices on the server in USD. To activate, set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and STORE_READY=true in Vercel Production, then redeploy. Do not put keys in code. Configure Stripe webhook at https://memoryorb-shop.store/api/webhook for checkout.session.completed and checkout.session.async_payment_succeeded. Paid sessions are marked in Stripe metadata. Fulfil orders manually from the Stripe Dashboard. Current checkout shipping-country list is SK; confirm shipping destinations and merchant details before activation.

Stripe is not yet connected; the checkout shows a clear unavailable message instead of redirecting to Shopify at unverified prices. Tests: node --test.
