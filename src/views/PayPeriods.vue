<script setup>
import { useAppStore } from "../stores/store";
import { useRouter } from "vue-router";
import { ref, nextTick } from "vue";
import Card from "../components/Card.vue";
import SammyButton from "../components/SammyButton.vue";
import PayPeriodModal from "../components/AddEditPayPeriod.vue";
import Add from "../assets/images/icons/add.png";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Heart from "../assets/images/heart.webp";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const router = useRouter();

const showModal = ref(false);

const payPeriodData = storeToRefs(appStore.payPeriods);
console.log("StoreToRefs: " + payPeriodData.value);

function toggleModal() {
  console.log("Toggling modal");
  showModal.value = !showModal.value;
}

function seedData() {
  appStore.seedData();
}
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
          @click="seedData()"
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
    <PayPeriodModal :showModal="showModal" @closeModal="toggleModal()" />
  </div>
</template>
