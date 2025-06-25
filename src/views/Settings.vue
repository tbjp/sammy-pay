<!-- TODO: Delete database option with online -->

<script setup>
import { useAppStore } from "../stores/store";
import SammyButton from "../components/SammyButton.vue";
import PixelButton from "../components/PixelButton.vue";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Star from "../assets/images/star.webp";
import { useRouter } from "vue-router";
import exportCSV from "../utilities/export";

const appStore = useAppStore();
const router = useRouter();

function doStuff() {
  appStore.seedData();
  router.push("/");
}

function logOut() {
  appStore.logout();
  router.push("/login");
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <img :src="Star" alt="Star" class="w-32 min-h-28" />
    <h2 class="font-display-pixel text-sm text-left w-full">Settings</h2>
    <p>Settings content coming soon...</p>
    Click on the tiny pink button to create some sample data or OBLITERATE IT!
    💣💥 Yes, this will destroy all your data. You have been warned.
    <SammyButton class="w-5 h-5">
      <img
        :src="ChevronRight"
        alt="Add"
        class="w-full h-full"
        @click="doStuff()"
      />
    </SammyButton>

    <h3 class="font-display-pixel text-sm text-left w-full">Export classes</h3>
    <PixelButton @click="exportCSV('classes')">Export</PixelButton>
    <h3 class="font-display-pixel text-sm text-left w-full">
      Export pay periods
    </h3>
    <PixelButton @click="exportCSV('payPeriods')">Export</PixelButton>

    <PixelButton v-if="appStore.user" @click="logOut()">Log out</PixelButton>
    <PixelButton v-else @click="router.push('/login')">Log in</PixelButton>
  </div>
</template>

<style scoped></style>
