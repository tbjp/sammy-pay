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

const payPeriodId = computed(() => route.params.id);
const payPeriodData = computed(() =>
  appStore.payPeriods?.find(
    (period) => period.id.toString() === payPeriodId.value,
  ),
);

// If pay period not found, redirect to pay period list
if (!payPeriodData.value) {
  router.push("/pay-period");
}
</script>

<template>
  <div v-if="payPeriodData" class="flex flex-col gap-4 w-full">
    <!-- Div with a button on the left side and button on the right side -->
    <div class="flex justify-between w-full">
      <SammyButton class="w-8 h-8" @click="router.push('/pay-periods')">
        <img :src="ChevronLeft" alt="Back" class="w-full h-full" />
      </SammyButton>
      <SammyButton class="w-8 h-8">
        <!-- maintain aspect ratio of img -->
        <img :src="Edit" alt="Edit" class="w-full object-contain h-full" />
      </SammyButton>
    </div>
    <div class="flex flex-col gap-8 text-left mt-4">
      <h3 class="font-display-pixel text-lg">
        {{ appStore.getFormattedDateNoDay(payPeriodData.start_date) }}
      </h3>
      <h3 class="font-display-pixel text-lg">to</h3>
      <h3 class="font-display-pixel text-lg">
        {{ appStore.getFormattedDateNoDay(payPeriodData.end_date) }}
      </h3>
      <p># of total classes</p>
    </div>
    <p class="font-display-pixel text-lg text-center">
      ${{ appStore.calculatePay(payPeriodData) }} earned!
    </p>
    <div class="text-center mb-4">
      <div>/)____/)</div>
      <div>( ◠ ◡ ◠)</div>
      <div>| >💵< |</div>
      <div>-0---0-</div>
    </div>
  </div>
</template>
