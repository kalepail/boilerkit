import { Keypair } from 'stellar-base'

import { shajs } from '../helpers/utils'

export async function get({ request, url, platform }) {
  // const { env, context } = platform
  // const { KV, DO } = env

  // const id = DO.idFromName('hello world')
  // const stub = DO.get(id)
  // const res = await stub.fetch(url)

  const now = new Date()
  const hours = now.getHours()

  const keypairSeed = await shajs(String(hours))
  const keypair = Keypair.fromRawEd25519Seed(keypairSeed)

  return {
    status: 200,
    body: {
      keypair: {
        publicKey: keypair.publicKey(),
        secret: keypair.secret()
      }
    }
  }
}