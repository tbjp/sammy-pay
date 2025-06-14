<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/store";
import Exit from "../assets/images/icons/exit.png";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  currentClass: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["closeModal"]);

const appStore = useAppStore();

const handleSubmit = () => {
  if (!newClass.value.class_date) {
    alert("Please select a class date");
    return;
  }
  const validationRules = [
    {
      field: "num_students",
      min: 1,
      message: "Number of students must be at least 1",
    },
    {
      field: "num_bonus_students",
      min: 0,
      message: "Number of bonus students must be at least 0",
    },
    {
      field: "base_pay_per_class",
      min: 0,
      message: "Base pay per class must be at least 0",
    },
    {
      field: "bonus_pay_per_student",
      min: 0,
      message: "Bonus pay per student must be at least 0",
    },
  ];

  for (const rule of validationRules) {
    if (newClass.value[rule.field] < rule.min) {
      alert(rule.message);
      return;
    }
  }

  if (props.currentClass) {
    appStore.editClass(newClass.value);
  } else {
    appStore.addClass(newClass.value);
  }

  // Reset form after successful submission
  newClass.value = {
    class_date: "",
    num_students: 1,
    num_bonus_students: 0,
    base_pay_per_class: 0,
    bonus_pay_per_student: 0,
  };

  toggleModal();
};

function toggleModal() {
  emit("closeModal");
}

const newClass = ref({
  class_date: "",
  num_students: 1,
  num_bonus_students: 0,
  base_pay_per_class: 0,
  bonus_pay_per_student: 0,
});

watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      if (props.currentClass) {
        newClass.value = { ...props.currentClass };
      }
    }
  },
);
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': showModal }" data-theme="light">
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
          <h3 class="text-lg font-bold mb-2">
            {{ currentClass ? "Edit Class" : "Add Class" }}
          </h3>
          <form
            class="flex flex-col gap-4 text-xs text-left wrap-normal"
            @submit.prevent="handleSubmit"
          >
            <input
              type="datetime-local"
              class="sammy-input"
              v-model="newClass.class_date"
            />
            <div class="flex gap-2">
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_students"
                min="1"
                step="1"
              />
              <div class="flex-1/3">total students</div>
            </div>
            <div class="flex gap-2">
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_bonus_students"
                min="0"
                step="1"
              />
              <div class="flex-1/3">pre bonus students</div>
            </div>
            <div class="flex gap-2">
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.base_pay_per_class"
                min="0"
                step="0.01"
              />
              <div class="flex-1/3">base pay per class</div>
            </div>
            <div class="flex gap-2">
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.bonus_pay_per_student"
                min="0"
                step="0.01"
              />
              <div class="flex-1/3">bonus pay per student</div>
            </div>
            <button type="submit" class="btn">
              {{ currentClass ? "Edit Class" : "Add Class" }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" data-theme="light">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
