<script setup>
import { useAppStore } from "../stores/store";
import Card from "../components/Card.vue";
import SammyButton from "../components/SammyButton.vue";
import Add from "../assets/images/icons/add.png";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Star from "../assets/images/star.webp";
import Exit from "../assets/images/icons/exit.png";
import { useRouter } from "vue-router";
import { ref } from "vue";
import classModal from "../components/classModal.vue";

const appStore = useAppStore();
const router = useRouter();

const showModal = ref(false);

const addClass = () => {
  console.log(newClass.value);
  // Add validation here if needed
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

  appStore.addClass(newClass.value);

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
  showModal.value = !showModal.value;
}

const newClass = ref({
  class_date: "",
  num_students: 1,
  num_bonus_students: 0,
  base_pay_per_class: 0,
  bonus_pay_per_student: 0,
});
</script>

<template>
  <div class="flex flex-col gap-4 w-full pb-4 items-center">
    <img :src="Star" alt="Star" class="w-32 min-h-28" />
    <div class="flex justify-between w-full">
      <h2 class="font-display-pixel text-sm text-left">Classes</h2>
      <SammyButton class="w-5 h-5">
        <img
          :src="ChevronRight"
          alt="Add"
          class="w-full h-full"
          @click="appStore.seedData()"
        />
      </SammyButton>
      <SammyButton class="w-5 h-5">
        <img
          :src="Add"
          alt="Add"
          class="w-full h-full"
          @click="toggleModal()"
        />
      </SammyButton>
    </div>
    <ul class="flex flex-col gap-4 w-full">
      <Card v-for="cls in appStore.classes" :key="cls.id" :hearts="true">
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-1 text-left">
            <h3 class="font-display-pixel text-sm">
              {{ appStore.getFormattedDate(cls.class_date) }}
            </h3>
            <p>{{ cls.num_students }} students</p>
            <p>${{ cls.base_pay_per_class }} earned</p>
          </div>
          <div class="flex items-end">
            <SammyButton
              class="w-5 h-5"
              @click="router.push(`/class/${cls.id}`)"
            >
              <img
                :src="ChevronRight"
                alt="Class Details"
                class="w-full h-full"
              />
            </SammyButton>
          </div>
        </div>
      </Card>
    </ul>
    <classModal :showModal="showModal" @closeModal="toggleModal()" />
  </div>
</template>
