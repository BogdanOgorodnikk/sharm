<template>
  <router-link
    :to="{ name: backRoute.name, params: backRoute.params }"
    class="arrow-link"
    :class="theme"
  >
    <t-button class="arrow-button" @click="onClick">
      <OurSvgIcon class="icon" name="Arrow-left" size="xs" />

      <div class="title">
        {{ backRoute.title }}
      </div>
    </t-button>
  </router-link>
</template>

<script>
import { getTheme } from "@/services/OurUiService";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "ArrowLink",

  components: {
    OurSvgIcon,
  },

  props: {
    backRoute: {
      type: Object,
      required: true,
      default: () => ({
        name: "",
        title: "",
        params: {},
      }),
      validator(backRoute) {
        const isExistName = "name" in backRoute;
        const isExistTitle = "title" in backRoute;

        return isExistName && isExistTitle;
      },
    },
  },

  computed: {
    theme() {
      return getTheme();
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="postcss" scoped>
.arrow {
  &-link {
    @apply block h-3.5;
  }

  &-button {
    @apply inline-flex items-center;
    @apply border-0 bg-transparent p-0 shadow-none;
    @apply cursor-pointer;

    &:hover {
      @apply bg-transparent;
    }

    .title {
      @apply text-xs font-normal text-gray-500;
      @apply ml-0.5;
    }

    .icon::v-deep {
      g rect {
        @apply opacity-100;
      }

      g [fill] {
        @apply fill-current text-gray-500;
      }
    }
  }
}
</style>
