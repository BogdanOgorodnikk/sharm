<template>
  <div>
    <t-button
      v-if="routerLink"
      variant="link"
      class="link crop-text"
      :class="linkClasses"
      :to="route"
    >
      {{ text }}
    </t-button>

    <t-button
      v-else
      variant="link"
      class="link crop-text"
      :class="linkClasses"
      :href="url"
      :target="targetValue"
      @mousedown="onMousedown"
      @focus="onFocus"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      {{ text }}
    </t-button>
  </div>
</template>

<script>
import TButton from "vue-tailwind/dist/t-button";

export default {
  name: "OurLink",

  components: {
    TButton,
  },

  props: {
    /**
     * Set button text.
     */
    text: {
      type: String,
      default: "",
      required: true,
    },

    /**
     * Set url link for the button.
     */
    url: {
      type: String,
      default: "",
    },

    /**
     * Makes use of the button for router.
     */
    routerLink: {
      type: Boolean,
      default: false,
    },

    /**
     * Set router link for the button.
     */
    route: {
      type: Object,
      default: () => ({}),
    },

    /**
     * The variant of the button.
     * @values primary, secondary
     */
    variant: {
      type: String,
      default: "primary",
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Make button border dashed.
     */
    dashed: {
      type: Boolean,
      default: false,
    },

    /**
     * Open url link in new window.
     */
    targetBlank: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    linkClasses() {
      const size = `size-${this.size}`;
      const classes = {
        "link-dashed": this.dashed,
      };

      return [this.variant, size, classes];
    },
    targetValue() {
      return this.targetBlank ? "_blank" : "";
    },
  },

  methods: {
    onMousedown() {
      this.$emit("mousedown");
    },

    onFocus() {
      this.$emit("focus");
    },

    onKeydown() {
      this.$emit("keydown");
    },

    onBlur(event) {
      this.$emit("blur", event);
    },
  },
};
</script>

<style lang="postcss" scoped>
.size {
  &-xs {
    @apply text-xs;
  }

  &-sm {
    @apply text-sm;
  }

  &-md {
    @apply text-base;
  }

  &-lg {
    @apply text-lg;
  }
}

.link {
  @apply transition duration-100 ease-in-out;

  &-dashed {
    @apply border-b border-dashed;
  }

  &:focus {
    @apply outline-0;
  }
}

.primary {
  @apply border-blue-500 text-blue-500;

  &:focus {
    @apply border-blue-400 text-blue-400 outline-blue-400/25;
  }

  &:hover {
    @apply border-blue-400 text-blue-400;
  }

  &:active {
    @apply border-blue-300 text-blue-300;
  }
}

.secondary {
  @apply border-gray-500 text-gray-500;

  &:focus {
    @apply border-gray-400 text-gray-400 outline-gray-400/25;
  }

  &:hover {
    @apply border-gray-400 text-gray-400;
  }

  &:active {
    @apply border-gray-300 text-gray-300;
  }
}
</style>
