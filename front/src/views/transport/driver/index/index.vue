<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.driver')" width="md">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickAddDriver">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddDriver" />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="drivers"
        @clickEdit="onClickEditDriver"
        @clickDelete="onClickDeleteDriver"
      >
        <template #default="{ item }">
          <div class="list-item-left-title">
            {{ item.full_name }} {{ item.driver_license_number }}
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
    ...mapState("driver", ["drivers"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.transport"),
        name: "TransportList",
      };
    },
  },

  async created() {
    await this.getDrivers();
  },

  methods: {
    ...mapActions("driver", ["getDrivers"]),

    onClickAddDriver() {
      this.$router.push({ name: "DriverAdd" });
    },

    onClickEditDriver(id) {
      this.$router.push({ name: "DriverEdit", params: { id } });
    },

    onClickDeleteDriver(id, name, item) {
      this.selectedRow.id = id;
      this.selectedRow.fullName = item.full_name;
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
