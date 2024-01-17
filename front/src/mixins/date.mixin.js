import { format } from "date-fns";

export default {
  methods: {
    $dateConverter(timestamp, type = "date") {
      const date = new Date(timestamp * 1000);
      let options = "";

      if (type.includes("date")) {
        options = "dd.MM.yyyy";
      }

      if (type.includes("time")) {
        options = "HH:mm:ss";
      }

      if (type.includes("datetime")) {
        options = "HH:mm dd.MM.yyyy";
      }

      return format(date, options);
    },
  },
};
