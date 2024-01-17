<template>
  <transition name="loader">
    <div class="app-loader">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "OurLoader",
};
</script>

<style lang="postcss">
.app-loader {
  @apply flex justify-center;
  @apply fixed top-0 left-0 z-50 h-screen w-screen;
  @apply bg-black bg-opacity-40;
  @apply transition-all duration-300;

  .lds-ripple {
    @apply relative top-1/3 h-40 w-40;
    @apply ml-auto mr-auto;

    div {
      @apply absolute opacity-100;
      @apply rounded-full border-4 border-solid border-white;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;

      &:nth-child(2) {
        animation-delay: -0.5s;
      }
    }
  }

  @keyframes lds-ripple {
    0% {
      @apply top-20 left-20 h-0 w-0 opacity-100;
    }

    100% {
      @apply top-0 left-0 h-40 w-40 opacity-0;
    }
  }
}

.loader-enter .loader-container-loader,
.loader-leave-active .loader-container-loader {
  @apply scale-110 transform;
}
</style>
