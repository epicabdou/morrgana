import PocketBase from 'pocketbase'

let pb: PocketBase

export const usePocketBase = () => {
  if (!pb) {
    const config = useRuntimeConfig()
    pb = new PocketBase(config.public.pocketbaseUrl)
    
    // Add request interceptor for rate limiting
    pb.beforeSend = function (url, options) {
      // Add delay between requests to avoid rate limiting
      return new Promise(resolve => {
        setTimeout(() => resolve({ url, options }), 100)
      })
    }
  }
  
  return pb
}