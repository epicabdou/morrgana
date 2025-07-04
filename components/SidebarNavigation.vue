<!-- components/SidebarNavigation.vue -->
<template>
  <ul role="list" class="flex flex-1 flex-col gap-y-7">
    <li>
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <NuxtLink
            :to="item.href"
            :class="[
              $route.path === item.href
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                $route.path === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                'h-6 w-6 shrink-0'
              ]"
              aria-hidden="true"
            />
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </li>
    <li class="-mx-6 mt-auto">
      <button
        @click="authStore.logout()"
        class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 w-full"
      >
        <ArrowRightOnRectangleIcon class="h-6 w-6 text-gray-400" />
        Sign out
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon },
  { name: 'Contact', href: '/admin/contact', icon: ChatBubbleLeftIcon },
]
</script>