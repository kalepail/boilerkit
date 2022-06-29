export class Do {
  constructor(context, env) {
    this.storage = context.storage
    this.env = env
  }

  fetch() {
    this.storage.put('hello', 'world')
    return new Response(null, {status: 204})
  }
}