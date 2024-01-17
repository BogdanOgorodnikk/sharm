<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.fillingDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteFilling"
  >
    <div v-html="$t('page.accessories.filling.deleteModalText', { title: item.name })" />
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
    ...mapActions("filling", ["deleteFilling"]),

    async onConfirmDeleteFilling() {
      await this.deleteFilling({
        fillingId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "FillingList") {
        await this.$router.push({ name: "FillingList" });
      }
    },
  },
};
</script>
