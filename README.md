# MemoryOrb — upravený obchod

Krátka slovenská stránka, päť farieb, galéria a košík. Ceny: 24,99 € / 44,99 € / 59,99 € za 1 / 2 / 3 kusy.

## Spustenie
Node.js 24 alebo novší. V tomto priečinku spustite `npm install`, skopírujte `.env.example` do `.env` a spustite `npm start`. Otvorte http://localhost:3000. Samotné otvorenie HTML umožňuje prehliadať produkt; platba potrebuje server.

## Pripojenie vášho Stripe účtu
V `.env` alebo nastaveniach hostingu nastavte `STRIPE_SECRET_KEY` z vlastného Stripe účtu. Kľúč nevkladajte do HTML ani neposielajte do chatu. Najprv použite testovací kľúč.

V Stripe nastavte webhook na `https://VASA-DOMENA/api/webhook`, udalosti `checkout.session.completed` a `checkout.session.async_payment_succeeded`. Jeho podpisový kľúč vložte do `STRIPE_WEBHOOK_SECRET`. Nastavte `SITE_URL` na verejnú HTTPS adresu webu.

Platby sa sprístupnia až s `STORE_READY=true`. Predtým potvrďte produkt, sklad, dane, dopravu a doplňte identitu predávajúceho, kontakt a úplné obchodné informácie. Súčasná pokladňa zbiera adresy na Slovensku a nepridáva poplatok za dopravu; pred aktiváciou potvrďte, že je doprava zahrnutá v cene, alebo doplňte sadzbu dopravy. Žiadne sadzby daní nie sú automaticky vypočítané.

Overte testovaciu platbu kartou 4242 4242 4242 4242 s budúcim dátumom a ľubovoľným CVC. Overte úspech, zrušenie a doručenie webhooku. Potom nastavte živý kľúč aj živý webhook z rovnakého Stripe účtu. Platba smeruje na účet vlastníka nastaveného kľúča; výplaty na bankový účet sa nastavujú v Stripe.

## Objednávky a hosting
Server overuje ceny nezávisle od prehliadača. Podpísané webhooky ukladajú potvrdené platby bez údajov o karte do `orders/`, bez duplicitného zápisu pri opakovanom webhooku. Použite trvalý disk, zálohovanie a jednu inštanciu servera; detaily a adresy objednávok nájdete v Stripe. Odosielanie tovaru a e-mailov nie je automatizované. Tajné súbory a priečinok objednávok server nezverejňuje.

Tento balík vyžaduje Node hosting; pôvodný Netlify Drop pre platby nestačí. Zmeny zatiaľ nie sú publikované a živá platba nebola overená bez vášho účtu.

Overenie: `npm test`. Dokumentácia integrácie: https://docs.stripe.com/checkout/fulfillment

## Vercel
Balík už obsahuje vercel.json, bezpečne oddelené verejné súbory a API pre Stripe. Nasaďte priečinok do projektu my-proje. Webhook potvrdenia sa pri nasadení na Verceli ukladajú do metadát platby v Stripe; objednávky vybavujte ručne zo Stripe Dashboard. Stripe kľúče nastavte v prostredí Production. SITE_URL je pre tieto API pevne https://memoryorb-shop.store. Predvolený stav zostáva bez aktívnych platieb do nastavenia účtu a údajov obchodu.
