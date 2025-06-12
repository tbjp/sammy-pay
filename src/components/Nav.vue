<script setup>
import SammyButton from "./SammyButton.vue";
import HomeActive from "../assets/images/icons/home/active.png";
import HomeInactive from "../assets/images/icons/home/inactive.png";
import PayPeriodActive from "../assets/images/icons/payperiod/active.png";
import PayPeriodInactive from "../assets/images/icons/payperiod/inactive.png";
import SettingsActive from "../assets/images/icons/settings/active.png";
import SettingsInactive from "../assets/images/icons/settings/inactive.png";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div
    class="flex justify-evenly items-center w-full bg-accent-aqua h-12 z-10 relative rounded-t-lg"
  >
    <SammyButton class="w-6 h-6" @click="router.push('/')">
      <img
        v-if="router.currentRoute.value.name === 'classes'"
        :src="HomeActive"
        alt="Home"
        class="w-full h-full"
      />
      <img v-else :src="HomeInactive" alt="Home" class="w-full h-full" />
    </SammyButton>
    <SammyButton class="w-6 h-6" @click="router.push('/pay-periods')">
      <img
        v-if="router.currentRoute.value.name === 'pay-periods'"
        :src="PayPeriodActive"
        alt="Pay Period"
        class="w-full h-full"
      />
      <img
        v-else
        :src="PayPeriodInactive"
        alt="Pay Period"
        class="w-full h-full"
      />
    </SammyButton>
    <SammyButton class="w-6 h-6" @click="router.push('/settings')">
      <img
        v-if="router.currentRoute.value.name === 'settings'"
        :src="SettingsActive"
        alt="Settings"
        class="w-full h-full"
      />
      <img
        v-else
        :src="SettingsInactive"
        alt="Settings"
        class="w-full h-full"
      />
    </SammyButton>
  </div>
</template>
