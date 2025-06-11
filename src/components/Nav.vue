<script setup>
import SammyButton from "./SammyButton.vue";
import HomeActive from "../assets/images/icons/home/active.png";
import HomeInactive from "../assets/images/icons/home/inactive.png";
import PayPeriodActive from "../assets/images/icons/payperiod/active.png";
import PayPeriodInactive from "../assets/images/icons/payperiod/inactive.png";
import SettingsActive from "../assets/images/icons/settings/active.png";
import SettingsInactive from "../assets/images/icons/settings/inactive.png";
</script>

<template>
  <div class="flex justify-evenly items-center w-full bg-accent-aqua h-12">
    <SammyButton class="w-6 h-6">
      <img :src="HomeActive" alt="Home" class="w-full h-full" />
    </SammyButton>
    <SammyButton class="w-6 h-6">
      <img :src="PayPeriodInactive" alt="Pay Period" class="w-full h-full" />
    </SammyButton>
    <SammyButton class="w-6 h-6">
      <img :src="SettingsInactive" alt="Settings" class="w-full h-full" />
    </SammyButton>
  </div>
</template>
