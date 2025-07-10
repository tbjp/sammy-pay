<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/store";
import Exit from "../assets/images/icons/exit.png";
import Delete from "../assets/images/icons/delete.png";
import Happy from "../assets/images/icons/happy.png";
import Calendar from "../assets/images/icons/calendar.png";
import Money from "../assets/images/icons/money.png";
import PixelButton from "./PixelButton.vue";
import Oops from "../assets/images/cats/oops cat.jpg";
import Add from "../assets/images/icons/add.png";
import { computed } from "vue";

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

const emit = defineEmits([
  "closeModal",
  "onClassDeleted",
  "onClassEdited",
  "onClassAdded",
]);

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
      field: "num_bonus_students",
      max: newClass.value.num_students,
      message:
        "Number of bonus students must be less than or equal to total students",
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
    if (
      newClass.value[rule.field] < rule.min ||
      newClass.value[rule.field] > rule.max
    ) {
      alert(rule.message);
      return;
    }
  }

  if (props.currentClass) {
    console.log("Editing class start time: " + newClass.value.start_time);
    console.log("Editing class end time: " + newClass.value.end_time);
    appStore.editClass(newClass.value);
    emit("onClassEdited");
  } else {
    appStore.addClass(newClass.value);
    emit("onClassAdded");
  }

  // Reset form after successful submission
  // newClass.value = {
  //   class_date: "",
  //   num_students: 1,
  //   num_bonus_students: 0,
  //   base_pay_per_class: 0,
  //   bonus_pay_per_student: 0,
  //   hours: null,
  //   minutes: null,
  // };

  toggleModal();
};

function toggleModal() {
  emit("closeModal");
}

function deleteClass() {
  appStore.deleteClass(props.currentClass.id);
  emit("onClassDeleted");
}

const mostRecentClass = ref(appStore.mostRecentClass);

watch(
  () => appStore.classes,
  () => {
    console.log("Most recent class updated");
    mostRecentClass.value = appStore.mostRecentClass;
  },
  { deep: true },
);

const newClass = ref({
  class_date:
    mostRecentClass.value?.class_date ??
    new Date().toISOString().split("Z")[0].slice(0, -7),
  num_students: mostRecentClass.value?.num_students ?? 1,
  num_bonus_students: mostRecentClass.value?.num_bonus_students ?? 0,
  base_pay_per_class: mostRecentClass.value?.base_pay_per_class ?? 0,
  bonus_pay_per_student: mostRecentClass.value?.bonus_pay_per_student ?? 0,
  hours: 1,
  minutes: 0,
});

const confirmationDialog = ref(false);

function toggleConfirmationDialog() {
  confirmationDialog.value = !confirmationDialog.value;
}

const showExtraOptions = ref(false);

function toggleExtraOptions() {
  showExtraOptions.value = !showExtraOptions.value;
}

watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      if (props.currentClass) {
        console.log("Start time = " + props.currentClass.class_date);
        console.log("End time = " + props.currentClass.end_time);
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
            class="flex flex-col gap-4 text-xs text-left wrap-normal px-3"
            @submit.prevent="handleSubmit"
          >
            <div class="flex items-center gap-2">
              <span class="w-10 max-w-8 min-w-6 h-6">
                <img :src="Calendar" alt="Calendar" class="w-6 h-6 min-w-6" />
              </span>
              <input
                type="datetime-local"
                class="sammy-input"
                v-model="newClass.class_date"
              />
            </div>
            <div class="items-center gap-2 hidden">
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
              <span class="w-10 max-w-8 min-w-6 h-6">
                <img :src="Happy" alt="Happy" class="w-6 h-6 min-w-6" />
              </span>
              <select v-model="newClass.num_students" class="sammy-input">
                <option v-for="n in 100" :key="n" :value="n">{{ n }}</option>
              </select>
              <!-- <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_students"
                min="1"
                step="1"
              /> -->
              <div class="flex-1/3">total</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 max-w-8 min-w-6 h-6"></span>
              <select v-model="newClass.num_bonus_students" class="sammy-input">
                <option
                  v-for="n in Array.from({ length: 101 }, (_, i) => i)"
                  :key="n"
                  :value="n"
                >
                  {{ n }}
                </option>
              </select>
              <!-- <input
                type="number"
                class="sammy-input"
                v-model="newClass.num_bonus_students"
                min="0"
                step="1"
              /> -->
              <div class="flex-1/3">pre bonus</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-10 max-w-8 min-w-6 h-6"></span>
              <div
                @click="toggleExtraOptions"
                class="flex items-center gap-2 cursor-pointer"
              >
                <span>Extra options</span>
                <img
                  :src="Add"
                  alt="Open extra options"
                  :class="{ hidden: showExtraOptions }"
                  class="w-4 h-4 min-w-4"
                /><img
                  :src="Exit"
                  alt="Close extra options"
                  :class="{ hidden: !showExtraOptions }"
                  class="w-4 h-4 min-w-4"
                />
              </div>
            </div>
            <div
              :class="{ hidden: !showExtraOptions }"
              class="flex flex-col gap-4"
            >
              <div class="flex items-center gap-2">
                <span class="w-10 max-w-8 min-w-6 h-6">
                  <img :src="Money" alt="Money" class="h-5 min-w-5" />
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
                <span class="w-10 max-w-8 min-w-6 h-6"></span>
                <input
                  type="number"
                  class="sammy-input"
                  v-model="newClass.bonus_pay_per_student"
                  min="0"
                  step="0.01"
                />
                <div class="flex-1/3">bonus pay per student</div>
              </div>
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
            <p class="font-display-pixel text-lg text-center">
              ${{ appStore.calculatePay(newClass) }} earned!
            </p>
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
                This class will be wiped from existence, banished from reality
                as we know it, and you’ll never get to see it’s lovely little
                face, its charming details, or its delightful pay rate ever
                again. Poof. Gone. Forever. No goodbyes. No second chances. Just
                an empty void where a beautiful class once lived. It’ll haunt
                your memories, or maybe not. Either way, press delete with
                caution.
              </p>
              <img :src="Oops" alt="Oops" class="w-24 h-24" />
              <div class="flex justify-center">
                <PixelButton @click="deleteClass()">DELETE</PixelButton>
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
