<template>
  <notifications
    group="notify"
    class="notify"
    animation-type="velocity"
    :animation="animation"
    :class="theme"
    :position="position"
  >
    <template #body="props">
      <div :data-cy="`${props.item.type}-notify`" class="notify-body" :class="[props.item.type]">
        <div class="content" v-html="props.item.text"></div>

        <OurSvgIcon
          data-cy="close-notify"
          class="icon"
          name="Close"
          size="sm"
          @click="props.close"
        />
      </div>
    </template>
  </notifications>
</template>

<script>
import "./notify.plugin";
import { getTheme } from "@/services/OurUiService";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurNotify",
  components: {
    OurSvgIcon,
  },

  props: {
    /**
     * The position on the x-axis.
     * @values left, center, right
     */
    xPosition: {
      type: String,
      default: "center",
    },

    /**
     * The position on the y-axis.
     * @values top, bottom
     */
    yPosition: {
      type: String,
      default: "top",
    },
  },

  data: () => ({
    animation: null,
  }),

  computed: {
    theme() {
      return getTheme();
    },

    position() {
      return [this.yPosition, this.xPosition];
    },
  },

  mounted() {
    this.animation = {
      enter() {
        return {
          opacity: [1, 0],
        };
      },
      leave: {
        height: 0,
        opacity: 0,
      },
    };
  },
};
</script>

<style lang="postcss" scoped>
.notify::v-deep {
  @apply w-full md:w-80 !important;
  @apply px-4 md:mr-4 md:ml-4 md:px-0;

  .vue-notification-wrapper::v-deep {
    @apply overflow-visible;
  }

  .notify-body {
    @apply flex items-start justify-between;
    @apply rounded-lg shadow-md;
    @apply mt-3 mb-3 pt-3.5 pb-3.5 pl-4 pr-3 md:mt-4;

    .content {
      @apply self-center text-sm font-normal text-white;
    }

    .icon {
      @apply cursor-pointer;
    }
  }

  .error {
    @apply bg-red-500;

    .icon {
      &:hover {
        g [fill] {
          @apply fill-current text-red-400;
        }
      }

      g [fill] {
        @apply fill-current text-red-300;
      }
    }
  }

  .warning {
    @apply bg-yellow-500;

    .icon {
      &:hover {
        g [fill] {
          @apply fill-current text-yellow-400;
        }
      }

      g [fill] {
        @apply fill-current text-yellow-300;
      }
    }
  }

  .success {
    @apply bg-green-500;

    .icon {
      &:hover {
        g [fill] {
          @apply fill-current text-green-400;
        }
      }

      g [fill] {
        @apply fill-current text-green-300;
      }
    }
  }

  .info {
    @apply bg-blue-500;

    .icon {
      &:hover {
        g [fill] {
          @apply fill-current text-blue-400;
        }
      }

      g [fill] {
        @apply fill-current text-blue-300;
      }
    }
  }
}
</style>
