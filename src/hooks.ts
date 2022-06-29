import cloudflareAdapterPlatform from './helpers/_mf'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.platform = await cloudflareAdapterPlatform(event.platform)
  return resolve(event)
}