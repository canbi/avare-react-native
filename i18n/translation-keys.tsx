import { useTranslation } from "react-i18next";

export enum TranslationKeys {
  HOME_TAB_TITLE = "home_tab_title",
  HOME_TITLE = "home_title",
  EXPLORE_TITLE = "explore_title",
  BOTTOM_NAV_HOME = "bottom_nav_home",
  BOTTOM_NAV_EXPLORE = "bottom_nav_explore",
  NOT_FOUND_TITLE = "not_found_title",
  NOT_FOUND_DESCRIPTION = "not_found_description",
  NOT_FOUND_GO_HOME = "not_found_go_home",
}

export const getTranslation = (key: TranslationKeys) => {
  const { t } = useTranslation();
  return t(key);
};
