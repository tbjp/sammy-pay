<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/store";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const classId = computed(() => route.params.id);
const classData = computed(() =>
  appStore.classes.find((cls) => cls.id.toString() === classId.value),
);

// If class not found, redirect to classes list
if (!classData.value) {
  router.push("/");
}
</script>

<template>
  <div v-if="classData" class="flex flex-col gap-4 w-full">
    <h2 class="font-display-pixel text-xl">Class Details</h2>
    <div class="flex flex-col gap-2">
      <h3 class="font-display-pixel text-lg">
        {{ appStore.getFormattedDate(classData.class_date) }}
      </h3>
      <p>{{ classData.num_students }} students</p>
      <p>${{ classData.base_pay_per_class }} earned</p>
    </div>
  </div>
</template>
