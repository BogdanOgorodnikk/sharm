<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "EmptyLayout",
};
</script>

<style lang="postcss" scoped>
.empty-layout {
  @apply bg-white;
  @apply min-h-screen;
}
</style>
