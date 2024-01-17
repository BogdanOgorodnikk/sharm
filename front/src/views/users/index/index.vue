<template>
  <OurPage :title="$t('title.users')" width="3xl">
    <OurTable :headers="tableHeaders" :items.sync="tableItems">
      <template #cell-role="{ value }">
        <OurSelect
          v-model="value.code"
          class="table-user-select"
          :options="roleCodeOptions"
          value-key="code"
          @change="onChangeUpdateUser(value)"
        />
      </template>

      <template #cell-price="{ value }">
        <OurSelect
          v-model="value.id"
          class="table-user-select"
          :options="pricesForSelect"
          @change="onChangeUpdateUser(value)"
          @removeValue="onChangeUpdateUser(value)"
        />
      </template>

      <template #cell-ban="{ value }">
        <OurCheckbox
          v-model="value.isBanned"
          class="table-user-checkbox"
          size="sm"
          @change="onChangeUpdateUser(value)"
        />
      </template>
    </OurTable>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import { mapActions, mapGetters, mapState } from "vuex";
import { ROLES_CODE } from "@/api/user";
import OurSelect from "@/components/OurSelect";
import OurCheckbox from "@/components/OurCheckbox";

export default {
  components: {
    OurCheckbox,
    OurSelect,
    OurTable,
    OurPage,
  },

  data() {
    return {
      tableHeaders: [
        {
          value: "companyName",
          text: this.$t("label.companyName"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "email",
          text: this.$t("label.email"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "phone",
          text: this.$t("label.phone"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "role",
          text: this.$t("label.role"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "price",
          text: this.$t("label.price"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "ban",
          text: this.$t("label.ban"),
          tdClass: "",
          thClass: "",
        },
      ],
      tableItems: [],
    };
  },

  computed: {
    ...mapState("user", ["users"]),
    ...mapGetters("prices", ["pricesForSelect"]),

    roleCodeOptions() {
      return [
        {
          code: ROLES_CODE.admin,
          label: this.$t("label.admin"),
        },
        {
          code: ROLES_CODE.client,
          label: this.$t("label.client"),
        },
      ];
    },
  },

  watch: {
    users: {
      handler: "onChangeUsers",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await Promise.all([this.getUsers(), this.getPrices()]);
  },

  methods: {
    ...mapActions("user", ["getUsers", "updateUser"]),
    ...mapActions("prices", ["getPrices"]),

    async onChangeUpdateUser(item) {
      const data = {
        id: item.userId,
        roleCode: item.code,
        isBanned: item.isBanned,
        priceId: item.id,
      };

      await this.updateUser(data);
    },

    onChangeUsers() {
      this.tableItems = this.users.map((item) => {
        const roles = {
          [ROLES_CODE.admin]: this.$t("label.admin"),
          [ROLES_CODE.client]: this.$t("label.client"),
        };

        return {
          companyName: item.name,
          email: item.email,
          phone: item.phone,
          role: {
            userId: item.id,
            label: roles[item.roleCode],
            code: item.roleCode,
          },
          price: {
            userId: item.id,
            id: item.priceId,
            label: item.priceName,
          },
          ban: {
            userId: item.id,
            isBanned: item.isBanned,
          },
        };
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.table-user {
  &-checkbox {
    @apply mx-auto;
  }

  &-select {
    @apply -mt-2.5 w-32;

    &::v-deep {
      .multiselect-wrapper {
        @apply static;

        .multiselect {
          @apply items-center;
          @apply pt-0;

          .multiselect-caret {
            @apply mt-0;
          }

          .multiselect__tags {
            @apply mb-0 pt-2;
          }

          .multiselect__content-wrapper {
            @apply !top-auto !bottom-[1rem] mt-0 mb-0;
          }
        }
      }
    }
  }
}
</style>
