<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.trailerDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteTrailer"
  >
    <div v-html="$t('page.transport.trailer.deleteModalText', { title: item.licensePlate })" />
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
    ...mapActions("trailer", ["deleteTrailer"]),

    async onConfirmDeleteTrailer() {
      await this.deleteTrailer({
        trailerId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "TrailerList") {
        await this.$router.push({ name: "TrailerList" });
      }
    },
  },
};
</script>
