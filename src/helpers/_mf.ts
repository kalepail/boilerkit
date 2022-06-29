// https://github.com/sveltejs/kit/issues/4292

import { dev } from '$app/env'

let context

const exposeCFGlobals = (globalObjects:object, ctx) => {
  Object
  .entries(globalObjects)
  .forEach(([key, val]) => {
    global[key] = val
  })

  context = ctx
}

const fn = (ctx) => {
  exposeCFGlobals({crypto, caches}, ctx)
  return
}

export default async (_platform: App.Platform) => {
  if (!dev)
    return _platform

  if (_platform)
    return _platform

  const esbuild = await import('esbuild')
  const path = await import('path')
  const fs = await import('fs')

  const sourcefile = path.join(process.cwd(), '/src/helpers/do.js')
  const sourceCode = fs.readFileSync(sourcefile).toString('utf8')
  
  const { code } = esbuild.transformSync(`
    const fn = ${fn.toString()};
    export default {
      fetch: async (request, env2, ctx2) => {
        fn(ctx2);
        return new Response('Hello Miniflare!');
      }
    };
    ${sourceCode}
    `, {
      loader: 'ts',
      sourcemap: 'inline'
    }
  )

  const { Miniflare } = await import('miniflare')
  const mf = new Miniflare({
    modules: true,
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,

    kvPersist: true,
    cachePersist: true,
    durableObjectsPersist: true,

    globalAsyncIO: true,
    globalTimers: true,
    globalRandom: true,
    
    script: code,
    globals: { exposeCFGlobals }, 
  })

  await mf.dispatchFetch('https://host.tld')

  const env = await mf.getBindings()
  const platform: App.Platform = {env, context}

  return platform
}