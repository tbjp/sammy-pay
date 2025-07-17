<script setup>
import Exit from "../assets/images/icons/exit.png";
import Delete from "../assets/images/icons/delete.png";
import PixelButton from "./PixelButton.vue";
import { useAppStore } from "../stores/store";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal"]);

const appStore = useAppStore();

function wipeData() {
  appStore.wipeData();
  emit("closeModal");
}

function toggleModal() {
  emit("closeModal");
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': showModal }">
    <div class="modal-box bg-transparent shadow-none">
      <div class="bg-bg-pink min-h-24 border border-accent-navy rounded w-full">
        <div
          class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px] flex items-center justify-end pe-2"
        >
          <div class="w-4 h-4 cursor-pointer" @click="toggleModal()">
            <img :src="Exit" alt="Close" class="w-full h-full" />
          </div>
        </div>
        <div class="p-3">
          <p>Are you sure you want to wipe all data?</p>
          <p>This action cannot be undone.</p>

          <div class="flex justify-around pt-4 pb-2">
            <PixelButton @click="wipeData()">WIPE</PixelButton>
            <PixelButton @click="toggleModal()">CANCEL</PixelButton>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
