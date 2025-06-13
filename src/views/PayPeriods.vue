<script setup>
import { useAppStore } from "../stores/store";
import Card from "../components/Card.vue";
import SammyButton from "../components/SammyButton.vue";
import Add from "../assets/images/icons/add.png";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Heart from "../assets/images/heart.webp";
import Exit from "../assets/images/icons/exit.png";
import { useRouter } from "vue-router";
import { ref } from "vue";

const appStore = useAppStore();
const router = useRouter();

const showModal = ref(false);

const addPayPeriod = () => {
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
  showModal.value = !showModal.value;
}

const newPayPeriod = ref({
  start_date: "",
  end_date: "",
});
</script>

<template>
  <div class="flex flex-col gap-4 w-full pb-4 items-center">
    <img :src="Heart" alt="Star" class="w-32 min-h-28" />
    <div class="flex justify-between w-full">
      <h2 class="font-display-pixel text-sm text-left">Pay Periods</h2>
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
      <Card v-for="pp in appStore.payPeriods" :key="pp.id" :hearts="true">
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-1 text-left">
            <h3 class="font-display-pixel text-sm">
              {{ appStore.getFormattedDateNoDay(pp.start_date) }} -
              {{ appStore.getFormattedDateNoDay(pp.end_date) }}
            </h3>
            <div class="h-[1em]"></div>
            <p>${{ appStore.calculatePayPeriod(pp) }} earned</p>
          </div>
          <div class="flex items-end">
            <SammyButton
              class="w-5 h-5"
              @click="router.push(`/pay-period/${pp.id}`)"
            >
              <img
                :src="ChevronRight"
                alt="Pay Period Details"
                class="w-full h-full"
              />
            </SammyButton>
          </div>
        </div>
      </Card>
    </ul>
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
            <h3 class="text-lg font-bold mb-2">Add Pay Period</h3>
            <form
              class="flex flex-col gap-4 text-xs text-left wrap-normal"
              @submit.prevent="addPayPeriod"
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
              <button type="submit" class="btn">Add Pay Period</button>
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
