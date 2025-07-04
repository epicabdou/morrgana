<!-- pages/admin/products/create.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Create Product</h1>
      <p class="mt-2 text-sm text-gray-700">Add a new product to your store.</p>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <ProductForm
        :categories="categories"
        :tags="tags"
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
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)
const tags = ref([])

const handleSubmit = async (formData: FormData) => {
  try {
    await productsStore.createProduct(formData)
    await router.push('/admin/products')
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Failed to create product')
  }
}

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    fetchTags()
  ])
})

const fetchTags = async () => {
  try {
    const pb = usePocketBase()
    const result = await pb.collection('tags').getFullList({
      sort: 'name'
    })
    tags.value = result
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}
</script>