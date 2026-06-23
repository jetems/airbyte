import type { IntlConfig } from "react-intl";

import isEqual from "lodash/isEqual";
import React, { useContext, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
// eslint-disable-next-line no-restricted-imports
import { useLocalStorage as useLocalStorageRaw } from "react-use";

import errorMessages from "locales/en.errors.json";
import messages from "locales/en.json";
// JETEMS-START: 中文 locale 资源（见 JETEMS_DEV.md 第 3 条 —— 不修改 en.json，通过本 Provider 注入）
import zhErrorMessages from "locales/zh.errors.json";
import zhMessages from "locales/zh.json";
// JETEMS-END

type Messages = IntlConfig["messages"];

/**
 * JETEMS: jetems 支持的「文案语言」集合。
 * 注意：这与 react-intl 用于数字/日期格式化的 locale 是两个概念 ——
 *   - IntlProvider.locale：决定数字/日期/复数的格式化（如 de-DE → 1.000.000,42），保留完整 locale 标识
 *   - JetemsLocale：决定从哪个 message bundle 取文案（目前只有 en/zh），非 en/zh 的 locale 文案回退到 en
 */
export type JetemsLocale = "en" | "zh";

interface I18nContext {
  setMessageOverwrite: (messages: Messages) => void;
  // JETEMS-START: 当前文案语言与切换器
  locale: JetemsLocale;
  setLocale: (locale: JetemsLocale) => void;
  // JETEMS-END
}

const i18nContext = React.createContext<I18nContext>({
  setMessageOverwrite: () => null,
  // JETEMS-START: 默认值兜底
  locale: "en",
  setLocale: () => null,
  // JETEMS-END
});

export const useI18nContext = () => {
  return useContext(i18nContext);
};

interface I18nProviderProps {
  /**
   * The locale to use for internationalization. If not provided, the stored user preference
   * (if any) is used, falling back to the browser locale.
   */
  locale?: string;
}

const getBrowserLocale = () => new Intl.DateTimeFormat().resolvedOptions().locale ?? "en";

// JETEMS-START: 把任意 locale 标识归一化为 jetems 支持的文案语言代码。
// zh-CN / zh-TW / zh-HK / zh_* → "zh"；其余（en/fr/de-DE/...）→ "en"（文案回退英文）
const toJetemsLocale = (locale: string | undefined): JetemsLocale => {
  const lower = (locale ?? "").toLowerCase();
  return lower.startsWith("zh") ? "zh" : "en";
};
// JETEMS-END

// JETEMS-START: 按 jetems 文案语言选择 message bundle。
// errorMessages 的每个 key 在合并时加上 "error:" 前缀（保持与原逻辑一致），用于 HttpProblem 的 error:xxx id。
const prefixErrors = (errors: Record<string, string>) =>
  Object.fromEntries(Object.entries(errors).map(([key, value]) => [`error:${key}`, value]));

const messagesByLocale: Record<JetemsLocale, Messages> = {
  en: { ...messages, ...prefixErrors(errorMessages as Record<string, string>) },
  zh: { ...zhMessages, ...prefixErrors(zhErrorMessages as Record<string, string>) },
};
// JETEMS-END

export const I18nProvider: React.FC<React.PropsWithChildren<I18nProviderProps>> = ({ children, locale }) => {
  const [overwrittenMessages, setOvewrittenMessages] = useState<Messages>({});

  // JETEMS-START: locale 解析 —— 完整 locale（用于 IntlProvider 格式化）与文案语言（用于选 bundle）分离。
  // 用 react-use 原生 useLocalStorage 且 initialValue 传 undefined，这样 localStorage 无值时不会写入，
  // 每次渲染都实时用 getBrowserLocale() 检测（让测试中对 Intl 的 mock 能生效）。
  // 仅当用户显式调用 setLocale 后才持久化到 localStorage。
  // 优先级：prop（测试/显式传入）> localStorage 用户偏好（仅当存在）> 浏览器实时检测。
  const [storedLocale, setStoredLocale] = useLocalStorageRaw<string>("airbyteLocale", undefined);
  const resolvedLocale = locale ?? storedLocale ?? getBrowserLocale();
  const jetemsLocale = toJetemsLocale(resolvedLocale);
  // JETEMS-END

  const i18nOverwriteContext = useMemo<I18nContext>(
    () => ({
      setMessageOverwrite: (messages) => {
        setOvewrittenMessages((prevMessages) => (isEqual(prevMessages, messages) ? prevMessages : messages));
      },
      // JETEMS-START: 暴露文案语言切换。setLocale 传入完整 locale（"zh"），由 react-use 持久化。
      locale: jetemsLocale,
      setLocale: (next) => setStoredLocale(next),
      // JETEMS-END
    }),
    [jetemsLocale, setStoredLocale]
  );

  const mergedMessages = useMemo(
    () => ({
      // JETEMS-START: 按 jetems 文案语言选 bundle（en 或 zh），再叠加 overwrite
      ...messagesByLocale[jetemsLocale],
      // JETEMS-END
      ...(overwrittenMessages ?? {}),
    }),
    [jetemsLocale, overwrittenMessages]
  );

  // Silence all warnings and errors during unit tests
  const logger = process.env.NODE_ENV === "test" ? () => {} : undefined;

  return (
    <i18nContext.Provider value={i18nOverwriteContext}>
      <IntlProvider
        // JETEMS: IntlProvider.locale 保留完整 locale 标识，用于数字/日期格式化（如 fr/de-DE/zh-CN）
        locale={resolvedLocale}
        messages={mergedMessages}
        defaultRichTextElements={{
          b: (chunk) => <strong>{chunk}</strong>,
        }}
        onWarn={logger}
        onError={logger}
      >
        {children}
      </IntlProvider>
    </i18nContext.Provider>
  );
};
