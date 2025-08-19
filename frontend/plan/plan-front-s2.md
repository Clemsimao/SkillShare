# Plan Front (Next.js + React + Tailwind + daisyUI + Headless UI)

## Préparation & outillage

- [ ] **Initialiser le projet Next.js (TS, App Router, Tailwind)**  
  ```bash
  npx create-next-app@latest frontend
  ```

- [ ] **Entrer dans le dossier**  
  ```bash
  cd frontend
  ```

- [ ] **Installer les plugins Tailwind (forms/typography)**  
  ```bash
  npm i -D @tailwindcss/forms @tailwindcss/typography
  ```

- [ ] **Installer daisyUI**  
  ```bash
  npm i -D daisyui
  ```

- [ ] **Installer Headless UI**  
  ```bash
  npm i @headlessui/react
  ```

- [ ] **Installer un set d'icônes (Lucide)**  
  ```bash
  npm i lucide-react
  ```

- [ ] **Configurer ESLint + Prettier**  
  ```bash
  npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier
  ```

- [ ] **Initialiser Husky (pre-commit)**  
  ```bash
  npx husky-init && npm i
  npx husky add .husky/pre-commit "npx lint-staged"
  ```

- [ ] **Configurer Commitlint (optionnel)**  
  ```bash
  npm i -D @commitlint/cli @commitlint/config-conventional
  echo "export default { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
  npx husky add .husky/commit-msg "npx --no-install commitlint --edit \$1"
  ```

- [ ] **Définir des alias de chemins (tsconfig)**  
  (éditer tsconfig.json → compilerOptions.paths pour @/*)

## Architecture & conventions

- [ ] **Structurer l'arborescence (app/, components/, hooks/, lib/, styles/, types/)**  
  (créer dossiers selon besoin)

- [ ] **Créer un kit de composants UI**  
  (créer components/ui/)

- [ ] **Séparer server/client components**  
  (placer "use client" en tête des composants client)

- [ ] **Centraliser les variables d'env**  
  (créer .env.local, n'exposer que via NEXT_PUBLIC_ si nécessaire)

## Design system & theming

- [ ] **Activer daisyUI dans Tailwind**  
  (ajouter require('daisyui') dans tailwind.config.js → plugins: [require('daisyui'), ...])

- [ ] **Ajouter les thèmes daisyUI**  
  (définir daisyui: { themes: ['light','dark','cupcake', ...] } dans tailwind.config.js)

- [ ] **Installer une lib d'icônes complémentaire (facultatif)**  
  ```bash
  npm i @phosphor-icons/react
  ```

- [ ] **Gérer le dark mode via data-theme**  
  (utiliser document.documentElement.setAttribute('data-theme','dark|light'))

## Accessibilité (a11y)

- [ ] **Vérifier le contraste**  
  (Chrome Lighthouse ou axe DevTools)

- [ ] **Garantir la navigation clavier**  
  (tester focus/ordre, Headless UI aide pour Dialog/Menu/etc.)

- [ ] **Installer l'extension axe (dev)**  
  (installer l'extension navigateur)

- [ ] **Ajouter eslint-plugin-jsx-a11y**  
  ```bash
  npm i -D eslint-plugin-jsx-a11y
  ```

## Navigation & routing

- [ ] **Créer le layout racine**  
  (créer app/layout.tsx)

- [ ] **Gérer les états de chargement/erreur**  
  (créer app/loading.tsx et app/error.tsx)

- [ ] **Créer la page not-found**  
  (créer app/not-found.tsx)

## Données & appels réseau

- [ ] **Privilégier les Server Components/Actions**  
  (utiliser fetch côté serveur / Server Actions si adaptées)

- [ ] **Gérer le cache/revalidate**  
  (utiliser fetch(..., { cache: 'no-store' }) ou export const revalidate = X)

- [ ] **Installer une lib de toasts (facultatif)**  
  ```bash
  npm i sonner
  ```

## État & formulaires

- [ ] **Installer React Hook Form + Zod**  
  ```bash
  npm i react-hook-form zod @hookform/resolvers
  ```

- [ ] **Installer une dropzone (optionnel)**  
  ```bash
  npm i react-dropzone
  ```

## SEO & partages

- [ ] **Générer sitemap/robots**  
  ```bash
  npm i next-sitemap
  echo "module.exports = { siteUrl: 'https://votre-domaine.com', generateRobotsTxt: true }" > next-sitemap.config.js
  npx next-sitemap
  ```

- [ ] **Gérer les métadonnées par page**  
  (implémenter export async function generateMetadata(){...})

- [ ] **Ajouter un helper SEO (optionnel)**  
  ```bash
  npm i next-seo
  ```

## Performance

- [ ] **Optimiser les images**  
  (remplacer <img> par next/image + sizes adaptés)

- [ ] **Intégrer les polices avec next/font**  
  (importer depuis next/font/local ou Google dans le code)

- [ ] **Analyser la taille des bundles**  
  ```bash
  npm i -D @next/bundle-analyzer
  ```
  (activer via const withBundleAnalyzer = require('@next/bundle-analyzer')({...}) dans next.config.js)

## Sécurité (front)

- [ ] **Configurer des en-têtes (CSP, etc.)**  
  (définir headers() dans next.config.js pour CSP, frame-ancestors…)

- [ ] **Éviter dangerouslySetInnerHTML**  
  (auditer le code, n'utiliser que si maîtrisé)

- [ ] **Valider les entrées côté client**  
  (valider avec Zod/RHF avant envoi)

## Internationalisation (si nécessaire)

- [ ] **Installer next-intl (App Router friendly)**  
  ```bash
  npm i next-intl
  ```

- [ ] **Configurer les locales et messages**  
  (suivre la doc next-intl — provider, fichiers de messages)

## Analytique & logs

- [ ] **Intégrer Vercel Analytics (optionnel)**  
  ```bash
  npm i @vercel/analytics
  ```

- [ ] **Intégrer Sentry (optionnel)**  
  ```bash
  npx @sentry/wizard -i nextjs
  ```

## Tests & qualité

- [ ] **Installer tests unitaires + RTL**  
  ```bash
  npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
  ```

- [ ] **Initialiser Vitest (config simple)**  
  ```bash
  echo "import { defineConfig } from 'vitest/config'; export default defineConfig({ test:{ environment:'jsdom' }})" > vitest.config.ts
  ```

- [ ] **Installer Playwright (e2e)**  
  ```bash
  npm i -D @playwright/test && npx playwright install --with-deps
  ```

- [ ] **Ajouter lint Tailwind**  
  ```bash
  npm i -D eslint-plugin-tailwindcss
  ```

## CI/CD & déploiement

- [ ] **Créer workflow GitHub Actions (lint/tests/build)**  
  ```bash
  mkdir -p .github/workflows && echo "name: CI\non: [push, pull_request]\njobs:\n ci:\n runs-on: ubuntu-latest\n steps:\n - uses: actions/checkout@v4\n - uses: actions/setup-node@v4\n with: { node-version: 20 }\n - run: npm ci\n - run: npm run lint\n - run: npm run typecheck\n - run: npm run test -- --run\n - run: npm run build" > .github/workflows/ci.yml
  ```

- [ ] **Installer CLI Vercel (optionnel)**  
  ```bash
  npm i -g vercel
  vercel
  ```

- [ ] **Configurer variables d'env par env**  
  (via Vercel dashboard ou .env.*)

## États d'erreur & vides

- [ ] **Créer les écrans vides**  
  (composants/états dédiés)

- [ ] **Créer 404/500 personnalisées**  
  (créer app/not-found.tsx et page d'erreur globale)

## PWA (optionnel)

- [ ] **Installer next-pwa**  
  ```bash
  npm i next-pwa
  ```

- [ ] **Générer manifest + icônes**  
  ```bash
  npm i -D pwa-asset-generator
  npx pwa-asset-generator public/logo.png public/icons
  ```

- [ ] **Tester Lighthouse**  
  (Chrome DevTools > Lighthouse)

## Animations & micro-interactions

- [ ] **Installer Framer Motion**  
  ```bash
  npm i framer-motion
  ```

- [ ] **Respecter prefers-reduced-motion**  
  (implémenter via CSS media query / garde JS)

## Tables & listes (si volumineuses)

- [ ] **Virtualiser les listes**  
  ```bash
  npm i @tanstack/react-virtual
  ```

## Documentation & maintenance

- [ ] **Initialiser Storybook (facultatif mais conseillé)**  
  ```bash
  npx storybook@latest init
  ```

- [ ] **Rédiger le README**  
  (créer/compléter README.md)

- [ ] **Publier la doc des composants**  
  (déployer Storybook en preview Vercel si besoin)