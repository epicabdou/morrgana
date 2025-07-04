// plugins/oauth.client.ts - OAuth configuration plugin
export default defineNuxtPlugin(async () => {
  const pb = usePocketBase()
  
  // Configure OAuth redirect URLs based on environment
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'http://localhost:3000'
  
  // Set OAuth redirect URL for Google
  if (process.client) {
    try {
      const authMethods = await pb.collection('users').listAuthMethods()
      if (authMethods.authProviders) {
        const googleProvider = authMethods.authProviders.find(p => p.name === 'google')
        if (googleProvider) {
          // The redirect URL should match what's configured in Google Console
          console.log('Google OAuth available:', googleProvider)
        }
      }
    } catch (error) {
      console.error('Error checking OAuth providers:', error)
    }
  }
})