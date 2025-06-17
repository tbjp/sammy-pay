<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/store";
import SammyButton from "../components/SammyButton.vue";
import ChevronLeft from "../assets/images/icons/chevron/left.png";
import Edit from "../assets/images/icons/edit.png";
import PayPeriodActive from "../assets/images/icons/payperiod/active.png";
import PayPeriodInactive from "../assets/images/icons/payperiod/inactive.png";
import PayPeriodModal from "../components/AddEditPayPeriod.vue";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const showClasses = ref(false);
const payPeriodId = computed(() => route.params.id);
const payPeriodData = computed(() =>
  appStore.payPeriods?.find(
    (period) => period.id.toString() === payPeriodId.value,
  ),
);

// If pay period not found, redirect to pay period list
if (!payPeriodData.value) {
  router.push("/pay-periods");
}

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

function onPayPeriodDeleted() {
  router.push({ path: "/pay-periods", query: { modal: "payPeriodDeleted" } });
}

function onPayPeriodEdited() {
  router.push({ path: route.path, query: { modal: "payPeriodEdited" } });
}

watch(payPeriodData, () => {
  console.log(payPeriodData.value);
  console.log(appStore.calculatePayPeriod(payPeriodData.value));
});
</script>

<template>
  <div class="w-full h-full">
    <!-- Div to stop vue.js alert about extraneous non-props attributes -->
    <div v-if="payPeriodData" class="flex flex-col gap-4 w-full">
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
          {{ appStore.getFormattedDateNoDay(payPeriodData.start_date) }}
        </h3>
        <h3 class="font-display-pixel text-lg">to</h3>
        <h3 class="font-display-pixel text-lg">
          {{ appStore.getFormattedDateNoDay(payPeriodData.end_date) }}
        </h3>
        <div class="flex flex-col gap-2">
          <div class="flex justify-start w-full items-center gap-2">
            <p>
              {{ appStore.getClassesForPayPeriod(payPeriodData).length }}
              classes
            </p>
            <!-- button to show or hide list -->
            <SammyButton
              class="w-6 h-6 pb-1"
              @click="showClasses = !showClasses"
              :class="showClasses ? 'rotate-360' : ''"
            >
              <!-- maintain aspect ratio of img -->
              <img
                :src="showClasses ? PayPeriodActive : PayPeriodInactive"
                alt="Show Classes"
                class="w-full object-contain h-full"
              />
            </SammyButton>
          </div>
          <ul class="flex flex-col gap-1" v-if="showClasses">
            <li
              v-for="cls in appStore.getClassesForPayPeriod(payPeriodData)"
              :key="cls.id"
            >
              <span
                @click="router.push(`/class/${cls.id}`)"
                class="text-accent-navy hover:text-accent-navy/60 cursor-pointer"
                >{{ appStore.getFormattedDate(cls.class_date) }}</span
              >
              - ${{ appStore.calculatePay(cls) }}
            </li>
          </ul>
        </div>
      </div>
      <p class="font-display-pixel text-lg text-center">
        ${{ appStore.calculatePayPeriod(payPeriodData) }} earned!
      </p>
      <div class="text-center mb-4">
        <div>/)____/)</div>
        <div>( ◠ ◡ ◠)</div>
        <div>| >💵< |</div>
        <div>-0---0-</div>
      </div>
    </div>
    <PayPeriodModal
      :showModal="showModal"
      @closeModal="toggleModal()"
      @onPayPeriodDeleted="onPayPeriodDeleted()"
      @onPayPeriodEdited="onPayPeriodEdited()"
      :currentPayPeriod="payPeriodData"
    />
  </div>
</template>
