<template>
  <t-alert class="hint" :class="variantClass" show :timeout="timeout" @hidden="onHidden">
    <div class="hint-wrapper">
      <!-- @slot Use it to add something inside. -->
      <slot />
    </div>
  </t-alert>
</template>

<script>
import TAlert from "vue-tailwind/dist/t-alert";

export default {
  name: "OurHint",

  components: {
    TAlert,
  },

  props: {
    /**
     * Set text hint variant.
     * @values gray, red, orange, yellow, green, blue, violet, fuchsia
     */
    variant: {
      type: String,
      default: "gray",
    },

    /**
     * Set text hint timeout.
     */
    timeout: {
      type: Number,
      default: 0,
    },

    /**
     * Show / hide close button.
     */
    closeButton: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    variantClass() {
      return this.closeButton
        ? `${this.variant}-active`
        : [`${this.variant}-disable`, "button-disabled "];
    },
  },

  methods: {
    onHidden() {
      this.$emit("hidden", this.message);
    },
  },
};
</script>

<style lang="postcss" scoped>
.hint {
  @apply rounded-lg border-0 p-4;

  &-wrapper {
    @apply text-sm;

    &::v-deep {
      h3 {
        @apply font-medium;
        @apply mb-0.5;
      }

      p {
        @apply font-normal;
      }

      ul {
        @apply font-normal leading-[1.125rem];
        @apply list-inside list-disc;
        @apply ml-2;
      }

      a {
        @apply font-medium;
        @apply underline;
      }
    }
  }
}

.button-disabled {
  &::v-deep {
    button {
      @apply hidden;
    }
  }
}

.gray {
  &-active,
  &-disable {
    @apply bg-gray-100 text-gray-500;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-gray-500 hover:bg-gray-200;
      }
    }
  }
}

.red {
  &-active,
  &-disable {
    @apply bg-red-50 text-red-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-red-500 hover:bg-red-200;
      }
    }
  }
}

.orange {
  &-active,
  &-disable {
    @apply bg-orange-50 text-orange-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-orange-500 hover:bg-orange-200;
      }
    }
  }
}

.yellow {
  &-active,
  &-disable {
    @apply bg-yellow-50 text-yellow-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-yellow-500 hover:bg-yellow-200;
      }
    }
  }
}

.green {
  &-active,
  &-disable {
    @apply bg-green-50 text-green-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-green-500 hover:bg-green-200;
      }
    }
  }
}

.blue {
  &-active,
  &-disable {
    @apply bg-blue-50 text-blue-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-blue-500 hover:bg-blue-200;
      }
    }
  }
}

.violet {
  &-active,
  &-disable {
    @apply bg-violet-50 text-violet-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-violet-500 hover:bg-violet-200;
      }
    }
  }
}

.fuchsia {
  &-active,
  &-disable {
    @apply bg-fuchsia-50 text-fuchsia-700;
  }

  &-active {
    &::v-deep {
      button {
        @apply text-fuchsia-500 hover:bg-fuchsia-200;
      }
    }
  }
}
</style>
