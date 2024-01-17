<template>
  <t-button
    class="button"
    :disabled="disabled"
    :class="buttonClasses"
    :variant="variant"
    @click="onClick"
  >
    <slot name="icon-left" />

    <div v-if="text" class="text-wrap">
      <slot>
        {{ text }}
      </slot>
    </div>

    <slot name="icon-right" />
  </t-button>
</template>

<script>
import { getTheme } from "@/services/OurUiService";

export default {
  name: "OurButton",

  props: {
    variant: {
      type: String,
      default: "primary",
    },

    size: {
      type: String,
      default: "md",
    },

    text: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    pill: {
      type: Boolean,
      default: false,
    },

    darkMode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    buttonClasses() {
      const size = `size-${this.size}`;
      const theme = getTheme();
      const classes = { pill: this.pill, "dark-mode": this.darkMode };

      return [theme, classes, this.variant, size];
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped lang="postcss">
.button {
  @apply flex items-center justify-center;
  @apply text-base font-medium;
  @apply rounded-lg outline-none;
  @apply transition duration-100 ease-in-out;

  &:focus {
    @apply ring-4 ring-gray-600 ring-opacity-15;
  }

  .text-wrap {
    @apply whitespace-nowrap px-1.5;
  }
}

.pill {
  @apply rounded-full;
}

.size-sm {
  @apply p-2.5;
  @apply text-sm;
}

.size-md {
  @apply p-3;
}

.size-lg {
  @apply p-4;
}

.size-xl {
  @apply px-6 py-4;
}

.primary {
  @apply border border-solid border-base-dark bg-base-dark text-white;

  &:focus {
    @apply bg-gray-700;
  }

  &:hover {
    @apply border-gray-700 bg-gray-700;
  }

  &:active {
    @apply border-gray-600 bg-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-200 bg-gray-200;
  }
}

.secondary {
  @apply border border-solid border-gray-900 bg-transparent text-base-dark;

  &:focus {
    @apply border-gray-700 text-gray-700;
  }

  &:hover {
    @apply border-gray-700 text-gray-700;
  }

  &:active {
    @apply border-gray-600 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-300;
  }
}

.thirdary {
  @apply border border-transparent bg-transparent text-base-dark;

  &:focus {
    @apply border-gray-200 bg-base-dark bg-opacity-5;
  }

  &:hover {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-5;
  }

  &:active {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-10 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
  }
}

.transparent {
  @apply border bg-base-dark bg-opacity-5;

  &:focus {
    @apply border-gray-100 bg-opacity-10 ring-4 ring-gray-100;
  }

  &:hover {
    @apply bg-opacity-10;
  }

  &:active {
    @apply bg-opacity-15;
  }
}

.dark-mode {
  &.transparent {
    @apply bg-white bg-opacity-5 text-white;
  }
}

.link {
  @apply text-xs font-normal text-gray-500;
  @apply rounded-none border-b border-dashed border-gray-500 bg-transparent;
  @apply p-0 ring-transparent;

  &:hover {
    @apply border-gray-600 text-gray-600;
  }

  .text-wrap {
    @apply p-0;
  }
}
</style>

<!-- Accent theme -->
<style scoped lang="postcss">
.accent-theme {
  &.button {
    &:focus {
      @apply ring-4 ring-accent ring-opacity-15;
    }
  }

  &.primary {
    @apply border-accent bg-accent;
    @apply border border-solid text-white;

    &:focus {
      @apply bg-accent bg-opacity-80;
    }

    &:hover {
      @apply bg-accent bg-opacity-80;
      @apply border-accent border-opacity-5;
    }

    &:active {
      @apply bg-accent bg-opacity-70;
      @apply border-accent border-opacity-5;
    }

    &:disabled {
      @apply text-white;
      @apply border-transparent bg-accent bg-opacity-50;
    }
  }

  &.secondary {
    @apply border border-solid bg-transparent text-accent;
    @apply border-accent border-opacity-90;

    &:focus {
      @apply border-accent border-opacity-80;
      @apply text-accent text-opacity-70;
    }

    &:hover {
      @apply border-accent border-opacity-80;
      @apply text-accent text-opacity-70;
    }

    &:active {
      @apply border-accent border-opacity-70;
      @apply text-accent text-opacity-60;
    }

    &:disabled {
      @apply text-accent text-opacity-40;
      @apply border-accent border-opacity-20;
    }
  }

  &.thirdary {
    @apply border border-transparent bg-transparent text-base-dark;

    &:focus {
      @apply bg-accent bg-opacity-5;
      @apply border-accent border-opacity-20;
    }

    &:hover {
      @apply bg-accent bg-opacity-5;
      @apply border-accent border-opacity-0;
    }

    &:active {
      @apply bg-accent bg-opacity-10 text-gray-600;
      @apply border-accent border-opacity-0;
    }

    &:disabled {
      @apply text-gray-400;
    }
  }

  &.transparent {
    @apply bg-accent bg-opacity-5;

    &:focus {
      @apply bg-opacity-10 ring-4 ring-accent ring-opacity-5;
      @apply border-accent;
    }

    &:hover {
      @apply bg-opacity-10;
    }

    &:active {
      @apply bg-opacity-15;
    }
  }
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.primary {
    @apply bg-gradient-to-r from-violet-600 to-blue-600;
    @apply border-none;
  }

  &.secondary {
    @apply border-violet-900 border-opacity-40;

    .text-wrap {
      @apply bg-clip-text text-transparent;
      @apply bg-gradient-to-r from-violet-600 to-blue-600;
    }
  }
}
</style>
