import React from 'react';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';

const MinuteFormat = (props: any) => {
  const { inputRef, onChange, ...other } = props;
  const { t } = useTranslation();

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      isNumericString
      thousandSeparator
      suffix={` ${t('minutes')}`}
      isAllowed={values => {
        const { floatValue } = values;
        return floatValue >= 2 && floatValue <= 1000;
      }}
    />
  );
};

export default MinuteFormat;
