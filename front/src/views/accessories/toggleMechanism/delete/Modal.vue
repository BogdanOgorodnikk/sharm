<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.toggleMechanismDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteToggleMechanism"
  >
    <div v-html="$t('page.accessories.toggleMechanism.deleteModalText', { title: item.name })" />
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
    ...mapActions("toggleMechanism", ["deleteToggleMechanism"]),

    async onConfirmDeleteToggleMechanism() {
      await this.deleteToggleMechanism({
        toggleMechanismId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "ToggleMechanismList") {
        await this.$router.push({ name: "ToggleMechanismList" });
      }
    },
  },
};
</script>
