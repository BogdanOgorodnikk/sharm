<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.frameDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteFrame"
  >
    <div v-html="$t('page.accessories.frame.deleteModalText', { title: item.name })" />
  </OurConfirmModal>
</template>

<script>
import { mapActions } from "vuex";
import OurConfirmModal from "@/components/OurConfirmModal";

export default {
  components: { OurConfirmModal },
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object,
      default: () => {},
    },

    delaySuccessNotify: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    ...mapActions("frame", ["deleteFrame"]),

    async onConfirmDeleteFrame() {
      await this.deleteFrame({
        frameId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "FrameList") {
        await this.$router.push({ name: "FrameList" });
      }
    },
  },
};
</script>
