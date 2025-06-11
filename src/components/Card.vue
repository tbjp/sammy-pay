<script setup>
import Heart from "../assets/images/icons/heart.png";
defineProps({
  hearts: Boolean,
});
</script>

<template>
  <div class="bg-bg-pink min-h-24 border border-accent-navy rounded w-full">
    <div
      class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px]"
    >
      <div v-if="hearts" class="flex gap-1 ps-2 pt-1.5">
        <!-- Display img 3 times -->
        <img :src="Heart" alt="Heart" class="w-2.5" />
        <img :src="Heart" alt="Heart" class="w-2.5" />
        <img :src="Heart" alt="Heart" class="w-2.5" />
      </div>
    </div>
    <div class="p-3"><slot></slot></div>
  </div>
</template>
