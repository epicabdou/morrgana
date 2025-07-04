<!-- pages/admin/categories/create.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Create Category</h1>
      <p class="mt-2 text-sm text-gray-700">Add a new product category.</p>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <CategoryForm
        :categories="categories"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)

const handleSubmit = async (formData: FormData) => {
  try {
    await categoriesStore.createCategory(formData)
    await router.push('/admin/categories')
  } catch (error) {
    console.error('Error creating category:', error)
    alert('Failed to create category')
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
})
</script>