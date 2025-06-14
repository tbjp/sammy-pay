<template>
  <div class="flex justify-center">
    <div class="relative inline-block w-content">
      <!-- Shadow behind the button -->
      <div
        class="absolute rounded left-1 top-1 font-display-pixel px-4 py-2 text-lg bg-[#21387C] border-2 border-[#21387C] pointer-events-none"
        aria-hidden="true"
      >
        <slot></slot>
      </div>

      <!-- Actual button -->
      <button
        class="relative rounded font-display-pixel px-4 py-2 text-lg text-[#21387C] bg-[#F9F4FF] border-2 border-[#21387C] hover:translate-x-1 hover:translate-y-1 transition-transform"
      >
        <slot></slot>
      </button>
    </div>
  </div>
</template>
