<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.carDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteCar"
  >
    <div v-html="$t('page.transport.car.deleteModalText', { title: item.licensePlate })" />
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
    ...mapActions("car", ["deleteCar"]),

    async onConfirmDeleteCar() {
      await this.deleteCar({
        carId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "CarList") {
        await this.$router.push({ name: "CarList" });
      }
    },
  },
};
</script>
