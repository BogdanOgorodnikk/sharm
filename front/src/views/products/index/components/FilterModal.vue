<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.filter')">
    <OurCard>
      <OurMultiselect
        v-model="form.productIds"
        :options="productsForSelect"
        :label="$t('label.product')"
        :placeholder="$t('placeholder.productName')"
      />

      <OurMultiselect
        v-model="form.productType"
        :options="productTypeForSelect"
        :label="$t('label.productType')"
        :placeholder="$t('placeholder.productType')"
        value-key="code"
      />

      <OurInput
        v-model="form.priceFrom"
        :label="$t('label.priceFrom')"
        placeholder="0"
        validation-rule="number"
      />

      <OurInput
        v-model="form.priceTo"
        :label="$t('label.priceTo')"
        placeholder="10000"
        validation-rule="number"
      />

      <OurMultiselect
        v-model="form.categoryIds"
        :options="categoriesForSelect"
        :label="$t('label.category')"
      />

      <OurMultiselect
        v-model="form.fillingIds"
        :options="fillingsForSelect"
        :label="$t('label.productFilling')"
        :placeholder="$t('placeholder.filling')"
      />

      <OurMultiselect
        v-model="form.toggleMechanismIds"
        :options="toggleMechanismsForSelect"
        :label="$t('label.toggleMechanism')"
        :placeholder="$t('placeholder.toggleMechanism')"
      />

      <OurMultiselect
        v-model="form.frameIds"
        :options="framesForSelect"
        :label="$t('label.frame')"
        :placeholder="$t('placeholder.frame')"
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
import OurInput from "@/components/form/OurInput";
import OurMultiselect from "@/components/OurSelectMulti";
import { mapActions, mapGetters } from "vuex";
import { PRODUCT_TYPE } from "@/api/product";

export default {
  components: {
    OurMultiselect,
    OurInput,
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
        productIds: [],
        productType: [],
        priceFrom: "",
        priceTo: "",
        categoryIds: [],
        fillingIds: [],
        toggleMechanismIds: [],
        frameIds: [],
      },
      productTypeForSelect: [
        {
          code: PRODUCT_TYPE.sofa,
          label: this.$t("label.sofa"),
        },
        {
          code: PRODUCT_TYPE.cornerSofa,
          label: this.$t("label.cornerSofa"),
        },
        {
          code: PRODUCT_TYPE.bed,
          label: this.$t("label.bed"),
        },
        {
          code: PRODUCT_TYPE.modularSystem,
          label: this.$t("label.modularSystem"),
        },
      ],
    };
  },

  computed: {
    ...mapGetters("product", ["productsForSelect"]),
    ...mapGetters("filling", ["fillingsForSelect"]),
    ...mapGetters("toggleMechanism", ["toggleMechanismsForSelect"]),
    ...mapGetters("frame", ["framesForSelect"]),

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
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

  watch: {
    isShownModal: "onChangeShownModal",
  },

  async created() {
    await Promise.all([
      this.getProducts(),
      this.getFillings(),
      this.getToggleMechanisms(),
      this.getFrames(),
    ]);
  },

  methods: {
    ...mapActions("product", ["getProducts"]),
    ...mapActions("filling", ["getFillings"]),
    ...mapActions("toggleMechanism", ["getToggleMechanisms"]),
    ...mapActions("frame", ["getFrames"]),

    onChangeShownModal() {
      if (this.isShownModal) {
        this.form.productType = this.activeFilter.productType;
      }
    },

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
        productIds: [],
        productType: [],
        priceFrom: "",
        priceTo: "",
        categoryIds: [],
        fillingIds: [],
        toggleMechanismIds: [],
        frameIds: [],
      };

      this.$emit("update:activeFilter", this.form);
      this.isShownModal = false;
    },
  },
};
</script>
