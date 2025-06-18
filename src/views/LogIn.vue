<template>
  <div class="p-4">
    <form @submit.prevent="login">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="border p-2"
        required
      />
      <button type="submit" class="mt-2 bg-blue-500 text-white p-2">
        Send Magic Link
      </button>
    </form>
    <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
    <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabaseClient";

const email = ref("");
const message = ref("");
const error = ref("");

const login = async () => {
  const { error: loginError } = await supabase.auth.signInWithOtp({
    email: email.value,
  });

  if (loginError) {
    error.value = loginError.message;
    message.value = "";
  } else {
    message.value = "Check your email for the magic link!";
    error.value = "";
  }
};
</script>
