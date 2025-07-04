<!-- components/PublicFooter.vue -->
<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 lg:col-span-2">
          <div class="flex items-center mb-4">
            <img src="/logo-white.svg" alt="Morrgana" class="h-8 w-auto" />
          </div>
          <p class="text-gray-300 mb-6 max-w-md">
            Découvrez notre collection de gommages corporels naturels, 
            conçus pour révéler la beauté de votre peau avec des ingrédients 
            soigneusement sélectionnés.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Facebook</span>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Instagram</span>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297L6.391 14.5c.51.51 1.222.826 2.058.826 1.606 0 2.917-1.311 2.917-2.917S9.056 9.492 7.45 9.492c-.836 0-1.548.315-2.058.826L4.126 9.127c.876-.806 2.027-1.297 3.324-1.297 2.712 0 4.91 2.198 4.91 4.91s-2.198 4.91-4.91 4.91z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/products" class="text-gray-300 hover:text-white">Produits</NuxtLink></li>
            <li><NuxtLink to="/categories" class="text-gray-300 hover:text-white">Catégories</NuxtLink></li>
            <li><NuxtLink to="/products/new" class="text-gray-300 hover:text-white">Nouveautés</NuxtLink></li>
            <li><NuxtLink to="/products/deals" class="text-gray-300 hover:text-white">Promotions</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-white">À propos</NuxtLink></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Service client</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact" class="text-gray-300 hover:text-white">Contact</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-300 hover:text-white">FAQ</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="text-gray-300 hover:text-white">Livraison</NuxtLink></li>
            <li><NuxtLink to="/refund" class="text-gray-300 hover:text-white">Retours</NuxtLink></li>
            <li><NuxtLink to="/account" class="text-gray-300 hover:text-white">Mon compte</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Morrgana. Tous droits réservés.
          </div>
          <div class="flex space-x-6 text-sm">
            <NuxtLink to="/privacy-policy" class="text-gray-400 hover:text-white">
              Politique de confidentialité
            </NuxtLink>
            <NuxtLink to="/terms-conditions" class="text-gray-400 hover:text-white">
              Conditions d'utilisation
            </NuxtLink>
            <NuxtLink to="/cookies" class="text-gray-400 hover:text-white">
              Cookies
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>