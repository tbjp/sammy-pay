<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/store";
import Exit from "../assets/images/icons/exit.png";
import PixelButton from "./PixelButton.vue";
import Calendar from "../assets/images/icons/calendar.png";
import Delete from "../assets/images/icons/delete.png";
import Homeless from "../assets/images/cats/homeless cat.jpg";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  currentPayPeriod: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits([
  "closeModal",
  "onPayPeriodDeleted",
  "onPayPeriodEdited",
  "onPayPeriodAdded",
]);

const appStore = useAppStore();

const handleSubmit = () => {
  console.log(newPayPeriod.value);
  // Add validation here if needed
  if (!newPayPeriod.value.start_date || !newPayPeriod.value.end_date) {
    alert("Please select a start and end date");
    return;
  }
  const validationRules = [
    {
      field: "start_date",
      min: "0001-01-01",
      message: "Start date must be at least 0001-01-01",
    },
    {
      field: "end_date",
      min: newPayPeriod.value.start_date,
      message: "End date must be after start date",
    },
  ];

  for (const rule of validationRules) {
    if (newPayPeriod.value[rule.field] < rule.min) {
      alert(rule.message);
      return;
    }
  }
  if (props.currentPayPeriod) {
    appStore.editPayPeriod(newPayPeriod.value);
    emit("onPayPeriodEdited");
  } else {
    appStore.addPayPeriod(newPayPeriod.value);
    emit("onPayPeriodAdded");
  }

  // Reset form after successful submission
  newPayPeriod.value = {
    start_date: "",
    end_date: "",
  };

  toggleModal();
};

function toggleModal() {
  emit("closeModal");
}

function calculatePayPeriodDays() {
  const startDate = new Date(newPayPeriod.value.start_date);
  const endDate = new Date(newPayPeriod.value.end_date);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return dayDiff + 1;
}

function deletePayPeriod() {
  appStore.deletePayPeriod(props.currentPayPeriod.id);
  emit("onPayPeriodDeleted");
}

const newPayPeriod = ref({
  start_date: "",
  end_date: "",
});

watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      if (props.currentPayPeriod) {
        newPayPeriod.value = { ...props.currentPayPeriod };
        newPayPeriod.value.start_date = new Date(
          props.currentPayPeriod.start_date,
        )
          .toISOString()
          .split("T")[0];
        newPayPeriod.value.end_date = new Date(props.currentPayPeriod.end_date)
          .toISOString()
          .split("T")[0];
      }
    }
  },
);

const confirmationDialog = ref(false);

function toggleConfirmationDialog() {
  confirmationDialog.value = !confirmationDialog.value;
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': showModal }">
    <div class="modal-box flex justify-center bg-transparent shadow-none">
      <div class="bg-bg-pink min-h-24 border border-accent-navy rounded w-80">
        <div
          class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px] flex items-center justify-end pe-2"
        >
          <div class="w-4 h-4 cursor-pointer" @click="toggleModal()">
            <img :src="Exit" alt="Close" class="w-full h-full" />
          </div>
        </div>
        <div class="p-4 relative">
          <h3 class="text-lg font-display-pixel my-4">
            {{ currentPayPeriod ? "Edit Pay Period" : "Add Pay Period" }}
          </h3>
          <form
            class="flex flex-col gap-4 text-xs text-left wrap-normal px-4"
            @submit.prevent="handleSubmit"
          >
            <div class="flex">
              <span class="w-10 h-6">
                <img :src="Calendar" alt="Calendar" class="w-6 h-6" />
              </span>
              <!-- yyyy-MM-ddThh:mm -->
              <input
                type="date"
                class="sammy-input"
                v-model="newPayPeriod.start_date"
              />
            </div>
            <div class="flex justify-center text-lg">to</div>
            <div class="flex">
              <span class="w-10 h-6"> </span>
              <input
                type="date"
                class="sammy-input"
                v-model="newPayPeriod.end_date"
              />
            </div>
            <p
              class="font-display-pixel text-base text-center"
              v-if="newPayPeriod.start_date && newPayPeriod.end_date"
            >
              This pay period has
              {{ calculatePayPeriodDays() }} days.
            </p>
            <div class="flex justify-center gap-10">
              <PixelButton>{{ currentPayPeriod ? "EDIT" : "ADD" }}</PixelButton>
              <div @click="toggleConfirmationDialog()" v-if="currentPayPeriod">
                <img :src="Delete" alt="Delete" class="w-8 h-8" />
              </div>
            </div>
          </form>
          <div
            class="absolute top-0 left-0 w-full h-full bg-white p-6 rounded flex flex-col justify-around gap-4"
            v-if="confirmationDialog"
          >
            <div class="flex flex-col justify-center items-center max-h-full">
              <h1 class="text-center text-lg font-display-pixel pb-2">
                Are you sure?
              </h1>
              <p class="text-center text-sm overflow-auto text-truncate">
                Just look at him, confused, clutching his last paycheck in the
                rain. Take responsibility. He believed in you.
              </p>
              <img :src="Homeless" alt="Homeless cat" class="w-24 h-24" />
              <div class="flex justify-center">
                <PixelButton @click="deletePayPeriod()">DELETE</PixelButton>
                <span class="flex-1 max-w-[2em] min-w-2"></span>
                <PixelButton @click="toggleConfirmationDialog()"
                  >CANCEL</PixelButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
