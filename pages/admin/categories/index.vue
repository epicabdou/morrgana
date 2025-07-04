<!-- pages/admin/categories/index.vue -->
<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Categories</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage product categories and their hierarchy.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <NuxtLink
          to="/admin/categories/create"
          class="btn btn-primary"
        >
          Add Category
        </NuxtLink>
      </div>
    </div>

    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="categoriesStore.isLoading">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
                <tr v-else-if="categories.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
                <tr v-else v-for="category in categories" :key="category.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          class="h-10 w-10 rounded-lg object-cover"
                          :src="getImageUrl(category, 'image')"
                          :alt="category.name"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ category.slug }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {{ category.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getParentName(category.parent) || 'None' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <NuxtLink
                      :to="`/admin/categories/${category.id}`"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </NuxtLink>
                    <button
                      @click="deleteCategory(category.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)

const getImageUrl = (record: any, filename: string) => {
  const pb = usePocketBase()
  return pb.files.getUrl(record, record[filename])
}

const getParentName = (parentId: string) => {
  if (!parentId) return null
  const parent = categories.value.find(cat => cat.id === parentId)
  return parent?.name
}

const deleteCategory = async (id: string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await categoriesStore.deleteCategory(id)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
})
</script>