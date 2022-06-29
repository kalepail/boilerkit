<script>
import { onMount } from "svelte";

export let keypair

onMount(async () => {
  const { Keypair } = await import('stellar-sdk')

  const secret = localStorage.getItem(`${location.hostname}_SECRET`)

  if (secret) {
    const kp = Keypair.fromSecret(secret)

    keypair = {
      publicKey: kp.publicKey(),
      secret: kp.secret()
    }
  }
})
</script>

<h1>Welcome to Test Kit</h1>
<a class="underline text-blue-500" href="/login">Login</a>
<p>{keypair.publicKey}</p>
<p>{keypair.secret}</p>