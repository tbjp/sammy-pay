<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/store";
import { ref } from "vue";
import SammyButton from "../components/SammyButton.vue";
import ChevronLeft from "../assets/images/icons/chevron/left.png";
import Edit from "../assets/images/icons/edit.png";
import Exit from "../assets/images/icons/exit.png";

const showModal = ref(false);
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const classId = computed(() => route.params.id);
const classData = computed(() =>
  appStore.classes.find((cls) => cls.id.toString() === classId.value),
);

const editedClass = ref({});

// If class not found, redirect to classes list
if (!classData.value) {
  router.push("/");
}

function toggleModal() {
  editedClass.value = {
    id: classData.value.id,
    class_date: classData.value.class_date,
    num_students: classData.value.num_students,
    num_bonus_students: classData.value.num_bonus_students,
    base_pay_per_class: classData.value.base_pay_per_class,
    bonus_pay_per_student: classData.value.bonus_pay_per_student,
  };
  console.log("toggleModal");
  console.log(showModal.value);
  showModal.value = !showModal.value;
}

const editClass = () => {
  // Add validation here if needed
  if (!editedClass.value.class_date) {
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
    if (editedClass.value[rule.field] < rule.min) {
      alert(rule.message);
      return;
    }
  }

  appStore.editClass(editedClass.value);

  toggleModal();
};
</script>

<template>
  <div v-if="classData" class="flex flex-col gap-4 w-full">
    <!-- Div with a button on the left side and button on the right side -->
    <div class="flex justify-between w-full">
      <SammyButton class="w-8 h-8" @click="router.back()">
        <img :src="ChevronLeft" alt="Back" class="w-full h-full" />
      </SammyButton>
      <SammyButton class="w-8 h-8" @click="toggleModal()">
        <!-- maintain aspect ratio of img -->
        <img :src="Edit" alt="Edit" class="w-full object-contain h-full" />
      </SammyButton>
    </div>
    <div class="flex flex-col gap-8 text-left mt-4">
      <h3 class="font-display-pixel text-lg">
        {{ appStore.getFormattedDateNoDay(classData.class_date) }}
      </h3>
      <p>{{ appStore.getDayOfWeek(classData.class_date) }}</p>
      <!-- Start time and end time -->
      <p>
        {{ appStore.getStartTime(classData.class_date) }} -
        {{ appStore.getEndTime(classData.class_date) }}
      </p>
      <p>{{ classData.num_students }} total students</p>
      <p>{{ classData.num_bonus_students }} pre bonus students</p>
      <!-- Pay per student -->
      <p>${{ classData.base_pay_per_class }} per class</p>
      <!-- Pay per bonus student -->
      <p>${{ classData.bonus_pay_per_student }} per bonus student</p>
      <p class="font-display-pixel text-lg text-center">
        ${{ appStore.calculatePay(classData) }} earned!
      </p>
      <div class="text-center mb-4">
        <div>/)____/)</div>
        <div>( ◠ ◡ ◠)</div>
        <div>| >💵< |</div>
        <div>-0---0-</div>
      </div>
    </div>
    <dialog class="modal" :class="{ 'modal-open': showModal }">
      <div class="modal-box bg-transparent">
        <div
          class="bg-bg-pink min-h-24 border border-accent-navy rounded w-full"
        >
          <div
            class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px] flex items-center justify-end pe-2"
          >
            <div class="w-4 h-4 cursor-pointer" @click="toggleModal()">
              <img :src="Exit" alt="Close" class="w-full h-full" />
            </div>
          </div>
          <div class="p-3">
            <h3 class="text-lg font-bold mb-2">Edit Class</h3>
            <form
              class="flex flex-col gap-4 text-xs text-left wrap-normal"
              @submit.prevent="editClass"
            >
              <input
                type="datetime-local"
                class="sammy-input"
                v-model="editedClass.class_date"
              />
              <div class="flex gap-2">
                <input
                  type="number"
                  class="sammy-input"
                  v-model="editedClass.num_students"
                  min="1"
                  step="1"
                />
                <div class="flex-1/3">total students</div>
              </div>
              <div class="flex gap-2">
                <input
                  type="number"
                  class="sammy-input"
                  v-model="editedClass.num_bonus_students"
                  min="0"
                  step="1"
                />
                <div class="flex-1/3">pre bonus students</div>
              </div>
              <div class="flex gap-2">
                <input
                  type="number"
                  class="sammy-input"
                  v-model="editedClass.base_pay_per_class"
                  min="0"
                  step="0.01"
                />
                <div class="flex-1/3">base pay per class</div>
              </div>
              <div class="flex gap-2">
                <input
                  type="number"
                  class="sammy-input"
                  v-model="editedClass.bonus_pay_per_student"
                  min="0"
                  step="0.01"
                />
                <div class="flex-1/3">bonus pay per student</div>
              </div>
              <button type="submit" class="btn">Edit Class</button>
            </form>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="toggleModal()">close</button>
      </form>
    </dialog>
  </div>
</template>
