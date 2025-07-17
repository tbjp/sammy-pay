<!-- TODO: Handle OTP error -->
<!-- TODO: Fix logging out not wiping store (sometimes works) -->

<script setup>
import { useAppStore } from "../stores/store";
import PixelButton from "../components/PixelButton.vue";
import Star from "../assets/images/star.webp";
import { useRouter } from "vue-router";
import exportCSV from "../utilities/export";
import WipeDataConfirmation from "../components/WipeDataConfirmation.vue";
import { ref } from "vue";

const appStore = useAppStore();
const router = useRouter();
const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

function logOut() {
  appStore.logout();
  router.push("/login");
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full">
    <img :src="Star" alt="Star" class="w-32 min-h-28" />
    <h2 class="font-display-pixel text-sm text-left w-full">Settings</h2>
    <div v-if="appStore.user !== 'none'">
      <p>You are logged in! Here is your email:</p>
      {{ appStore.user.email }}
    </div>
    <div v-else>
      <p>You are not logged in.</p>
    </div>
    <PixelButton v-if="appStore.user !== 'none'" @click="logOut()"
      >Log out</PixelButton
    >
    <PixelButton v-else @click="router.push('/login')">Login</PixelButton>

    <h3 class="font-display-pixel text-sm text-left w-full">Export classes</h3>
    <PixelButton @click="exportCSV('classes')">Export</PixelButton>
    <h3 class="font-display-pixel text-sm text-left w-full">
      Export pay periods
    </h3>
    <PixelButton @click="exportCSV('payPeriods')">Export</PixelButton>
    <h3 class="font-display-pixel text-sm text-left w-full">Wipe data</h3>
    <PixelButton @click="toggleModal()">Wipe data</PixelButton>
    <!-- Show div if URL includes localhost -->
    <!-- <div v-if="window.location.hostname === 'localhost'">
      <PixelButton @click="sync()">Sync</PixelButton>
      <h3 class="font-display-pixel text-sm text-left w-full">Seed data</h3>
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
    </div> -->
  </div>
  <WipeDataConfirmation :showModal="showModal" @closeModal="toggleModal()" />
</template>

<style scoped></style>
