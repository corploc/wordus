<p align="center">
  <img src="public/images/logo/logo_full.png" alt="Wordus Logo" width="400">
</p>

<p align="center">
  <strong>Jeu de frappe multijoueur en temps réel</strong>
</p>

<p align="center">
  <a href="https://wordus.xyz">wordus.xyz</a> •
  <a href="#fonctionnalités">Fonctionnalités</a> •
  <a href="#installation">Installation</a> •
  <a href="#docker">Docker</a> •
  <a href="#contribution">Contribution</a>
</p>

---

## À propos

**Wordus** est un jeu de frappe multijoueur où vous affrontez vos amis en temps réel. Créez une partie, partagez le code d'invitation et tapez les mots plus vite que vos adversaires pour grimper au scoreboard !

## Fonctionnalités

- **Multijoueur temps réel** — Jusqu'à 6 joueurs par partie
- **3 langues disponibles** — Français (320k mots), Anglais (68k mots), Latin (2600 mots)
- **Paramètres personnalisables** — Durée (30-180s), nombre de mots affichés (1-8)
- **Avatars personnalisables** — Choisissez votre avatar et pseudo
- **Système de combo** — Enchaînez les mots pour maximiser votre score

## Stack technique

| Technologie | Usage |
|-------------|-------|
| [Nuxt 4](https://nuxt.com) | Framework Vue.js |
| [Vue 3](https://vuejs.org) | UI réactive |
| [Pinia](https://pinia.vuejs.org) | State management |
| [TailwindCSS](https://tailwindcss.com) | Styling |
| [Socket.io](https://socket.io) | WebSockets temps réel |
| [pnpm](https://pnpm.io) | Package manager |

## Installation

### Prérequis

- Node.js 20+
- pnpm

### Développement

```bash
# Cloner le repo
git clone https://github.com/corploc/wordus.git
cd wordus

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

### Build de production

```bash
pnpm build
pnpm preview
```

## Docker

### Build

```bash
docker build -t wordus \
  --build-arg NUXT_UMAMI_WEBSITE_ID=your-id \
  --build-arg NUXT_UMAMI_HOST=https://cloud.umami.is \
  .
```

### Run

```bash
docker run -p 3000:3000 wordus
```

## Configuration

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NUXT_UMAMI_WEBSITE_ID` | ID du site Umami (analytics) | - |
| `NUXT_UMAMI_HOST` | Host Umami | `https://cloud.umami.is` |

## Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/ma-feature`)
3. Committez vos changements (`git commit -m 'feat: ajout de ma feature'`)
4. Push sur la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

### Conventions de commit

Ce projet utilise [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage
- `refactor:` refactoring
- `test:` ajout de tests

## License

MIT © [corploc](https://github.com/corploc)
