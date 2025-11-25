<template>
  <header class="py-6 px-8 bg-background border-b border-gray-700">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <img src="/images/logo/logo_dark.png" alt="Logo" class="w-12 h-12">
        <NuxtLink to="/" class="text-white hover:opacity-80 transition">
          WORDUS.xyz
        </NuxtLink>
      </h1>

      <nav class="flex items-center gap-6">
        <slot name="actions" />
      </nav>
    </div>
  </header>
</template>
