<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/store";
import Exit from "../assets/images/icons/exit.png";

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

const emit = defineEmits(["closeModal"]);

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
      min: 1,
      message: "Start date must be at least 1",
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

  appStore.addPayPeriod(newPayPeriod.value);

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
      }
    }
  },
);
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
          <h3 class="text-lg font-bold mb-2">Add Pay Period</h3>
          <form
            class="flex flex-col gap-4 text-xs text-left wrap-normal"
            @submit.prevent="handleSubmit"
          >
            <div class="flex gap-2">
              <input
                type="date"
                class="sammy-input"
                v-model="newPayPeriod.start_date"
              />
              <div class="flex-1/3">start date</div>
            </div>
            <div class="flex gap-2">
              <input
                type="date"
                class="sammy-input"
                v-model="newPayPeriod.end_date"
              />
              <div class="flex-1/3">end date</div>
            </div>
            <button type="submit" class="btn">
              {{ currentPayPeriod ? "Edit Pay Period" : "Add Pay Period" }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
