<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.filter')">
    <OurCard>
      <OurMultiselect
        v-model="form.textileIds"
        :options="textilesForSelect"
        :label="$t('label.textile')"
      />

      <OurMultiselect
        v-model="form.categoryIds"
        :options="categoriesForSelect"
        :label="$t('label.category')"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.find')" @click="onSubmitForm" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>

    <template #footer-right>
      <OurButton variant="thirdary" :text="$t('button.reset')" @click="onClickResetFilters" />
    </template>
  </OurModal>
</template>

<script>
import OurModal from "@/components/OurModal";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import OurMultiselect from "@/components/OurSelectMulti";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    OurMultiselect,
    OurCard,
    OurButton,
    OurModal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    activeFilter: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      form: {
        textileIds: [],
        categoryIds: [],
      },
    };
  },

  computed: {
    ...mapState("textile", ["textiles"]),

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    textilesForSelect() {
      return this.textiles.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },

    categoriesForSelect() {
      return [
        {
          id: 0,
          label: this.$t("label.specialPrice"),
        },
        {
          id: 1,
          label: this.$t("label.categoryNumber", { title: 1 }),
        },
        {
          id: 2,
          label: this.$t("label.categoryNumber", { title: 2 }),
        },
        {
          id: 3,
          label: this.$t("label.categoryNumber", { title: 3 }),
        },
        {
          id: 4,
          label: this.$t("label.categoryNumber", { title: 4 }),
        },
        {
          id: 5,
          label: this.$t("label.categoryNumber", { title: 5 }),
        },
      ];
    },
  },

  async created() {
    await this.getTextiles();
  },

  methods: {
    ...mapActions("textile", ["getTextiles"]),

    onClickCloseModal() {
      this.isShownModal = false;
    },

    onSubmitForm() {
      const data = {
        ...this.form,
      };

      this.$emit("update:activeFilter", data);

      this.isShownModal = false;
    },

    onClickResetFilters() {
      this.form = {
        textileIds: [],
        categoryIds: [],
      };

      this.$emit("update:activeFilter", this.form);
      this.isShownModal = false;
    },
  },
};
</script>
