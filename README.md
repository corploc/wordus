<p align="center">
  <img src="public/images/logo/logo_full.png" alt="Wordus Logo" width="400">
</p>

<p align="center">
  <strong>Real-time multiplayer typing game</strong>
</p>

<p align="center">
  <a href="https://wordus.xyz">wordus.xyz</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#docker">Docker</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/v/release/corploc/wordus" alt="GitHub Release">
  <img src="https://img.shields.io/github/actions/workflow/status/corploc/wordus/release.yml" alt="GitHub Actions">
  <img src="https://img.shields.io/github/license/corploc/wordus" alt="License">
  <img src="https://img.shields.io/docker/pulls/corploc/wordus" alt="Docker Pulls">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white" alt="Nuxt">
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white" alt="Vue">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io&logoColor=white" alt="Socket.io">
  <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm">
</p>

---

## About

**Wordus** is a multiplayer typing game where you compete against your friends in real-time. Create a game, share the invite code, and type words faster than your opponents to climb the scoreboard!

## Features

- **Real-time multiplayer** — Up to 6 players per game via WebSocket
- **3 word languages** — French (320k words), English (68k words), Latin (2600 words)
- **Bilingual interface** — French and English with automatic browser detection
- **Light/Dark theme** — Toggle between modes with system preference detection
- **Customizable settings** — Duration (30-180s), number of displayed words (1-8)
- **Customizable avatars** — Choose your avatar and username
- **Combo system** — Chain words to maximize your score with multipliers

## Tech Stack

| Technology | Usage |
|------------|-------|
| [Nuxt 4](https://nuxt.com) | Vue.js framework |
| [Vue 3](https://vuejs.org) | Reactive UI |
| [TypeScript](https://www.typescriptlang.org) | Static typing |
| [Pinia](https://pinia.vuejs.org) | State management |
| [TailwindCSS](https://tailwindcss.com) | Styling |
| [Socket.io](https://socket.io) | Real-time WebSockets |
| [pnpm](https://pnpm.io) | Package manager |

## Installation

### Prerequisites

- Node.js 20+
- pnpm

### Development

```bash
# Clone the repo
git clone https://github.com/corploc/wordus.git
cd wordus

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

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

### Docker Hub Image

```bash
docker pull corploc/wordus
docker run -p 3000:3000 corploc/wordus
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_UMAMI_WEBSITE_ID` | Umami site ID (analytics) | - |
| `NUXT_UMAMI_HOST` | Umami host | `https://cloud.umami.is` |
| `NUXT_PUBLIC_BASE_URL` | Base URL of the application (used for socket connections) | `http://localhost:3000` |

## Contributing

Contributions are welcome!

1. Fork the project
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` refactoring
- `test:` adding tests

## License

MIT © [corploc](https://github.com/corploc)
