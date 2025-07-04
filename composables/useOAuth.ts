// composables/useOAuth.ts - OAuth helper composable
export const useOAuth = () => {
  const pb = usePocketBase()

  const getOAuthProviders = async () => {
    try {
      const authMethods = await pb.collection('users').listAuthMethods()
      return authMethods.authProviders || []
    } catch (error) {
      console.error('Error fetching OAuth providers:', error)
      return []
    }
  }

  const loginWithProvider = async (provider: string, createData?: any) => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider,
        createData: {
          emailVisibility: true,
          ...createData
        }
      })
      return authData
    } catch (error) {
      console.error(`OAuth login error with ${provider}:`, error)
      throw error
    }
  }

  return {
    getOAuthProviders,
    loginWithProvider
  }
}