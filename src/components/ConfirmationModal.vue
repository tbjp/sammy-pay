<script setup>
import Exit from "../assets/images/icons/exit.png";
import Afterlife from "../assets/images/cats/afterlife cat.jpg";
import CakedUp from "../assets/images/cats/caked up cat.jpg";
import Existential from "../assets/images/cats/existential cat.jpg";
import Flowers from "../assets/images/cats/flowers cat.jpg";
import Homeless from "../assets/images/cats/homeless cat.jpg";
import Huh from "../assets/images/cats/huh cat.jpg";
import Judgement from "../assets/images/cats/judgement cat.jpg";
import Needy from "../assets/images/cats/needy cat.jpg";
import Oops from "../assets/images/cats/oops cat.jpg";
import Party from "../assets/images/cats/party cat.jpg";
import Rich from "../assets/images/cats/rich cat.jpg";
import Smiley from "../assets/images/cats/smiley cat.jpg";
import Whoa from "../assets/images/cats/whoa cat.jpg";

const props = defineProps({
  showConfirmationModal: {
    type: Boolean,
    required: true,
  },
  confirmationMessage: {
    type: String,
    required: false,
    default: "Are you sure?",
  },
});

const emit = defineEmits(["closeConfirmationModal"]);

const messages = {
  classAdded: ["Class added", "Keep stacking that cash!"],
  classDeleted: [
    "Class deleted",
    "Did it ever truly exist in the first place...",
  ],
  classEdited: [
    "Class edited",
    "The class entry wasn’t the only thing that changed...",
  ],
  payPeriodAdded: ["Pay period added", "WoooOoOOowzzzAAAaa!"],
  payPeriodDeleted: ["Pay period deleted", ""],
  payPeriodEdited: ["Pay period edited", "While I have you here,"],
};

function toggleModal() {
  emit("closeConfirmationModal");
}

// image case function
function getImage() {
  switch (props.confirmationMessage) {
    case "classAdded":
      return Rich;
    case "classDeleted":
      return Existential;
    case "classEdited":
      return CakedUp;
    case "payPeriodAdded":
      return Whoa;
    case "payPeriodDeleted":
      return Afterlife;
    case "payPeriodEdited":
      return Needy;
    default:
      return Huh;
  }
}

console.log(props.confirmationMessage);
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': showConfirmationModal }">
    <div class="modal-box bg-transparent shadow-none">
      <div class="bg-white min-h-24 border border-accent-navy rounded w-full">
        <div
          class="bg-accent-lavender border-b border-accent-navy rounded-t h-[24px] flex items-center justify-end pe-2"
        >
          <div class="w-4 h-4 cursor-pointer" @click="toggleModal()">
            <img :src="Exit" alt="Close" class="w-full h-full" />
          </div>
        </div>
        <div class="flex flex-col p-4 items-center">
          <p class="text-center font-display-pixel text-base pb-2">
            {{ messages[confirmationMessage][0] }}
          </p>
          <p>
            {{ messages[confirmationMessage][1] }}
          </p>
          <img
            :src="getImage()"
            alt="Cat"
            class="max-w-full max-h-full w-48 h-48 object-contain"
          />
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="toggleModal()">close</button>
    </form>
  </dialog>
</template>
