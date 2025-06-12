<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/store";

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
    <h2 class="font-display-pixel text-xl">Pay Period Details</h2>
    <div class="flex flex-col gap-2">
      <p>Pay period content for ID: {{ payPeriodId }}</p>
    </div>
  </div>
</template>
