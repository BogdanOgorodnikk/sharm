<template>
  <div class="our-row">
    <slot />
  </div>
</template>

<script>
export default {
  name: "OurRow",
};
</script>

<style lang="postcss" scoped>
.our-row {
  @apply flex space-x-5;
}
</style>
