<script setup>
import Nav from "./components/Nav.vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import ConfirmationModal from "./components/ConfirmationModal.vue";
import { useAppStore } from "./stores/store";
import { onetimeSync } from "./utilities/syncLoop";

const appStore = useAppStore();

const router = useRouter();
const route = useRoute();

const showConfirmationModal = ref(false);
const confirmationMessage = ref("");

watch(
  () => route.query.modal,
  (value) => {
    if (value) {
      confirmationMessage.value = value;
      showConfirmationModal.value = true;
    }
  },
);

// TODO: Subscribe to changes in classes or pay periods from pinia
// This isnt really working properly
appStore.$subscribe((mutation, state) => {
  console.log("Mutation: ", mutation);
  console.log("State: ", state);
  if (
    mutation.type === "update" &&
    (mutation.payload.path.includes("payPeriods") ||
      mutation.payload.path.includes("classes"))
  ) {
    appStore.needsSync = true;
    console.log("NEEDS SYNC: " + appStore.needsSync);
  }
});

function toggleConfirmationModal() {
  showConfirmationModal.value = !showConfirmationModal.value;
  router.replace({ query: { modal: null } });
}
</script>

<template>
  <div class="flex flex-col h-dvh max-w-[480px] w-lvw overflow-hidden relative">
    <div v-if="appStore.user">Hello {{ appStore.user.email }}</div>
    <button @click="onetimeSync(appStore)">Sync</button>
    <div
      class="flex-1 flex flex-col gap-4 items-center overflow-y-auto px-8 hide-scrollbar"
    >
      <h1 class="font-display-pixel text-2xl pt-8">Sammy Pay</h1>
      <router-view />
    </div>
    <Nav />
  </div>
  <ConfirmationModal
    v-if="showConfirmationModal"
    :showConfirmationModal="showConfirmationModal"
    :confirmationMessage="confirmationMessage"
    @closeConfirmationModal="toggleConfirmationModal"
  />
</template>

<style scoped></style>
