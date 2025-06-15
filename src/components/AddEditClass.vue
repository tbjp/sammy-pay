<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/store";
import Exit from "../assets/images/icons/exit.png";
import Delete from "../assets/images/icons/delete.png";
import Happy from "../assets/images/icons/happy.png";
import Calendar from "../assets/images/icons/calendar.png";
import Money from "../assets/images/icons/money.png";
import PixelButton from "./PixelButton.vue";

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

const emit = defineEmits(["closeModal", "onClassDeleted"]);

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
    hours: null,
    minutes: null,
  };

  toggleModal();
};

function toggleModal() {
  emit("closeModal");
}

function deleteClass() {
  appStore.deleteClass(props.currentClass.id);
  emit("onClassDeleted");
}

const newClass = ref({
  class_date: "",
  num_students: 1,
  num_bonus_students: 0,
  base_pay_per_class: 0,
  bonus_pay_per_student: 0,
  hours: null,
  minutes: null,
});

const confirmationDialog = ref(false);

function toggleConfirmationDialog() {
  confirmationDialog.value = !confirmationDialog.value;
}

watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      if (props.currentClass) {
        newClass.value = { ...props.currentClass };
        const diff =
          Date.parse(props.currentClass.end_time) -
          Date.parse(props.currentClass.class_date);
        newClass.value.hours = Math.floor(diff / (1000 * 60 * 60));
        newClass.value.minutes = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60),
        );
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
        <div class="p-3 relative">
          <h3 class="text-lg font-bold mb-2">
            {{ currentClass ? "Edit Class" : "Add Class" }}
          </h3>
          <form
            class="flex flex-col gap-4 text-xs text-left wrap-normal px-6"
            @submit.prevent="handleSubmit"
          >
            <div class="flex items-center gap-2">
              <span class="w-10 h-6">
                <img :src="Calendar" alt="Calendar" class="w-6 h-6" />
              </span>
              <input
                type="datetime-local"
                class="sammy-input"
                v-model="newClass.class_date"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 h-6"> </span>
              <input
                type="number"
                class="sammy-input w-[6em] unflex"
                v-model="newClass.hours"
                min="1"
                max="99"
                step="1"
                placeholder="hh"
              />
              <div class="">:</div>
              <input
                type="number"
                class="sammy-input w-[6em] unflex"
                v-model="newClass.minutes"
                min="0"
                max="59"
                step="1"
                placeholder="mm"
              />
              <div class="flex-1/3">class length</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 h-6">
                <img :src="Happy" alt="Happy" class="w-6 h-6" />
              </span>
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_students"
                min="1"
                step="1"
              />
              <div class="flex-1/3">total students</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 h-6"></span>
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_bonus_students"
                min="0"
                step="1"
              />
              <div class="flex-1/3">pre bonus students</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 h-6">
                <img :src="Money" alt="Money" class="h-5" />
              </span>
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.base_pay_per_class"
                min="0"
                step="0.01"
              />
              <div class="flex-1/3">base pay per class</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 h-6"></span>
              <input
                type="number"
                class="sammy-input"
                v-model="newClass.bonus_pay_per_student"
                min="0"
                step="0.01"
              />
              <div class="flex-1/3">bonus pay per student</div>
            </div>
            <div class="flex justify-center gap-10">
              <PixelButton>{{ currentClass ? "EDIT" : "ADD" }}</PixelButton>
              <button
                @click.prevent="toggleConfirmationDialog()"
                v-if="currentClass"
              >
                <img :src="Delete" alt="Delete" class="w-8 h-8" />
              </button>
            </div>
          </form>

          <div
            class="absolute top-0 left-0 w-full h-full bg-bg-pink p-6 rounded flex flex-col justify-around gap-4"
            v-if="confirmationDialog"
          >
            <h1 class="text-center text-2xl font-display-pixel">
              Are you sure?
            </h1>
            <p class="text-center text-sm">
              This class will be wiped from existence, banished from reality as
              we know it, and you’ll never get to see it’s lovely little face,
              its charming details, or its delightful pay rate ever again. Poof.
              Gone. Forever. No goodbyes. No second chances. Just an empty void
              where a beautiful class once lived. It’ll haunt your memories, or
              maybe not. Either way, press delete with caution.
            </p>
            <div class="flex justify-center gap-10">
              <PixelButton @click="deleteClass()">DELETE</PixelButton>
              <PixelButton @click="toggleConfirmationDialog()"
                >CANCEL</PixelButton
              >
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
