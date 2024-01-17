<template>
  <tr>
    <td :colspan="colsCount">
      <div class="date-separator-wrap">
        <div class="date-separator" :class="separatorClass"></div>
        <div class="date" :class="titleClass">{{ title }}</div>
        <div class="date-separator" :class="separatorClass"></div>
      </div>
    </td>
  </tr>
</template>

<script>
import { dateConverter } from "@/services/date.service";
import { secondsToMilliseconds, isToday, isTomorrow, isYesterday } from "date-fns";

export default {
  name: "OurDateSeparator",

  props: {
    date: {
      type: Number,
      default: 0,
    },

    colsCount: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    currentDateInMilliseconds: 0,
  }),

  computed: {
    title() {
      let title = "";

      if (isToday(this.currentDateInMilliseconds)) {
        title = this.$t("component.ourTable.today");
      } else if (isTomorrow(this.currentDateInMilliseconds)) {
        title = this.$t("component.ourTable.tomorrow");
      } else if (isYesterday(this.currentDateInMilliseconds)) {
        title = this.$t("component.ourTable.yesterday");
      } else {
        title = dateConverter(this.date, "dateWithFullMonth");
      }

      return title;
    },

    separatorClass() {
      return isToday(this.currentDateInMilliseconds) ? "border-yellow-500" : "border-gray-200";
    },

    titleClass() {
      return isToday(this.currentDateInMilliseconds) ? "text-yellow-500" : "text-gray-400";
    },
  },

  watch: {
    date: {
      handler: "onChangeDate",
      immediate: true,
    },
  },

  methods: {
    onChangeDate() {
      this.currentDateInMilliseconds = secondsToMilliseconds(this.date);
    },
  },
};
</script>

<style lang="postcss" scoped>
td {
  @apply p-0 !important;

  .date-separator-wrap {
    @apply flex items-center justify-center;

    .date {
      @apply px-2 py-0.5;
    }

    .date-separator {
      @apply w-full;
      @apply border-t border-solid;
    }
  }
}
</style>
