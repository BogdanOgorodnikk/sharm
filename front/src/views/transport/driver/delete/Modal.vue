<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.driverDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteDriver"
  >
    <div v-html="$t('page.transport.driver.deleteModalText', { title: item.fullName })" />
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
    ...mapActions("driver", ["deleteDriver"]),

    async onConfirmDeleteDriver() {
      await this.deleteDriver({
        driverId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "DriverList") {
        await this.$router.push({ name: "DriverList" });
      }
    },
  },
};
</script>
