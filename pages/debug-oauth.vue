<!-- pages/debug-oauth.vue - Fixed detection logic -->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">OAuth Debug Panel</h1>
      
      <!-- Success Message -->
      <div v-if="oauthWorking" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <h2 class="font-bold">✅ OAuth is Working!</h2>
        <p>Google OAuth is properly configured and working. The 400 error in your app might be due to admin privilege checking.</p>
        <div class="mt-2">
          <p><strong>Authenticated User:</strong> {{ authenticatedUser }}</p>
          <p><strong>Is Admin:</strong> {{ isUserAdmin ? 'Yes' : 'No (this might be the issue)' }}</p>
        </div>
      </div>
      
      <!-- PocketBase Connection Test -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">1. PocketBase Connection</h2>
        <button
          @click="testPocketBaseConnection"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
        <div v-if="connectionResult" class="mt-4 p-4 rounded" :class="connectionResult.success ? 'bg-green-100' : 'bg-red-100'">
          <pre>{{ JSON.stringify(connectionResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Auth Methods Test -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">2. Auth Methods</h2>
        <button
          @click="testAuthMethods"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Check Auth Methods
        </button>
        <div v-if="authMethodsResult" class="mt-4 p-4 rounded" :class="authMethodsResult.success ? 'bg-green-100' : 'bg-red-100'">
          <div class="mb-2">
            <strong>Google Provider Status:</strong> 
            <span :class="googleProviderFound ? 'text-green-600' : 'text-red-600'">
              {{ googleProviderFound ? 'FOUND ✅' : 'NOT FOUND ❌' }}
            </span>
          </div>
          <pre>{{ JSON.stringify(authMethodsResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Current Auth Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">3. Current Auth Status</h2>
        <div class="space-y-2">
          <p><strong>Is Authenticated:</strong> {{ pb.authStore.isValid ? 'Yes ✅' : 'No ❌' }}</p>
          <p v-if="pb.authStore.record"><strong>User Email:</strong> {{ pb.authStore.record.email }}</p>
          <p v-if="pb.authStore.record"><strong>Is Admin:</strong> {{ pb.authStore.record.isAdmin ? 'Yes ✅' : 'No ❌' }}</p>
          <p v-if="pb.authStore.record"><strong>Full Name:</strong> {{ pb.authStore.record.fullName || 'Not set' }}</p>
          <button
            v-if="pb.authStore.isValid"
            @click="pb.authStore.clear()"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Auth
          </button>
        </div>
      </div>

      <!-- Admin Promotion -->
      <div v-if="pb.authStore.record && !pb.authStore.record.isAdmin" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <h2 class="font-bold">⚠️ Admin Access Required</h2>
        <p>Your account ({{ pb.authStore.record.email }}) is not an admin. You need to promote this user to admin in PocketBase.</p>
        <div class="mt-4">
          <h3 class="font-semibold">To fix this:</h3>
          <ol class="list-decimal list-inside mt-2 space-y-1">
            <li>Go to PocketBase Admin Panel: <code>http://127.0.0.1:8090/_/</code></li>
            <li>Navigate to Collections → users</li>
            <li>Find user: <strong>{{ pb.authStore.record.email }}</strong></li>
            <li>Edit the user and check the "isAdmin" field</li>
            <li>Save the changes</li>
          </ol>
          <button
            @click="tryPromoteToAdmin"
            class="mt-3 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Try Auto-Promote to Admin
          </button>
        </div>
      </div>

      <!-- Environment Variables -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">4. Environment Variables</h2>
        <div class="bg-gray-100 p-4 rounded">
          <pre>{{ JSON.stringify(envVars, null, 2) }}</pre>
        </div>
      </div>

      <!-- Quick OAuth Test -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">5. Quick OAuth Test</h2>
        <button
          @click="quickOAuthTest"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test OAuth Login
        </button>
        <div v-if="quickTestResult" class="mt-4 p-4 rounded" :class="quickTestResult.success ? 'bg-green-100' : 'bg-red-100'">
          <pre>{{ quickTestResult.message }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = usePocketBase()
const config = useRuntimeConfig()

const connectionResult = ref(null)
const authMethodsResult = ref(null)
const quickTestResult = ref(null)

const envVars = computed(() => ({
  pocketbaseUrl: config.public.pocketbaseUrl,
  siteUrl: config.public.siteUrl,
  googleClientId: config.public.googleClientId ? `${config.public.googleClientId.substring(0, 20)}...` : 'NOT SET'
}))

const googleProviderFound = computed(() => {
  if (!authMethodsResult.value?.data) return false
  const providers = authMethodsResult.value.data.oauth2?.providers || []
  return providers.some(p => p.name === 'google')
})

const oauthWorking = computed(() => {
  return quickTestResult.value?.success || pb.authStore.isValid
})

const authenticatedUser = computed(() => {
  return pb.authStore.record?.email || 'None'
})

const isUserAdmin = computed(() => {
  return pb.authStore.record?.isAdmin || false
})

const testPocketBaseConnection = async () => {
  try {
    const response = await fetch(`${config.public.pocketbaseUrl}/api/health`)
    const data = await response.json()
    connectionResult.value = {
      success: true,
      status: response.status,
      data
    }
  } catch (error) {
    connectionResult.value = {
      success: false,
      error: error.message
    }
  }
}

const testAuthMethods = async () => {
  try {
    const methods = await pb.collection('users').listAuthMethods()
    authMethodsResult.value = {
      success: true,
      data: methods
    }
  } catch (error) {
    authMethodsResult.value = {
      success: false,
      error: error.message
    }
  }
}

const quickOAuthTest = async () => {
  try {
    quickTestResult.value = { message: 'Starting OAuth test...', success: false }
    
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
    
    quickTestResult.value = {
      success: true,
      message: `OAuth SUCCESS!\nUser: ${authData.record.email}\nAdmin: ${authData.record.isAdmin ? 'Yes' : 'No'}\nFull Name: ${authData.record.fullName || 'Not set'}`
    }
  } catch (error) {
    quickTestResult.value = {
      success: false,
      message: `OAuth FAILED: ${error.message}\nStatus: ${error.status}\nData: ${JSON.stringify(error.data, null, 2)}`
    }
  }
}

const tryPromoteToAdmin = async () => {
  if (!pb.authStore.record) return
  
  try {
    const updatedUser = await pb.collection('users').update(pb.authStore.record.id, {
      isAdmin: true
    })
    
    alert('Successfully promoted to admin! You can now access the admin panel.')
    
    // Update the auth store
    pb.authStore.save(pb.authStore.token, updatedUser)
  } catch (error) {
    alert(`Failed to promote to admin: ${error.message}\n\nPlease promote manually in PocketBase admin panel.`)
  }
}

onMounted(() => {
  // Auto-run basic tests
  testPocketBaseConnection()
  testAuthMethods()
})
</script>