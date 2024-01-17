<template>
  <div class="list">
    <div v-for="item in list" :id="item.id" :key="item.id" class="list-items">
      <div class="list-item-parent">
        <div class="list-item-left">
          <OurSvgIcon
            class="icon-dial-numbers drag-icon"
            name="Dial-numbers"
            color="gray"
            variant="light"
          />
        </div>

        <slot :item="item">
          <div class="list-item-left-title">{{ item.name }}</div>
        </slot>

        <div class="list-item-right">
          <div v-if="isShownIconsSlot" class="icon-wrapper">
            <slot name="icons" :item="item" />
          </div>

          <OurSvgIcon
            interactive
            class="icon-trash icon"
            name="Trash"
            color="red"
            @click="onClickDelete(item.id, item.name, item)"
          />

          <OurSvgIcon
            interactive
            class="icon-edit"
            name="Edit"
            color="gray"
            @click="onClickEdit(item.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurTableList",

  components: {
    OurSvgIcon,
  },

  props: {
    /**
     * Set data list for component.
     */
    list: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isShownIconsSlot() {
      return !!this.$slots["icons"];
    },
  },

  methods: {
    onClickEdit(id) {
      this.$emit("clickEdit", id);
    },

    onClickDelete(id, title, item) {
      this.$emit("clickDelete", id, title, item);
    },
  },
};
</script>

<style lang="postcss" scoped>
.list {
  @apply overflow-x-auto sm:overflow-x-visible;

  &-item {
    &-parent {
      @apply flex items-center justify-between;
      @apply py-4;
      @apply border border-r-0 border-l-0 border-t-0 border-solid border-gray-100;

      &:hover {
        &::v-deep {
          .icon {
            @apply opacity-100;
            @apply transition duration-100 ease-in-out;

            &-edit {
              & g [fill] {
                @apply text-gray-500;
              }
            }
          }
        }

        .icon-wrapper {
          @apply opacity-100;
          @apply transition duration-100 ease-in-out;
        }
      }
    }

    &-left {
      @apply flex items-center;

      &-title {
        @apply flex-auto;
        @apply text-base font-normal text-base-dark;
        @apply ml-5 pt-px;
      }
    }

    &-right {
      @apply flex flex-none items-center justify-end;
      @apply w-28 space-x-5;
    }
  }

  &-items {
    &:last-child {
      .list-item-parent {
        @apply border-b-0;
      }
    }
  }
}

.icon {
  @apply opacity-0;

  &-wrapper {
    @apply flex items-center space-x-5;
    @apply opacity-0;
  }

  &-edit {
    &::v-deep {
      & g [fill] {
        @apply text-gray-300;
      }
    }
  }

  &-dial-numbers {
    &::v-deep {
      & g [fill] {
        @apply text-gray-400;
        @apply opacity-100;
      }
    }
  }
}
</style>
