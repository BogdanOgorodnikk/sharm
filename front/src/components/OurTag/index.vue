<template>
  <div class="tag" :class="[theme, variant, sizeClass]">
    <div class="body">
      <div>{{ text }}</div>
      <OurSvgIcon
        v-if="tooltipText"
        v-tippy
        :content="tooltipText"
        name="Info-circle"
        size="xs"
        class="icon"
      />
    </div>
  </div>
</template>

<script>
import "./tippy.plugin";
import { getTheme } from "@/services/OurUiService";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurTag",
  components: {
    OurSvgIcon,
  },

  props: {
    /**
     * The variant of the tag.
     * @values gray, red, orange, yellow, green, blue, violet
     */
    variant: {
      type: String,
      default: "blue",
    },

    /**
     * The size of the tag.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set tag text.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * Set tooltip text.
     */
    tooltipText: {
      type: String,
      default: "",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    sizeClass() {
      return {
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.tag {
  @apply rounded-full;
  @apply inline-block;

  .body {
    @apply flex items-center;
  }

  .icon {
    @apply ml-1;

    &::v-deep g [fill] {
      @apply fill-current;
    }
  }
}

.size-sm {
  @apply p-0.5 px-2;
  @apply text-2xs;
}

.size-md {
  @apply py-1 px-2;
  @apply text-xs;
}

.size-lg {
  @apply py-1.5 px-3;
  @apply text-sm;
}

.gray {
  @apply bg-gray-100 text-base-dark;
}

.red {
  @apply bg-red-100 text-red-800;
}

.orange {
  @apply bg-orange-100 text-orange-800;
}

.yellow {
  @apply bg-yellow-100 text-yellow-800;
}

.green {
  @apply bg-green-100 text-green-800;
}

.blue {
  @apply bg-blue-100 text-blue-800;
}

.violet {
  @apply bg-violet-100 text-violet-800;
}

.fuchsia {
  @apply bg-fuchsia-100 text-fuchsia-800;
}
</style>
