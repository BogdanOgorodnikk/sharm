<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.textileDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteTextile"
  >
    <div v-html="$t('page.accessories.textile.deleteModalText', { title: item.name })" />
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
    ...mapActions("textile", ["deleteTextile"]),

    async onConfirmDeleteTextile() {
      await this.deleteTextile(this.$route.params.id);

      await this.$router.push({ name: "TextileList" });
    },
  },
};
</script>
