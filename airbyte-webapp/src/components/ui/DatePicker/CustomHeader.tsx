import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import React from "react";
import { ReactDatePickerCustomHeaderProps, ReactDatePickerProps } from "react-datepicker";
// JETEMS-START: 硬编码 aria-label 改为 i18n（见 JETEMS_DEV.md 第 4 条）
import { useIntl } from "react-intl";
// JETEMS-END

import styles from "./CustomHeader.module.scss";
import { Button } from "../Button";
import { FlexContainer } from "../Flex";
import { Text } from "../Text";

/**
 * Custom header for the date/range picker
 */
export const CustomHeader: React.FC<
  ReactDatePickerCustomHeaderProps &
    Pick<ReactDatePickerProps, "showMonthDropdown" | "showYearDropdown"> & { selectsRange?: boolean }
> = ({
  date,
  monthDate,
  customHeaderCount,
  decreaseMonth,
  increaseMonth,
  changeYear,
  changeMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  selectsRange,
  showMonthDropdown,
  showYearDropdown,
}) => {
  const years = range(1990, getYear(new Date()) + 1, 1);
  // JETEMS-START
  const { formatMessage } = useIntl();
  // JETEMS-END
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <FlexContainer justifyContent="space-between" alignItems="center" className={styles.currentMonthYearContainer}>
        <Button
          aria-label={formatMessage({ id: "jetems.datePicker.previousMonth" })}
          icon="arrowLeft"
          iconSize="lg"
          variant="clear"
          style={(selectsRange && customHeaderCount === 1) || prevMonthButtonDisabled ? { visibility: "hidden" } : {}}
          type="button"
          onClick={decreaseMonth}
          className={styles.navArrowBtn}
        />
        <Text size="lg" bold>
          {monthDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Button
          aria-label={formatMessage({ id: "jetems.datePicker.nextMonth" })}
          icon="arrowRight"
          iconSize="lg"
          variant="clear"
          style={(selectsRange && customHeaderCount === 0) || nextMonthButtonDisabled ? { visibility: "hidden" } : {}}
          type="button"
          onClick={increaseMonth}
          className={styles.navArrowBtn}
        />
      </FlexContainer>
      {(showMonthDropdown || showYearDropdown) && (
        <FlexContainer alignItems="center" justifyContent="center">
          {showMonthDropdown && (
            <select
              className={styles.dropdown}
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {showYearDropdown && (
            <select
              className={styles.dropdown}
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(Number(value))}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </FlexContainer>
      )}
    </>
  );
};
