<script setup>
import Nav from "./components/Nav.vue";
import Classes from "./views/Classes.vue";
</script>

<template>
  <div class="flex flex-col h-dvh max-w-[480px] w-dvw overflow-hidden relative">
    <div
      class="flex-1 flex flex-col gap-4 items-center overflow-y-auto px-8 hide-scrollbar"
    >
      <h1 class="font-display-pixel text-2xl pt-8">Sammy Pay</h1>
      <router-view />
    </div>
    <Nav />
  </div>
</template>

<style scoped></style>
