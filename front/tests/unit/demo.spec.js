import "@unit/init";
import { shallowMount } from "@vue/test-utils";
import InvoicesIndexTable from "../Index";

describe("Invoices table", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InvoicesIndexTable);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("methods", () => {
    describe("#dateFormatter", () => {
      it("should works correct in nominal flow", () => {
        const sampleDate = "2020-10-24T07:50:01.656Z";
        const mockFormattedDate = "F_DATE";
        const formattedDate = wrapper.vm.dateFormatter(sampleDate);

        expect(formattedDate).toBe(mockFormattedDate);
      });
    });

    describe("#approvedAtFormatter", () => {
      beforeEach(() => {
        wrapper.vm.dateFormatter = jest.fn();
      });

      it("should works correct in nominal flow", () => {
        const sampleTableRow = { approvedAt: "2020-10-23T11:48:14.594Z" };

        wrapper.vm.approvedAtFormatter(sampleTableRow);

        expect(wrapper.vm.dateFormatter).toHaveBeenCalledWith(sampleTableRow.approvedAt);
      });

      it("should return null", () => {
        const sampleTableRow = { approvedAt: "" };
        const result = wrapper.vm.approvedAtFormatter(sampleTableRow);

        expect(result).toBe(null);
      });
    });

    describe("#onClickView", () => {
      it("should works correct in nominal flow", () => {
        const sampleCustomerId = 1;

        wrapper.vm.$router = { push: jest.fn() };
        wrapper.vm.onClickView(sampleCustomerId);

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
          name: "customers.invoices",
          params: { id: sampleCustomerId },
        });
      });
    });

    describe("#onClickDownload", () => {
      it("should works correct in nominal flow", () => {
        const sampleUrl =
          "https://app.gaele.be/api/public/invoices/download/XODO9HnQUocXz098JONKzQ";

        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {};

        wrapper.vm.onClickDownload(sampleUrl);

        expect(window.location.href).toEqual(sampleUrl);
      });
    });

    describe("#onClickDelete", () => {
      it("should works correct in nominal flow", async () => {
        const sampleTableRow = { id: 1, customerId: 2 };

        wrapper.vm.deleteInvoice = jest.fn().mockImplementation(() => Promise.resolve());
        wrapper.vm.$formSuccessMsg = jest.fn();
        wrapper.vm.$refs.table.fetchTableData = jest
          .fn()
          .mockImplementation(() => Promise.resolve());

        await wrapper.vm.onClickDelete(sampleTableRow);

        expect(wrapper.vm.deleteInvoice).toHaveBeenCalled();
        expect(wrapper.vm.$formSuccessMsg).toHaveBeenCalled();
        expect(wrapper.vm.$refs.table.fetchTableData).toHaveBeenCalled();
      });

      it("should catch error on failed request", async () => {
        const sampleTableRow = { id: 1, customerId: 2 };

        wrapper.vm.$handleRequestError = jest.fn();
        wrapper.vm.deleteInvoice = jest.fn().mockImplementation(() => {
          throw new Error();
        });

        await wrapper.vm.onClickDelete(sampleTableRow);
        expect(wrapper.vm.$handleRequestError).toHaveBeenCalled();
      });
    });

    describe("#onClickApprove", () => {
      it("should works correct in nominal flow", async () => {
        const sampleInvoiceId = 1;

        wrapper.vm.approveInvoice = jest.fn().mockImplementation(() => Promise.resolve());
        wrapper.vm.$formSuccessMsg = jest.fn();
        wrapper.vm.$refs.table.fetchTableData = jest
          .fn()
          .mockImplementation(() => Promise.resolve());

        await wrapper.vm.onClickApprove(sampleInvoiceId);

        expect(wrapper.vm.approveInvoice).toHaveBeenCalled();
        expect(wrapper.vm.$formSuccessMsg).toHaveBeenCalled();
        expect(wrapper.vm.$refs.table.fetchTableData).toHaveBeenCalled();
      });

      it("should catch error on failed request", async () => {
        const sampleInvoiceId = 1;

        wrapper.vm.$handleRequestError = jest.fn();
        wrapper.vm.approveInvoice = jest.fn().mockImplementation(() => {
          throw new Error();
        });

        await wrapper.vm.onClickApprove(sampleInvoiceId);
        expect(wrapper.vm.$handleRequestError).toHaveBeenCalled();
      });
    });
  });
});
