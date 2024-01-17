import ApiService from "@/services/api.service";

export const REGIONS_CODE = [
  {
    label: "АВТОНОМНА РЕСПУБЛІКА КРИМ",
  },
  {
    label: "ВІННИЦЬКА",
  },
  {
    label: "ВОЛИНСЬКА",
  },
  {
    label: "ДНІПРОПЕТРОВСЬКА",
  },
  {
    label: "ДОНЕЦЬКА",
  },
  {
    label: "ЖИТОМИРСЬКА",
  },
  {
    label: "ЗАКАРПАТСЬКА",
  },
  {
    label: "ЗАПОРІЗЬКА",
  },
  {
    label: "ІВАНО-ФРАНКІВСЬКА",
  },
  {
    label: "КИЇВСЬКА",
  },
  {
    label: "КІРОВОГРАДСЬКА",
  },
  {
    label: "ЛУГАНСЬКА",
  },
  {
    label: "ЛЬВІВСЬКА",
  },
  {
    label: "МИКОЛАЇВСЬКА",
  },
  {
    label: "ОДЕСЬКА",
  },
  {
    label: "ПОЛТАВСЬКА",
  },
  {
    label: "РІВНЕНСЬКА",
  },
  {
    label: "СУМСЬКА",
  },
  {
    label: "ТЕРНОПІЛЬСЬКА",
  },
  {
    label: "ХАРКІВСЬКА",
  },
  {
    label: "ХЕРСОНСЬКА",
  },
  {
    label: "ХМЕЛЬНИЦЬКА",
  },
  {
    label: "ЧЕРКАСЬКА",
  },
  {
    label: "ЧЕРНІВЕЦЬКА",
  },
  {
    label: "ЧЕРНІГІВСЬКА",
  },
  {
    label: "М.СЕВАСТОПОЛЬ",
  },
];

export async function getTowns(region) {
  const response = await ApiService.get(`/region-towns/?region=${region}`);

  return response.data;
}

export default {
  REGIONS_CODE,
  getTowns,
};
