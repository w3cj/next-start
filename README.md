# Next Start

A basic Next.js starter.

- [Next Start](#next-start)
  - [Stack](#stack)
  - [Branches](#branches)
  - [Setup](#setup)
  - [Resources](#resources)

## Stack

- Linting / Code Style
  - [eslint](https://www.npmjs.com/package/eslint)
    - [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
      - [ESLint | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/eslint#prettier)
    - [eslint-plugin-check-file](https://www.nvpmjs.com/package/eslint-plugin-check-file)
      - [Bulletproof React Guide](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-standards.md#file-naming-conventions)
    - [eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)
  - [prettier](https://www.npmjs.com/package/prettier)
    - [@trivago/prettier-plugin-sort-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports)
    - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
      - [Automatic Class Sorting](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)
- Environment Variables
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [dotenv-expand](https://www.npmjs.com/package/dotenv-expand)
  - [@t3-oss/env-nextjs](https://www.npmjs.com/package/@t3-oss/env-nextjs)
    - [Documentation](https://env.t3.gg/docs/nextjs)
  - [cross-env](https://www.npmjs.com/package/cross-env)
- Styles / UI
  - [tailwindcss](https://www.npmjs.com/package/tailwindcss)
  - [@nextui-org/react](https://www.npmjs.com/package/@nextui-org/react)
    - [NextUI](https://nextui.org/docs/guide/introduction)
  - [next-themes](https://www.npmjs.com/package/next-themes)
  - [@tabler/icons-react](https://www.npmjs.com/package/@tabler/icons-react)
    - [Tabler Icon Search](https://tabler.io/icons)
- Validation
  - [zod](https://www.npmjs.com/package/zod)
  - [@conform-to/zod](https://www.npmjs.com/package/@conform-to/zod)
    - [Conform | Next.js](https://conform.guide/integration/nextjs)
  - [drizzle-zod](https://www.npmjs.com/package/drizzle-zod)
    - [Drizzle Zod Docs](https://orm.drizzle.team/docs/zod)
- Forms
  - [@conform-to/react](https://www.npmjs.com/package/@conform-to/react)
- Database
  - [drizzle-orm](https://www.npmjs.com/package/drizzle-orm)
  - [postgres](https://www.npmjs.com/package/postgres)
  - [drizzle-kit](https://www.npmjs.com/package/drizzle-kit)
- Authentication
  - [next-auth](https://www.npmjs.com/package/next-auth)
  - [@auth/drizzle-adapter](https://www.npmjs.com/package/@auth/drizzle-adapter)
    - [Auth.js Drizzle Adapter Documentation](https://authjs.dev/getting-started/adapters/drizzle)

## Branches

The main branch contains the entire setup. The following branches build on each other from top to bottom:

- [base](https://github.com/w3cj/next-start/tree/base)
  - eslint / prettier settings
- [nextui](https://github.com/w3cj/next-start/tree/nextui)
  - layout / styles
  - dark / light theme toggle
- [typesafe-env](https://github.com/w3cj/next-start/tree/typesafe-env)
  - typesafe environment variables
- [next-auth](https://github.com/w3cj/next-start/tree/next-auth)
  - google oauth with no database
- [drizzle](https://github.com/w3cj/next-start/tree/drizzle) / [main](https://github.com/w3cj/next-start)
  - basic drizzle schema with users / accounts / sessions

## Setup

1. Install dependencies:

```sh
pnpm install
```

2. Copy the `.env` file:

```sh
cp .env.example .env
```

3. Update the following values in the `.env` file:

```sh
NEXTAUTH_SECRET=your-value-here
GOOGLE_CLIENT_ID=your-value-here
GOOGLE_CLIENT_SECRET=your-value-here
```

4. Start the database:

```sh
docker compose up
```

5. Migrate the database:

```sh
pnpm run db:migrate
```

6. Start the app:

```sh
pnpm run dev
```

## Resources

- [Next.js Discord FAQs](https://nextjs-faq.com/)
  - ["Module not found" error on deployment but build works fine locally](https://nextjs-faq.com/module-not-found-due-to-case-sensitivity)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
