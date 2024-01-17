<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.trailer')" width="md">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickAddTrailer">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddTrailer" />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="trailers"
        @clickEdit="onClickEditTrailer"
        @clickDelete="onClickDeleteTrailer"
      >
        <template #default="{ item }">
          <div class="list-item-left-title">
            {{ item.brand }} {{ item.model }} {{ item.license_plate }}
          </div>
        </template>
      </OurTableList>
    </OurCard>

    <DeleteModal v-model="isShownModal" :item="selectedRow" />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurCard from "@/components/OurCard";
import OurTableList from "@/components/OurTableList";

export default {
  components: {
    OurTableList,
    OurCard,
    OurSvgIcon,
    OurButton,
    OurPage,
    DeleteModal,
    draggable,
  },

  data() {
    return {
      isShownModal: false,
      selectedRow: {},
    };
  },

  computed: {
    ...mapState("trailer", ["trailers"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.transport"),
        name: "TransportList",
      };
    },
  },

  async created() {
    await this.getTrailers();
  },

  methods: {
    ...mapActions("trailer", ["getTrailers"]),

    onClickAddTrailer() {
      this.$router.push({ name: "TrailerAdd" });
    },

    onClickEditTrailer(id) {
      this.$router.push({ name: "TrailerEdit", params: { id } });
    },

    onClickDeleteTrailer(id, name, item) {
      this.selectedRow.id = id;
      this.selectedRow.licensePlate = item.license_plate;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.add-button-icon {
  &:deep(g [fill]) {
    @apply opacity-100;
  }
}
</style>
