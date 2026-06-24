import { useState } from "react";
import { useFormState, useWatch } from "react-hook-form";
// JETEMS-START: 硬编码 title 改为 i18n（见 JETEMS_DEV.md 第 4 条）
import { useIntl } from "react-intl";
// JETEMS-END

import styles from "./FormDevToolsInternal.module.scss";

const FormDevToolsInternal = () => {
  const [isOpened, setIsOpened] = useState(false);
  // JETEMS-START
  const { formatMessage } = useIntl();
  // JETEMS-END
  return (
    <>
      <button
        type="button"
        className={styles.button}
        title={formatMessage({ id: "jetems.formDevTools.openDevTools" })}
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      />
      {isOpened && <DebugView />}
    </>
  );
};

function replacer(_key: unknown, value: unknown) {
  // Required to avoid circular references in errors which contain a reference to the input
  if (value instanceof Element) {
    return undefined;
  }
  return value;
}

const DebugView = () => {
  const values = useWatch();
  // need to destructure to subscribe to changes
  const { dirtyFields, errors, touchedFields, isValid, isDirty } = useFormState();

  return (
    <>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify({ dirtyFields, errors, touchedFields, isValid, isDirty }, replacer, 2)}</pre>
    </>
  );
};

export { FormDevToolsInternal as default };
