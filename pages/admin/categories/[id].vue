<!-- pages/admin/categories/[id].vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Edit Category</h1>
      <p class="mt-2 text-sm text-gray-700">Update category information.</p>
    </div>

    <div v-if="categoriesStore.isLoading" class="text-center py-8">
      Loading...
    </div>

    <div v-else-if="currentCategory" class="bg-white shadow rounded-lg p-6">
      <CategoryForm
        :category="currentCategory"
        :categories="categories"
        @submit="handleSubmit"
      />
    </div>

    <div v-else class="text-center py-8 text-red-600">
      Category not found
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)
const currentCategory = computed(() => 
  categories.value.find(cat => cat.id === route.params.id)
)

const handleSubmit = async (formData: FormData) => {
  try {
    await categoriesStore.updateCategory(route.params.id as string, formData)
    await router.push('/admin/categories')
  } catch (error) {
    console.error('Error updating category:', error)
    alert('Failed to update category')
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
})
</script>