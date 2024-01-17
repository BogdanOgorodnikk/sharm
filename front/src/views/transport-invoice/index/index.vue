<template>
  <OurPage :title="$t('title.transportInvoiceList')">
    <OurTable :headers="tableHeaders" :items="tableItems">
      <template #cell-actions="{ value }">
        <div class="flex space-x-4">
          <div @click="onClickPrintTransportInvoice(value.id)">
            <OurSvgIcon interactive name="Printer" color="gray" />
          </div>

          <div
            @click="
              $router.push({
                name: 'TransportInvoiceEdit',
                params: { id: value.id, orderId: value.orderId },
              })
            "
          >
            <OurSvgIcon interactive name="Edit" color="gray" />
          </div>

          <div @click="onClickOpenDeleteModal(value)">
            <OurSvgIcon interactive name="Trash" color="red" />
          </div>
        </div>
      </template>
    </OurTable>

    <DeleteModal
      v-model="isShownModal"
      :item="selectedItem"
      delay-success-notify
      @deletedTransportInvoice="onDeletedTransportInvoice"
    />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import OurSvgIcon from "@/components/OurSvgIcon";
import DeleteModal from "../delete/Modal";

import { getTransportInvoices } from "@/api/transportInvoice";

export default {
  components: {
    OurSvgIcon,
    OurTable,
    OurPage,
    DeleteModal,
  },

  data() {
    return {
      isShownModal: false,
      selectedItem: {},
      transportInvoices: [],
      tableHeaders: [
        {
          value: "orderId",
          text: "№",
          tdClass: "",
          thClass: "",
        },
        {
          value: "customer",
          text: this.$t("label.customer"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "date",
          text: this.$t("label.date"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "actions",
          text: "",
          tdClass: "w-20",
          thClass: "w-20",
        },
      ],
    };
  },

  computed: {
    tableItems() {
      return this.transportInvoices.map((item) => {
        return {
          id: item.id,
          orderId: item.order_id,
          customer: item.customer,
          date: item.data_create,
          actions: {
            id: item.id,
            orderId: item.order_id,
          },
        };
      });
    },
  },

  async created() {
    this.transportInvoices = await getTransportInvoices();
  },

  methods: {
    onClickPrintTransportInvoice(transportInvoiceId) {
      let win = window.open(
        location.origin + `/prints/transport-invoice/${transportInvoiceId}`,
        "printSchedule",
        "width=842,height=595"
      );

      if (win) {
        win.addEventListener("message", ($event) => {
          if (win && ($event.data === "printed" || $event.data === "close")) {
            win.close();
            win = null;
          }
        });
      }
    },

    onDeletedTransportInvoice() {
      this.transportInvoices = this.transportInvoices.filter(
        (item) => item.id !== this.selectedItem.id
      );
    },

    onClickOpenDeleteModal(item) {
      this.selectedItem = {
        id: item.id,
        orderId: item.orderId,
      };

      this.isShownModal = true;
    },
  },
};
</script>
