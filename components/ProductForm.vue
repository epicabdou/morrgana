<!-- components/ProductForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Basic Information -->
      <div class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
          <input
            id="slug"
            v-model="form.slug"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="shortDescription" class="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea
            id="shortDescription"
            v-model="form.shortDescription"
            rows="3"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
          <Editor
            v-model="form.longDescription"
            :init="editorConfig"
            class="mt-1"
          />
        </div>
      </div>

      <!-- Pricing and Inventory -->
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price (€)</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              step="0.01"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="promoPrice" class="block text-sm font-medium text-gray-700">Promo Price (€)</label>
            <input
              id="promoPrice"
              v-model.number="form.promoPrice"
              type="number"
              step="0.01"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
          <input
            id="stock"
            v-model.number="form.stock"
            type="number"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
          <select
            id="tags"
            v-model="form.tags"
            multiple
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            size="4"
          >
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
          </select>
        </div>

        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="isFeatured"
              v-model="form.isFeatured"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isFeatured" class="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>

          <div class="flex items-center">
            <input
              id="isHero"
              v-model="form.isHero"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isHero" class="ml-2 block text-sm text-gray-900">
              Hero Product
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Upload -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">Main Image</label>
        <input
          id="image"
          ref="imageInput"
          type="file"
          accept="image/*"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <label for="gallery" class="block text-sm font-medium text-gray-700">Gallery Images</label>
        <input
          id="gallery"
          ref="galleryInput"
          type="file"
          accept="image/*"
          multiple
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end space-x-3">
      <NuxtLink
        to="/admin/products"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </NuxtLink>
      <button
        type="submit"
        :disabled="isLoading"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Product, Category, Tag } from '~/types'
import Editor from '@tinymce/tinymce-vue'

interface Props {
  product?: Product | null
  categories: Category[]
  tags: Tag[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: FormData]
}>()

const imageInput = ref<HTMLInputElement>()
const galleryInput = ref<HTMLInputElement>()
const isLoading = ref(false)

const form = reactive({
  name: props.product?.name || '',
  slug: props.product?.slug || '',
  shortDescription: props.product?.shortDescription || '',
  longDescription: props.product?.longDescription || '',
  price: props.product?.price || 0,
  promoPrice: props.product?.promoPrice || null,
  stock: props.product?.stock || null,
  category: props.product?.category || '',
  tags: props.product?.tags || [],
  isFeatured: props.product?.isFeatured || false,
  isHero: props.product?.isHero || false
})

// Get runtime config for TinyMCE API key
const { $config } = useNuxtApp()

// TinyMCE configuration
const editorConfig = {
  api_key: $config.public.tinymceApiKey,
  height: 300,
  menubar: false,
  plugins: [
    'lists', 'link', 'image', 'paste', 'help', 'wordcount',
    'table', 'code', 'searchreplace', 'autolink', 'media'
  ],
  toolbar: 'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image media table | code | help',
  content_style: 'body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; font-size: 14px }',
  paste_as_text: false,
  paste_data_images: true,
  image_advtab: true,
  link_default_target: '_blank',
  link_title: false,
  resize: false,
  branding: false,
  elementpath: false,
  statusbar: false,
  formats: {
    alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-left' },
    aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-center' },
    alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-right' },
    alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-justify' }
  }
}

// Auto-generate slug from name
watch(() => form.name, (newName) => {
  if (!props.product) { // Only auto-generate for new products
    form.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    
    // Add form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'tags' && Array.isArray(value)) {
        value.forEach(tag => formData.append('tags', tag))
      } else if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString())
      }
    })
    
    // Add files
    if (imageInput.value?.files?.[0]) {
      formData.append('image', imageInput.value.files[0])
    }
    
    if (galleryInput.value?.files) {
      Array.from(galleryInput.value.files).forEach(file => {
        formData.append('gallery', file)
      })
    }
    
    emit('submit', formData)
  } finally {
    isLoading.value = false
  }
}
</script>