<template>
  <router-link data-cy="our-logo" :to="route" class="logo-wrap" @click.native="onClick">
    <div class="logo" :class="sizeClass">
      <div v-if="label" class="logo-label">
        {{ label }}
      </div>

      <div class="logo-image" :style="bgImage" />
    </div>

    <div v-if="title" class="title" :class="sizeTitleClass">
      {{ title }}
    </div>
  </router-link>
</template>

<script>
export default {
  name: "OurLogo",

  props: {
    /**
     * Set the path for img.
     */
    path: {
      type: String,
      default: "",
    },

    /**
     * Set label for component.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set title for component.
     */
    title: {
      type: String,
      default: "",
    },

    /**
     * The size of title.
     * @values 2xs, xs, sm, md, lg, xl, 2xl
     */
    sizeTitle: {
      type: String,
      default: "md",
    },

    /**
     * The size of the logo.
     * @values 2xs, xs, sm, md, lg, xl, 2xl, 3xl
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set route params.
     */
    route: {
      type: [String, Object],
      default: "/",
    },
  },

  computed: {
    bgImage() {
      let path = this.path.includes("http") ? this.path : process.env.BASE_URL + this.path;

      return `background-image: url(${path});`;
    },

    sizeClass() {
      return `size-${this.size}`;
    },

    sizeTitleClass() {
      return `size-${this.sizeTitle}-title`;
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
.logo-wrap {
  @apply flex items-center;

  .logo {
    @apply relative;

    &-label {
      @apply bg-red-500 text-xs font-medium text-white;
      @apply rounded-full;
      @apply absolute -top-1.5 -right-7 py-0.5 px-2;
    }

    &-image {
      @apply h-full w-full;
      @apply bg-contain bg-center bg-no-repeat;
    }
  }

  .title {
    @apply whitespace-nowrap px-3.5 font-bold text-white;
  }
}

.size-2xs {
  @apply h-3.5 w-3.5;

  &-title {
    @apply text-xs;
  }
}

.size-xs {
  @apply h-4 w-4;

  &-title {
    @apply text-sm;
  }
}

.size-sm {
  @apply h-5 w-5;

  &-title {
    @apply text-base;
  }
}

.size-md {
  @apply h-6 w-6;

  &-title {
    @apply text-lg;
  }
}

.size-lg {
  @apply h-8 w-8;

  &-title {
    @apply text-2xl;
  }
}

.size-xl {
  @apply h-10 w-10;

  &-title {
    @apply text-3xl;
  }
}

.size-2xl {
  @apply h-12 w-12;

  &-title {
    @apply text-4xl;
  }
}

.size-3xl {
  @apply h-14 w-14;
}
</style>
