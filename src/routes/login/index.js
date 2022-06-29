import { Keypair } from 'stellar-base'

import { handleResponse, shajs } from '../../helpers/utils'

export async function get({ platform, url }) {
  const { env } = platform
  const { STYTCH_AUTH } = env
  const { searchParams } = url
  const token = searchParams.get('token')

  let body = {
    session_jwt: null,
    session_token: null,
    secret: null
  }

  if (token) {
    body = await fetch('https://test.stytch.com/v1/magic_links/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(STYTCH_AUTH).toString('base64')}`
      },
      body: JSON.stringify({
        token,
        session_duration_minutes: 60 * 24 * 7 // 1 week
      })
    })
    .then(handleResponse)

    const keypairSeed = await shajs(body.method_id)
    const keypair = Keypair.fromRawEd25519Seed(keypairSeed)

    body.secret = keypair.secret()
  }

  return {
    status: 200,
    body: {
      session_jwt: body?.session_jwt,
      session_token: body?.session_token,
      secret: body?.secret
    }
  }
}

export async function post({ request, platform, url }) {
  const { env } = platform
  const { STYTCH_AUTH } = env
  const body = await request.json()
  const { email } = body
  const { origin } = url

  await fetch('https://test.stytch.com/v1/magic_links/email/login_or_create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(STYTCH_AUTH).toString('base64')}`
    },
    body: JSON.stringify({
      email,
      login_magic_link_url: `${origin}/login`,
      signup_magic_link_url: `${origin}/login`,
    })
  })
  .then(handleResponse)

//   await fetch('https://api.mailchannels.net/tx/v1/send', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       personalizations: [{
//         to: [{
//           email,
//         }]          
//       }],
//       from: {
//         email:`noreply+${Math.random()}@${host}`
//       },
//       subject: `Login to ${host}`,
//       content: [{
//         type: 'text/html; charset=utf-8',
//         value: `Click the link below to login to ${host}
// <a href="${link}">${link}</a>
// `,
//       }],
//     }),
//   })
//   .then(handleResponse)

  return {
    status: 200,
    body
  }
}