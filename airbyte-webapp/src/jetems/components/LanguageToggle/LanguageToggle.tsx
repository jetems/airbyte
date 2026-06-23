// JETEMS: 中英语言切换器（对称复刻 ThemeToggle，见 JETEMS_DEV.md 第 3.2 / 5.1 条）
//
// 设计约定：切换器显示「当前语言」的母语名称（中文环境下显示「中文」，英文环境下显示 "English"），
// 用 globe 图标。点击在 zh/en 间切换，与 ThemeToggle（点击切换深/浅色）行为完全对称。
// 语言偏好通过 useLocalStorage("airbyteLocale") 持久化，刷新后保留。

import { NavItem } from "area/layout/SideBar/components/NavItem";
import { JetemsLocale, useI18nContext } from "core/services/i18n";

/** 每种语言的母语显示名。语言切换器按惯例用「目标语言母语名」标注选项。 */
const NATIVE_LABELS: Record<JetemsLocale, string> = {
  en: "English",
  zh: "中文",
};

const NEXT_LOCALE: Record<JetemsLocale, JetemsLocale> = {
  en: "zh",
  zh: "en",
};

export const LanguageToggle: React.FC = () => {
  const { locale, setLocale } = useI18nContext();

  return (
    <NavItem as="button" label={NATIVE_LABELS[locale]} icon="globe" onClick={() => setLocale(NEXT_LOCALE[locale])} />
  );
};
