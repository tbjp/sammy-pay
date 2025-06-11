// Component that shows a list of classes
<script setup>
import { useAppStore } from "../stores/store";
import Card from "./Card.vue";
import SammyButton from "./SammyButton.vue";
import Add from "../assets/images/icons/add.png";
const appStore = useAppStore();
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex justify-between w-full">
      <h2 class="font-display-pixel text-sm text-left">Classes</h2>
      <SammyButton class="w-5 h-5">
        <img :src="Add" alt="Add" class="w-full h-full" />
      </SammyButton>
    </div>
    <ul class="flex flex-col gap-4 w-full">
      <Card v-for="cls in appStore.classes" :key="cls.id" :hearts="true">
        <div class="flex flex-col gap-1 text-left">
          <h3 class="font-display-pixel text-sm">{{ cls.class_date }}</h3>
          <p>{{ cls.num_students }} students</p>
          <p>${{ cls.base_pay_per_class }}</p>
        </div>
      </Card>
    </ul>
  </div>
</template>
