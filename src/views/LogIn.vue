<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabaseClient";
import PixelButton from "../components/PixelButton.vue";

const email = ref("");
const message = ref("");
const error = ref("");
const buttonDisabled = ref(false);

const login = async () => {
  // Grey out the button until response
  buttonDisabled.value = true;

  const { error: loginError } = await supabase.auth.signInWithOtp({
    email: email.value,
  });

  if (loginError) {
    error.value = loginError.message;
    message.value =
      "Something went wrong... try turning your computer on and off again!";
  } else {
    message.value = "Check your email for the magic link!";
    error.value = "";
  }

  // Re-enable the button
  buttonDisabled.value = false;
};
</script>

<template>
  <div class="p-4 w-full h-2/3">
    <h2 class="font-display-pixel text-sm text-left w-full mb-4">Login</h2>
    <form
      @submit.prevent="login"
      class="flex flex-col h-full gap-4 justify-center"
    >
      <label for="email" class="text-base">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="bg-bg-sky italic border border-accent-navy rounded p-2"
        required
      />
      <PixelButton
        type="submit"
        class="mt-8"
        :disabled="buttonDisabled"
        :class="{ pulse: buttonDisabled }"
      >
        Send Magic Link
      </PixelButton>
    </form>
    <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
    <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
  </div>
</template>
