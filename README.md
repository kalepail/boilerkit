# boilerkit

Everything you need to build a fullstack Svelte project. Powered by SvelteKit and Cloudflare.

## Developing

Once you've installed dependencies with `pnpm i` (or `npm i` or `yarn`), start a development server:

```bash
pnpm start

# or start the server and open the app in a new browser tab
pnpm start -- --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you'll need to configure a Cloudflare Pages app or a wrangler.toml Cloudflare Workers service. (See https://github.com/tyvdh/poapplesauce for an example)
