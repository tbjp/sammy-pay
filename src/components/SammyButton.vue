<script setup>
const props = defineProps({
  img: String,
});
</script>

<template>
  <div class="hover:scale-105 active:scale-95 transition-all cursor-pointer">
    <slot></slot>
  </div>
</template>
