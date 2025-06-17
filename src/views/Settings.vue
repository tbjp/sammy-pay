<script setup>
import { useAppStore } from "../stores/store";
import SammyButton from "../components/SammyButton.vue";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Star from "../assets/images/star.webp";
import { useRouter } from "vue-router";

const appStore = useAppStore();
const router = useRouter();

function doStuff() {
  appStore.seedData();
  router.push("/");
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <img :src="Star" alt="Star" class="w-32 min-h-28" />
    <h2 class="font-display-pixel text-sm text-left w-full">Settings</h2>
    <p>Settings content coming soon...</p>
    Click here to create some sample data or OBLITERATE IT! 💣💥 Yes, this will
    destroy all your data. You have been warned.
    <SammyButton class="w-5 h-5">
      <img
        :src="ChevronRight"
        alt="Add"
        class="w-full h-full"
        @click="doStuff()"
      />
    </SammyButton>
  </div>
</template>

<style scoped></style>
