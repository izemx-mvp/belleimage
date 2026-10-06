# BELLE IMAGE — Plan de construction

Source de vérité : `prompt-belle-image.md` (PART A = spec, PART B = instructions).
Ce document suit l'audit, les décisions et l'avancement par phase.

## Environnement

- **Bun n'est pas installé sur la machine de build locale.** Les `node_modules` existants ont été
  installés avec npm (`package-lock.json`). Les scripts sont identiques : `npm run build` ≡
  `bun run build`, `npm run test` ≡ `bun run test` (Vite / Vitest). Aucune dépendance ajoutée.
- Déploiement : `.github/workflows/deploy.yml` délègue à `izemx-mvp/.github/.../mvp-deploy.yml`
  (build Vite + Nitro, cible Cloudflare). On garde `vite build` intact et aucune API serveur.

## Audit — ce qui existe

| Fichier | État | Action |
| --- | --- | --- |
| `src/config/site.ts` | Bon : adresse, téléphone, horaires, zones, seuil livraison offerte | Compléter : libellé « Plus de 10 000 références » À CONFIRMER, tableau garanties, options étage/installation, liste des villes de zone, Instagram à confirmer |
| `src/data/products.ts` | 40 produits exemple, pas d'images | Ajouter `image` (manifeste), `gallery`, quelques produits pour couvrir les visuels (lave-vaisselle, chauffe-eau), retirer les notes non justifiées |
| `src/data/categories.ts` | 10 catégories, sous-catégories, attributs | Ajouter `image` (cat-*), sous-catégories lave-vaisselle / chauffe-eau |
| `src/data/posts.ts` | 5 articles exemple | Ajouter `image` (blog-*), article « économiser l'énergie » |
| `src/data/brands.ts`, `assistant.ts` | OK (marques placeholder « à confirmer ») | Réutilisés ; FAQ assistant enrichie |
| `src/lib/catalogue.ts` | Couche données + recherche + filtres | Recherche floue (tolère 1 faute, accents), facettes, portée pillar/catégorie |
| `src/lib/commerce.ts` | Prix, téléphone, réf, message WhatsApp, `track()` | `cartTotals()`, messages produit/contact, stockage récap commande (client) |
| `src/store/shop.tsx` | Panier + favoris localStorage, fly-to-cart | Exposer `hydrated`, zone de livraison choisie, corriger types stricts |
| `src/i18n/fr.ts` | Chaînes de base | Étendre à toutes les pages |
| `src/components/layout.tsx` | TopBar, Header (glass), méga-menu, recherche, drawer, panier, footer | Conserver le style ; câbler routes, tuiles promo images, clavier méga-menu, SmartImage |
| `src/components/brand.tsx` | Étoiles, Reveal, CountUp, Reassurance, ProductImage | Logo réparé (voir ci-dessous) ; ProductImage remplacé par SmartImage |
| `src/components/product.tsx` | ProductCard, Price, StockBadge, Countdown, Fav | SmartImage, grille + squelettes |
| `src/components/assistant.tsx` | Flux guidé + recherche locale | Corriger types, cartes SmartImage, recherche floue, hydratation sûre |
| `src/routes/__root.tsx` | Shell, schéma Store, 404 basique | 404 complète, log images manquantes (dev) |
| `src/routes/index.tsx` | Placeholder Lovable | Page d'accueil complète |
| Tests | routing + commerce | + panier, livraison, message WhatsApp, filtres, routes, sitemap |

### Logo

Logo officiel : `src/assets/belle-image-logo.png`, chargé par glob dans `src/lib/images.ts` et exposé sous le
nom `logo` → composant `Logo` (header, menu mobile, footer, assistant, espace client, connexion), favicon,
apple-touch-icon et schéma LocalBusiness. Sans ce fichier, badge de repli (cercle rouge + étoiles).
Le pointeur Lovable `src/assets/logo.jpg.asset.json` n'est plus utilisé.

## Décisions / hypothèses

- Routes catalogue : `boutique.$category.index.tsx` + `boutique.$category.$subcategory.tsx`
  (au lieu de `boutique.$category.tsx`) pour éviter une imbrication parent/enfant : les deux sont
  frères, sans `<Outlet />` à gérer.
- Filtres catalogue dans les search params validés (`validateSearch`) : `q, pillar, cat, brand,
  min, max, promo, stock, sort, view, page` + attributs (`capacite, energie, couleur, feux, taille,
  resolution, puissance, places, matiere`). Les listes sont séparées par des virgules.
- La sous-catégorie est portée par le chemin (`/boutique/:category/:subcategory`), les liens du filtre y mènent.
- Liens `wa.me` : les `href` statiques (déterministes, identiques serveur/client) sont rendus côté
  serveur ; tout message dépendant de `window` (URL de la page) et tous les `window.open` sont
  construits dans des gestionnaires d'événements.
- Notes produits : aucun avis réel → pas de note affichée (« Aucun avis pour le moment »), pas
  d'`aggregateRating` dans le schéma Product.
- Avis clients de l'accueil : exemples explicitement marqués « Exemples — à remplacer par de vrais avis ».
- Squelettes : affichés pendant l'hydratation client des pages dépendant du localStorage (panier,
  favoris, commande) et comme `pendingComponent` des routes catalogue. Pas de faux délai.
- `public/sitemap.xml` est généré depuis les données (`src/lib/sitemap.ts`). Le test
  `sitemap.test.ts` le régénère hors CI et échoue en CI s'il est désynchronisé.
- Frais de livraison : `deliveryFee(zone, sous-total)` — offerte au-delà du seuil (À CONFIRMER).

## Phases

- [x] 0. Audit + PLAN.md
- [x] 1. Fondations (config, 44 produits exemple, libs, store, i18n, système d'images, prix, message WhatsApp)
- [x] 2. Accueil — 13 sections
- [x] 3. Catalogue — filtres URL, tri, « Charger plus », drawer mobile
- [x] 4. Fiche produit
- [x] 5. Panier (drawer + page), commande, flux WhatsApp, confirmation
- [x] 6. Pages secondaires (promotions, marques, à propos, livraison, garantie, conseils, contact, FAQ, CGV, mentions, favoris, 404)
- [x] 7. Assistant (flux guidés + recherche locale floue, sans IA)
- [x] 8. SEO (head() par route, JSON-LD Product/Store/Breadcrumb/FAQ/Article, sitemap, robots), a11y, perf, dataLayer
- [x] 9. QA finale : build OK, `tsc --noEmit` 0 erreur, 66 tests OK, 22 routes vérifiées en SSR (404 réels), 375 px sans débordement horizontal, aucun avertissement d'hydratation, parcours commande complet testé dans le navigateur

## Notes QA

- ESLint : 0 erreur de code ; les erreurs `prettier/prettier` restantes concernent les fins de ligne CRLF
  (checkout Windows) et la largeur de ligne, déjà présentes dans le code Lovable d'origine. `npm run format` les corrige.
- En dev, React StrictMode double certains événements dataLayer (`view_item`, `begin_checkout`) ; pas en production.
- Les animations d'apparition (Stagger/Reveal) partent de l'opacité 0 au SSR, comme d'habitude avec Framer Motion ;
  le hero (LCP) et le fondu de page ne sont jamais masqués au premier rendu.

## À fournir / à confirmer par Belle Image

- Images : les 44 du manifeste (`src/data/images.ts`), dont `logo` et les photos réelles `showroom-1..3`.
- `src/config/site.ts` : numéro WhatsApp, e-mail, Instagram, nom de domaine, tarifs/délais/villes des zones,
  seuil de livraison offerte, options étage/installation/montage, tableau des garanties, « 10 000 références ».
- Marques réelles (`src/data/brands.ts`) et logos ; produits, prix et fiches réels (`src/data/products.ts`).
- Textes : histoire du magasin, articles conseils, politique de retours, CGV, mentions légales (RC, IF, ICE, hébergeur, CNDP).
- Avis clients réels pour remplacer les exemples (`src/data/reviews.ts`).

## Fichiers à créer

- `src/lib/images.ts`, `src/data/images.ts`, `src/components/smart-image.tsx`
- `src/lib/catalogue-search.ts`, `src/lib/seo.ts`, `src/lib/sitemap.ts`
- `src/data/faq.ts`, `src/data/reviews.ts`, `src/data/legal.ts`
- `src/components/sections/{home,catalogue,product,checkout,shared}/*`
- Routes : voir B5.
- Tests : `cart.test.ts`, `filters.test.ts`, `whatsapp.test.ts`, `sitemap.test.ts`, routing étendu.

## Espace client démo (2e itération)

- [x] Connexion `/compte/connexion` (identifiants démo préremplis depuis `site.demoAccount`), store `src/store/auth.tsx`
- [x] Pages `/compte`, `/compte/commandes`, `/compte/commandes/$ref`, `/compte/adresses`, `/compte/profil` ; `/favoris` dans la navigation du compte une fois connecté
- [x] Protection côté client (layout `compte.tsx`, squelette jusqu'à l'hydratation, retour à la page demandée) ; la page de connexion est hors layout (`compte_.connexion.tsx`)
- [x] Header (icône / menu compte), checkout prérempli + sélecteur d'adresse, commande ajoutée au compte (« Envoyée »)
- [x] noindex sur /compte/*, absent du sitemap ; tests `src/test/account.test.tsx`

Décisions : la redirection après connexion n'accepte que des chemins `/compte…` (pas de redirection ouverte) ;
l'URL demandée est lue dans `window.location` au moment de la redirection (l'état du routeur est encore celui
de la page précédente pendant une navigation). Les identifiants de connexion restent ceux de la config :
modifier le téléphone du profil ne change pas l'identifiant démo.
