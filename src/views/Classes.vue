<script setup>
import { useAppStore } from "../stores/store";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import Card from "../components/Card.vue";
import SammyButton from "../components/SammyButton.vue";
import ClassModal from "../components/AddEditClass.vue";
import Add from "../assets/images/icons/add.png";
import ChevronRight from "../assets/images/icons/chevron/right.png";
import Star from "../assets/images/star.webp";
import PixelButton from "../components/PixelButton.vue";
import PartyCat from "../assets/images/cats/party cat.jpg";

const appStore = useAppStore();
const router = useRouter();

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}

function onClassAdded() {
  router.push({ path: "/", query: { modal: "classAdded" } });
}
const listLength = ref(20);
function loadMore() {
  listLength.value += 20;
  if (listLength.value > appStore.sortedClasses.length) {
    listLength.value = appStore.sortedClasses.length;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full pb-4 items-center">
    <img :src="Star" alt="Star" class="w-32 min-h-28" />
    <div class="flex justify-between w-full">
      <h2 class="font-display-pixel text-sm text-left">Classes</h2>
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
        v-for="cls in appStore.sortedClasses.slice(0, listLength)"
        :key="cls.id"
        :hearts="true"
      >
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-1 text-left">
            <h3 class="font-display-pixel text-sm">
              {{ appStore.getFormattedDate(cls.class_date) }}
            </h3>
            <p>{{ cls.num_students }} students</p>
            <p>${{ appStore.calculatePay(cls) }} earned</p>
          </div>
          <div class="flex items-end">
            <SammyButton
              class="w-5 h-5"
              @click="router.push(`/class/${cls.id}`)"
            >
              <img
                :src="ChevronRight"
                alt="Class Details"
                class="w-full h-full"
              />
            </SammyButton>
          </div>
        </div>
      </Card>
      <div v-if="appStore.sortedClasses.length > listLength">
        <PixelButton @click="loadMore()">MORE!</PixelButton>
      </div>

      <Card v-if="appStore.user === 'none'">
        <div class="flex flex-col gap-4 items-center">
          <img :src="PartyCat" alt="Party Cat" class="w-32 min-h-28" />
          <p>
            Welcome! Sync your data to keep it safe. Or throw caution to the
            wind and just start adding classes!
          </p>
          <PixelButton @click="router.push('/login')">Login</PixelButton>
        </div>
      </Card>
    </ul>
    <ClassModal
      :showModal="showModal"
      @closeModal="toggleModal()"
      @onClassAdded="onClassAdded()"
    />
  </div>
</template>
