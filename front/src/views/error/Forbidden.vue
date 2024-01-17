<template>
  <div>
    <h1 class="error-title">
      {{ $t("title.error.forbidden") }}
    </h1>
    <p>
      {{ $t("page.forbidden.description") }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Forbidden",
};
</script>

<style lang="postcss" scoped>
.error-title {
  @apply text-9xl;
}
</style>
