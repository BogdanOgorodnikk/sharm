import { getCars, getCar, addCar, updateCar, deleteCar } from "@/api/car";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    car: null,
    cars: [],
  },

  getters: {
    carsForSelect(state) {
      const cars = state.cars;

      return cars.map((item) => ({
        id: item.id,
        label: `${item.brand} ${item.model} ${item.license_plate}`,
      }));
    },
  },

  mutations: {
    SET_CAR(state, car = null) {
      state.car = car;
    },

    SET_CARS(state, cars) {
      if (Array.isArray(cars) && cars.length) {
        state.cars = [...cars];
      } else if (!Array.isArray(cars)) {
        state.cars.push(cars);
      }
    },

    UPDATE_CAR(state, car) {
      state.cars = updateArray(state.cars, [car]);
    },

    DELETE_CAR(state, carId) {
      state.cars = state.cars.filter((car) => car.id !== carId);
    },
  },

  actions: {
    async getCar(context, carId) {
      if (!carId) return;

      const response = await getCar(carId);

      context.commit("SET_CAR", response);
    },

    async getCars(context) {
      if (context.state.cars.length && context.state.cars.length !== 1) return;

      const response = await getCars();

      context.commit("SET_CARS", response);
    },

    async addCar(context, car) {
      const response = await addCar(car);

      context.commit("SET_CARS", response);
    },

    async updateCar(context, car) {
      const response = await updateCar(car);

      context.commit("UPDATE_CAR", response);
    },

    async deleteCar(context, { carId, delaySuccessNotify = false }) {
      await deleteCar(carId, delaySuccessNotify);

      context.commit("DELETE_CAR", carId);
    },
  },
};
