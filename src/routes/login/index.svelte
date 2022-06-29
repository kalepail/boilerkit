<script>
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  
  import { handleResponse } from '../../helpers/utils'
  
  export let session_jwt
  export let session_token
  export let secret

  if (
    browser
    && (
      session_jwt 
      || session_token 
      || secret
    )
  ) {
    localStorage.setItem(`${location.hostname}_JWT`, session_jwt)
    localStorage.setItem(`${location.hostname}_TOKEN`, session_token)
    localStorage.setItem(`${location.hostname}_SECRET`, secret)

    goto('/')
  }

  let email = ''
  
  function onSubmit(e) {
    const formData = new FormData(e.target)
  
    return fetch(`/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email')
      })
    })
    .then(handleResponse)
    .then((res) => email = '')
    .catch(() => alert('Error'))
  }
</script>

<form on:submit|preventDefault={onSubmit} class="flex flex-col items-start">
  <label class="flex flex-col mb-2">
    <span class="text-sm">Enter your email</span>
    <input name="email" bind:value={email} class="border-2 border-black rounded px-1" type="text" placeholder="Your email">
  </label>

  <button class="bg-blue-500 text-white rounded px-2 py-1">Login</button>
</form>