<script setup>
const props = defineProps({
  img: String,
});
</script>

<template>
  <div class="hover:scale-105 active:scale-95 transition-all cursor-pointer">
    <!-- <img v-if="props.img === 'PayPeriodActive'" :src="PayPeriodActive" alt="" />
    <img
      v-if="props.img === 'PayPeriodInactive'"
      :src="PayPeriodInactive"
      alt=""
    />
    <img v-if="props.img === 'Add'" :src="Add" alt="" />
    <img v-if="props.img === 'Alert'" :src="Alert" alt="" />
    <img v-if="props.img === 'Calendar'" :src="Calendar" alt="" />
    <img v-if="props.img === 'Delete'" :src="Delete" alt="" />
    <img v-if="props.img === 'Edit'" :src="Edit" alt="" />
    <img v-if="props.img === 'Exit'" :src="Exit" alt="" /> -->
    <slot></slot>
  </div>
</template>
