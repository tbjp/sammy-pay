<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/store";
import SammyButton from "../components/SammyButton.vue";
import ChevronLeft from "../assets/images/icons/chevron/left.png";
import Edit from "../assets/images/icons/edit.png";
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const classId = computed(() => route.params.id);
const classData = computed(() =>
  appStore.classes.find((cls) => cls.id.toString() === classId.value),
);

// If class not found, redirect to classes list
if (!classData.value) {
  router.push("/");
}
</script>

<template>
  <div v-if="classData" class="flex flex-col gap-4 w-full">
    <!-- Div with a button on the left side and button on the right side -->
    <div class="flex justify-between w-full">
      <SammyButton class="w-8 h-8" @click="router.push('/')">
        <img :src="ChevronLeft" alt="Back" class="w-full h-full" />
      </SammyButton>
      <SammyButton class="w-8 h-8">
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
      <p>{{ classData.num_bonus_students }} bonus students</p>
      <!-- Pay per student -->
      <p>${{ classData.base_pay_per_class }} per student</p>
      <!-- Pay per bonus student -->
      <p>${{ classData.bonus_pay_per_student }} per bonus student</p>
      <p>${{ appStore.calculatePay(classData) }} earned</p>
    </div>
  </div>
</template>
