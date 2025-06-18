<script setup>
import { useAppStore } from "../stores/store";
import { useRouter } from "vue-router";
import { ref } from "vue";
import Card from "../components/Card.vue";
import SammyButton from "../components/SammyButton.vue";
import PayPeriodModal from "../components/AddEditPayPeriod.vue";
import Add from "../assets/images/icons/add.png";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Heart from "../assets/images/heart.webp";
import PixelButton from "../components/PixelButton.vue";

const appStore = useAppStore();
const router = useRouter();

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

const listLength = ref(20);
function loadMore() {
  listLength.value += 20;
  if (listLength.value > appStore.sortedPayPeriods.length) {
    listLength.value = appStore.sortedPayPeriods.length;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full pb-4 items-center">
    <img :src="Heart" alt="Star" class="w-32 min-h-28" />
    <div class="flex justify-between w-full">
      <h2 class="font-display-pixel text-sm text-left">Pay Periods</h2>
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
      <Card
        v-for="pp in appStore.sortedPayPeriods.slice(0, listLength)"
        :key="pp.id"
        :hearts="true"
      >
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
      <div
        v-if="appStore.sortedPayPeriods.length > listLength"
        @scroll="loadMore()"
      >
        <PixelButton @click="loadMore()">MORE!</PixelButton>
      </div>
    </ul>
    <PayPeriodModal :showModal="showModal" @closeModal="toggleModal()" />
  </div>
</template>
