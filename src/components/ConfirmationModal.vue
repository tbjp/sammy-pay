<script setup>
import Exit from "../assets/images/icons/exit.png";

const props = defineProps({
  showConfirmationModal: {
    type: Boolean,
    required: true,
  },
  confirmationMessage: {
    type: String,
    required: false,
    default: "Are you sure?",
  },
});

const emit = defineEmits(["closeConfirmationModal"]);

const messages = {
  classAdded: "Class added",
  classDeleted: "Class deleted",
  classEdited: "Class edited",
  payPeriodAdded: "Pay period added",
  payPeriodDeleted: "Pay period deleted",
  payPeriodEdited: "Pay period edited",
};

function toggleModal() {
  emit("closeConfirmationModal");
}

console.log(props.confirmationMessage);
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': showConfirmationModal }">
    <div class="modal-box bg-transparent shadow-none">
      <div class="bg-bg-pink min-h-24 border border-accent-navy rounded w-full">
        <div
          class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px] flex items-center justify-end pe-2"
        >
          <div class="w-4 h-4 cursor-pointer" @click="toggleModal()">
            <img :src="Exit" alt="Close" class="w-full h-full" />
          </div>
        </div>
        <p class="text-center font-display-pixel text-sm">
          {{ messages[confirmationMessage] }}
        </p>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
