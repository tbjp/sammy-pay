<script setup>
import Nav from "./components/Nav.vue";
import Classes from "./components/Classes.vue";
import Star from "./assets/images/star.png";
</script>

<template>
  <div class="flex flex-col h-dvh max-w-[480px] w-dvw overflow-hidden relative">
    <div
      class="flex-1 flex flex-col gap-4 items-center overflow-y-auto hide-scrollbar"
    >
      <h1 class="font-display-pixel text-2xl pt-8">Sammy Pay</h1>
      <img :src="Star" alt="Star" class="w-32" />
      <Classes />
    </div>
    <Nav />
  </div>
</template>

<style scoped></style>
