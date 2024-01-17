<template>
  <span
    v-tippy="tippyConfig"
    class="svg-icon"
    :class="iconWrapClasses"
    :content="tooltip"
    @click="onClick"
  >
    <inline-svg :class="iconClasses" :src="iconPath" />
  </span>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import VueTippy from "vue-tippy";
import "tippy.js/themes/light.css";
import Vue from "vue";

Vue.use(VueTippy, {
  arrow: true,
  theme: "light",
});

export default {
  name: "OurSvgIcon",

  components: {
    InlineSvg,
  },

  props: {
    tooltip: {
      type: String,
      default: "",
    },

    tooltipSettings: {
      type: Object,
      default: () => {},
    },

    name: {
      type: String,
      required: true,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "md",
    },

    pill: {
      type: Boolean,
      default: false,
    },

    variant: {
      type: String,
      default: "light",
    },

    interactive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    tippyConfig() {
      return { onShow: () => !!this.tooltip, ...this.tooltipSettings };
    },

    iconWrapClasses() {
      const pillClasses = `pill pill-${this.color}`;

      return { [pillClasses]: this.pill };
    },

    iconClasses() {
      const color = `svg-icon-${this.color}-${this.variant}`;
      const size = `size-${this.size}`;
      const classes = { interactive: this.interactive };

      return [color, size, classes];
    },

    iconPath() {
      return require(`./icons/${this.name}.svg`);
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
.interactive::v-deep {
  @apply cursor-pointer;

  &:hover,
  &:active {
    g [fill] {
      @apply opacity-50;
    }
  }
}

.size-2xs {
  @apply h-3.5 w-3.5;
}

.size-xs {
  @apply h-4 w-4;
}

.size-sm {
  @apply h-5 w-5;
}

.size-md {
  @apply h-6 w-6;
}

.size-lg {
  @apply h-8 w-8;
}

.size-xl {
  @apply h-10 w-10;
}

.size-2xl {
  @apply h-12 w-12;
}

.size-3xl {
  @apply h-14 w-14;
}

.svg-icon {
  @apply inline-table;

  svg::v-deep g [fill] {
    @apply fill-current;
  }

  &-white {
    &-light::v-deep g [fill] {
      @apply text-white;
    }

    &-dark::v-deep g [fill] {
      @apply text-base-light;
    }
  }

  &-gray {
    &-light::v-deep g [fill] {
      @apply text-gray-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-gray-700;
    }
  }

  &-red {
    &-light::v-deep g [fill] {
      @apply text-red-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-red-700;
    }
  }

  &-yellow {
    &-light::v-deep g [fill] {
      @apply text-yellow-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-yellow-700;
    }
  }

  &-green {
    &-light::v-deep g [fill] {
      @apply text-green-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-green-700;
    }
  }

  &-blue {
    &-light::v-deep g [fill] {
      @apply text-blue-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-blue-700;
    }
  }

  &-violet {
    &-light::v-deep g [fill] {
      @apply text-violet-200;
    }

    &-dark::v-deep g [fill] {
      @apply text-violet-400;
    }
  }
}

.pill {
  @apply rounded-full p-1.5;

  &-white {
    @apply bg-white;
  }

  &-gray {
    @apply bg-gray-50;
  }

  &-red {
    @apply bg-red-50;
  }

  &-yellow {
    @apply bg-yellow-50;
  }

  &-green {
    @apply bg-green-50;
  }

  &-blue {
    @apply bg-blue-50;
  }

  &-violet {
    @apply bg-violet-50;
  }
}
</style>
