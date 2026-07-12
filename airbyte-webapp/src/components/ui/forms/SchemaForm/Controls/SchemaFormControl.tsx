import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import { Badge } from "components/ui/Badge";
import { OptionSection } from "components/ui/ComboBox";
import { FlexContainer } from "components/ui/Flex";
import { LabelInfo } from "components/ui/Label";
import { TextWithHTML } from "components/ui/TextWithHTML";
import { Tooltip } from "components/ui/Tooltip";

import {
  localizeCdkSchemaDescription,
  localizeCdkSchemaTitle,
} from "area/connectorBuilder/components/Builder/localizeCdkSchema";

import { ArrayOfObjectsControl } from "./ArrayOfObjectsControl";
import { MultiOptionControl } from "./MultiOptionControl";
import { ObjectControl } from "./ObjectControl";
import styles from "./SchemaFormControl.module.scss";
import { OverrideByPath, BaseControlProps } from "./types";
import { FormControl } from "../../FormControl";
import { LinkComponentsToggle } from "../LinkComponentsToggle";
import { useSchemaForm } from "../SchemaForm";
import { AirbyteJsonSchema, displayName, resolveTopLevelRef } from "../utils";

interface SchemaFormControlProps {
  /**
   * Path to the property in the schema. Empty string or undefined for root level properties.
   */
  path?: string;

  /**
   * Map of property paths to custom renderers, allowing override of specific fields.
   */
  overrideByPath?: OverrideByPath;

  /**
   * If true, the component will not register the path as rendered.
   * Used internally by SchemaFormRemainingFields to prevent duplicate registration.
   */
  skipRenderedPathRegistration?: boolean;

  /**
   * The schema for the field currently being rendered.
   * If not provided, the schema will be resolved from the root schema and the path.
   */
  fieldSchema?: AirbyteJsonSchema;

  /**
   * If provided, these fields will be rendered normally, and everything else will
   * be rendered inside a collapsible Advanced section.
   *
   * If not provided, all fields will be rendered normally.
   */
  nonAdvancedFields?: string[];

  titleOverride?: string | null;
  isRequired?: boolean;
  className?: string;
  placeholder?: string;
  suggestionsOverride?: string[];
  tooltipDocsLink?: string;
}

/**
 * Component that renders form controls based on JSON schema.
 * It can render a single field or recursively render nested objects.
 */
export const SchemaFormControl = ({
  path = "",
  overrideByPath = {},
  skipRenderedPathRegistration = false,
  fieldSchema,
  titleOverride,
  isRequired,
  className,
  nonAdvancedFields,
  placeholder,
  suggestionsOverride,
  tooltipDocsLink,
}: SchemaFormControlProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    schema: rootSchema,
    getSchemaAtPath,
    registerRenderedPath,
    onlyShowErrorIfTouched,
    verifyArrayItems,
    isRequired: isPathRequired,
    disableFormControlsUnderPath,
    overrideByFieldSchema,
  } = useSchemaForm();

  // Register this path synchronously during render
  if (!skipRenderedPathRegistration && path) {
    registerRenderedPath(path);
  }

  // Get the property at the specified path
  const targetSchema = resolveTopLevelRef(rootSchema, fieldSchema ?? getSchemaAtPath(path));
  const isOptional = useMemo(() => {
    if (isRequired !== undefined) {
      return !isRequired;
    }

    if (!path) {
      return false;
    }

    return !isPathRequired(path);
  }, [isPathRequired, isRequired, path]);

  const value = useWatch({ name: path });

  // ~ declarative_component_schema type $parameters handling ~
  if (path.includes("$parameters")) {
    return null;
  }

  // Check if there's an override for this path
  const matchingPathOverride = getMatchingOverrideForPath(overrideByPath, path);
  if (matchingPathOverride !== undefined) {
    return matchingPathOverride(path);
  }

  if (targetSchema.deprecated && value === undefined) {
    return null;
  }

  const multiOptionSchemas = targetSchema.oneOf || targetSchema.anyOf;
  // JETEMS: CDK schema 选项标题/说明中文化（全局配置 Check / Concurrency / API Budget 等）
  const options = multiOptionSchemas
    ? multiOptionSchemas
        .map((optionSchema) => resolveTopLevelRef(rootSchema, optionSchema as AirbyteJsonSchema))
        .filter((optionSchema) => !!optionSchema.title)
        .map((optionSchema) => ({
          title: localizeCdkSchemaTitle(intl, optionSchema.title as string) ?? (optionSchema.title as string),
          description: localizeCdkSchemaDescription(intl, optionSchema.description) ?? optionSchema.description,
        }))
    : undefined;

  const rawLabel = titleOverride
    ? titleOverride
    : titleOverride === null
    ? undefined
    : displayName(path, targetSchema.title);
  const label = localizeCdkSchemaTitle(intl, rawLabel) ?? rawLabel;
  const localizedDescription = localizeCdkSchemaDescription(intl, targetSchema.description);

  const baseProps: BaseControlProps = {
    name: path,
    label,
    labelTooltip:
      localizedDescription || targetSchema.examples ? (
        <LabelInfo
          label={label}
          // JETEMS: schema 描述可能含 HTML 链接（含 formatMessage 解出后的 <a href>）。
          // ReactMarkdown 默认不渲染 raw HTML；有 HTML 时走 TextWithHTML，否则走 Markdown。
          description={<SchemaDescription text={localizedDescription} />}
          examples={targetSchema.examples}
          options={options}
          docsLink={tooltipDocsLink}
        />
      ) : undefined,
    optional: isOptional,
    header: (
      <FlexContainer alignItems="center">
        {targetSchema.deprecated && <DeprecatedBadge message={targetSchema.deprecation_message} />}
        <LinkComponentsToggle path={path} fieldSchema={targetSchema} />
      </FlexContainer>
    ),
    containerControlClassName: className,
    onlyShowErrorIfTouched,
    placeholder,
    "data-field-path": path,
    disabled: !!disableFormControlsUnderPath && path.startsWith(disableFormControlsUnderPath),
    interpolationContext: targetSchema.interpolation_context,
  };

  const matchingSchemaOverride = overrideByFieldSchema?.find((override) => override.shouldOverride(targetSchema));
  if (matchingSchemaOverride) {
    return matchingSchemaOverride.renderOverride(baseProps);
  }

  if (multiOptionSchemas) {
    return (
      <MultiOptionControl
        fieldSchema={targetSchema}
        baseProps={baseProps}
        overrideByPath={overrideByPath}
        skipRenderedPathRegistration={skipRenderedPathRegistration}
        nonAdvancedFields={nonAdvancedFields}
      />
    );
  }

  if (targetSchema.type === "object" || targetSchema.properties) {
    return (
      <ObjectControl
        fieldSchema={targetSchema}
        baseProps={baseProps}
        overrideByPath={overrideByPath}
        skipRenderedPathRegistration={skipRenderedPathRegistration}
        nonAdvancedFields={nonAdvancedFields}
      />
    );
  }

  if (targetSchema.type === "boolean") {
    return <FormControl {...baseProps} fieldType="switch" />;
  }

  if (targetSchema.enum && (targetSchema.type === undefined || targetSchema.type === "string")) {
    const options = Array.isArray(targetSchema.enum)
      ? targetSchema.enum.map((option: string) => ({
          label: option,
          value: option,
        }))
      : [];

    return <FormControl {...baseProps} fieldType="dropdown" options={options} />;
  }

  if (targetSchema.type === "string") {
    if (targetSchema.multiline) {
      return <FormControl {...baseProps} fieldType="textarea" />;
    }
    const suggestions = suggestionsOverride ?? targetSchema.suggestions;
    if (suggestions) {
      return (
        <FormControl
          {...baseProps}
          fieldType="combobox"
          allowCustomValue
          options={convertToOptions(suggestions, formatMessage)}
        />
      );
    }
    return <FormControl {...baseProps} fieldType="input" />;
  }

  if (targetSchema.type === "number" || targetSchema.type === "integer") {
    return <FormControl {...baseProps} fieldType="input" type="number" />;
  }

  if (targetSchema.type === "array") {
    const items = verifyArrayItems(targetSchema.items);
    const suggestions = suggestionsOverride ?? targetSchema.suggestions;
    if (items.type === "string" && suggestions) {
      return (
        <FormControl {...baseProps} fieldType="multiCombobox" options={convertToOptions(suggestions, formatMessage)} />
      );
    }
    if (items.type === "string" || items.type === "integer" || items.type === "number") {
      return <FormControl {...baseProps} fieldType="array" itemType={items.type} />;
    }
    return (
      <ArrayOfObjectsControl
        fieldSchema={targetSchema}
        baseProps={baseProps}
        overrideByPath={overrideByPath}
        skipRenderedPathRegistration={skipRenderedPathRegistration}
      />
    );
  }

  return null;
};

const DeprecatedBadge = ({ message }: { message?: string }) => {
  return message ? (
    <Tooltip control={<Badge variant="grey">Deprecated</Badge>} placement="top">
      <SchemaDescription text={message} />
    </Tooltip>
  ) : (
    <Badge variant="grey">
      <FormattedMessage id="form.deprecated" />
    </Badge>
  );
};

/** JETEMS: render CDK/schema description — HTML anchors via TextWithHTML, else Markdown. */
const SchemaDescription = ({ text }: { text?: string }) => {
  if (!text) {
    return null;
  }
  // Raw HTML (e.g. <a href="...">) is not rendered by ReactMarkdown without rehype-raw.
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return <TextWithHTML className={styles.markdown} text={text} />;
  }
  return <ReactMarkdown className={styles.markdown}>{text}</ReactMarkdown>;
};

export const getMatchingOverrideForPath = (overrideByPath: OverrideByPath, path: string) => {
  const matchingOverridePath = Object.keys(overrideByPath).find((overridePath) => {
    // if overridePath contains a * then it is a wildcard that should match any character besides .
    if (overridePath.includes("*")) {
      const regex = new RegExp(`^${overridePath.replace("*", "[^.]+")}$`);
      return regex.test(path);
    }

    return overridePath === path;
  });

  return matchingOverridePath ? overrideByPath[matchingOverridePath] : undefined;
};

const convertToOptions = (suggestions: string[], formatMessage: IntlShape["formatMessage"]): OptionSection[] => {
  return [
    {
      sectionTitle: formatMessage({ id: "form.suggestions" }),
      innerOptions: suggestions.map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      })),
    },
  ];
};
