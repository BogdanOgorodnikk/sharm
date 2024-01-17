<template>
  <OurPage width="md" :title="$t('title.productsAdd')" :back-route="backRouteParams">
    <ProductForm ref="textileForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTextileList" />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import ProductForm from "../_components/ProductForm";
import { mapActions } from "vuex";
import { createFormData } from "@/services/data.service";

export default {
  components: {
    ProductForm,
    OurButton,
    OurPage,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.products"),
        name: "Products",
      };
    },
  },

  methods: {
    ...mapActions("product", ["addProduct"]),

    onClickBackToTextileList() {
      this.$router.push({ name: "Products" });
    },

    async onSubmitForm() {
      this.$refs.textileForm.validate();

      if (this.form.isValid) {
        const data = {
          name: this.form.name,
          type: this.form.type,
          fill_id: this.form.filling,
          toggle_mechanism_id: this.form.toggleMechanism,
          frame_id: this.form.frame,
          size_width: this.form.sleepSize.width,
          size_length: this.form.sleepSize.length,
          general_size_width: this.form.generalSize.width,
          general_size_length: this.form.generalSize.length,
          general_size_height: this.form.generalSize.height,
          note: this.form.note,
          files: this.form.files,
        };

        const formData = createFormData(data);

        await this.addProduct(formData);

        await this.$router.push({ name: "Products" });
      }
    },
  },
};
</script>
