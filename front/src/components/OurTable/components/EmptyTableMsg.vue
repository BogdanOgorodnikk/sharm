<template>
  <tbody>
    <tr>
      <td :colspan="colspan">
        <span class="empty-table-msg" data-cy="empty-table-msg">
          {{ emptyTableMsg }}
        </span>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: "OurEmptyTableMsg",

  props: {
    colspan: {
      type: Number,
      default: 1,
    },

    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    emptyTableMsg() {
      const isFiltersApplied = !!Object.keys(this.filters).length;

      return isFiltersApplied
        ? this.$t("component.ourTable.noResultsForFilters")
        : this.$t("component.ourTable.noItems");
    },
  },
};
</script>

<style lang="postcss" scoped>
.empty-table-msg {
  @apply flex w-full justify-center font-extralight text-gray-400;
}
</style>
