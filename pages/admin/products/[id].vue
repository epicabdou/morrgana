<!-- pages/admin/products/[id].vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Edit Product</h1>
      <p class="mt-2 text-sm text-gray-700">Update product information.</p>
    </div>

    <div v-if="productsStore.isLoading" class="text-center py-8">
      Loading...
    </div>

    <div v-else-if="product" class="bg-white shadow rounded-lg p-6">
      <ProductForm
        :product="product"
        :categories="categories"
        :tags="tags"
        @submit="handleSubmit"
      />
    </div>

    <div v-else class="text-center py-8 text-red-600">
      Product not found
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const product = computed(() => productsStore.currentProduct)
const categories = computed(() => categoriesStore.categories)
const tags = ref([])

const handleSubmit = async (formData: FormData) => {
  try {
    await productsStore.updateProduct(route.params.id as string, formData)
    await router.push('/admin/products')
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Failed to update product')
  }
}

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProduct(route.params.id as string),
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