import { getDrivers, getDriver, addDriver, updateDriver, deleteDriver } from "@/api/driver";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    driver: null,
    drivers: [],
  },

  getters: {
    driversForSelect(state) {
      const drivers = state.drivers;

      return drivers.map((item) => ({
        id: item.id,
        label: item.full_name,
      }));
    },
  },

  mutations: {
    SET_DRIVER(state, driver = null) {
      state.driver = driver;
    },

    SET_DRIVERS(state, drivers) {
      if (Array.isArray(drivers) && drivers.length) {
        state.drivers = [...drivers];
      } else if (!Array.isArray(drivers)) {
        state.drivers.push(drivers);
      }
    },

    UPDATE_DRIVER(state, driver) {
      state.drivers = updateArray(state.drivers, [driver]);
    },

    DELETE_DRIVER(state, driverId) {
      state.drivers = state.drivers.filter((driver) => driver.id !== driverId);
    },
  },

  actions: {
    async getDriver(context, driverId) {
      if (!driverId) return;

      const response = await getDriver(driverId);

      context.commit("SET_DRIVER", response);
    },

    async getDrivers(context) {
      if (context.state.drivers.length && context.state.drivers.length !== 1) return;

      const response = await getDrivers();

      context.commit("SET_DRIVERS", response);
    },

    async addDriver(context, driver) {
      const response = await addDriver(driver);

      context.commit("SET_DRIVERS", response);
    },

    async updateDriver(context, driver) {
      const response = await updateDriver(driver);

      context.commit("UPDATE_DRIVER", response);
    },

    async deleteDriver(context, { driverId, delaySuccessNotify = false }) {
      await deleteDriver(driverId, delaySuccessNotify);

      context.commit("DELETE_DRIVER", driverId);
    },
  },
};
