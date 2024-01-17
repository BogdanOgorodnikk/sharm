import { theme } from "@/configs/ourApp.config";

export function getThemeName() {
  return theme || "";
}

export function getTheme() {
  return theme ? `${theme}-theme` : "";
}

export default {
  getThemeName,
  getTheme,
};
