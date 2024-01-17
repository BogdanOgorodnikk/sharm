<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.productsDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteProduct"
  >
    <div v-html="$t('page.products.deleteModalText', { title: item.name })" />
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
    ...mapActions("product", ["deleteProduct"]),

    async onConfirmDeleteProduct() {
      await this.deleteProduct({
        productId: this.item.id,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "Products") {
        await this.$router.push({ name: "Products" });
      }
    },
  },
};
</script>
