// composables/useProducts.ts
export const useProducts = () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const totalPages = ref(0)
  const currentPage = ref(1)

  const fetchProducts = async (options: {
    page?: number
    perPage?: number
    filter?: string
    sort?: string
  } = {}) => {
    isLoading.value = true
    try {
      const pb = usePocketBase()
      const result = await pb.collection('products').getList(
        options.page || 1,
        options.perPage || 20,
        {
          filter: options.filter || '',
          sort: options.sort || '-created',
          expand: 'category,tags'
        }
      )
      
      products.value = result.items
      totalPages.value = result.totalPages
      currentPage.value = result.page
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchProduct = async (slug: string) => {
    isLoading.value = true
    try {
      const pb = usePocketBase()
      const product = await pb.collection('products').getFirstListItem(
        `slug = "${slug}"`,
        { expand: 'category,tags' }
      )
      currentProduct.value = product
      return product
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedProducts = async (limit: number = 8) => {
    return await fetchProducts({
      filter: 'isFeatured = true',
      perPage: limit,
      sort: '-created'
    })
  }

  const fetchNewProducts = async (limit: number = 8) => {
    return await fetchProducts({
      perPage: limit,
      sort: '-created'
    })
  }

  const fetchProductsByCategory = async (categorySlug: string, options: any = {}) => {
    return await fetchProducts({
      ...options,
      filter: `category.slug = "${categorySlug}"`
    })
  }

  const fetchProductsByTag = async (tagSlug: string, options: any = {}) => {
    return await fetchProducts({
      ...options,
      filter: `tags.slug ?~ "${tagSlug}"`
    })
  }

  const searchProducts = async (query: string, options: any = {}) => {
    const searchFilter = `name ~ "${query}" || shortDescription ~ "${query}" || longDescription ~ "${query}"`
    return await fetchProducts({
      ...options,
      filter: searchFilter
    })
  }

  return {
    products: readonly(products),
    currentProduct: readonly(currentProduct),
    isLoading: readonly(isLoading),
    totalPages: readonly(totalPages),
    currentPage: readonly(currentPage),
    fetchProducts,
    fetchProduct,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchProductsByCategory,
    fetchProductsByTag,
    searchProducts
  }
}