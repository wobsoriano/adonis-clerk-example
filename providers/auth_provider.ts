export default class AuthProvider {
  async boot() {
    await import('../src/extensions.js')
  }
}
