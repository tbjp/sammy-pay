<script setup>
import Nav from "./components/Nav.vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import ConfirmationModal from "./components/ConfirmationModal.vue";

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

function toggleConfirmationModal() {
  showConfirmationModal.value = !showConfirmationModal.value;
  router.replace({ query: { modal: null } });
}
</script>

<template>
  <div class="flex flex-col h-dvh max-w-[480px] w-lvw overflow-hidden relative">
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
