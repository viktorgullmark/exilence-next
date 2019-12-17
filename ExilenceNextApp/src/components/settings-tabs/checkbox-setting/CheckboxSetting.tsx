import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
  makeStyles,
  createStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  value: boolean;
  handleChange: (value: boolean) => void;
  translationKey: string;
}

const useStyles = makeStyles(theme =>
  createStyles({
    checkBox: {
      marginTop: theme.spacing(0.75)
    },
    checkBoxValue: {
      color: theme.palette.text.primary
    }
  })
);

const CheckboxSetting: React.FC<Props> = ({
  value,
  handleChange,
  translationKey
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{t(`label.${translationKey}`)}</FormLabel>
      <FormGroup className={classes.checkBox}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={value}
              onChange={() => handleChange(!value)}
              value="low-confidence"
            />
          }
          label={
            <Typography className={classes.checkBoxValue}>
              {t(`value.${translationKey}`)}
            </Typography>
          }
        />
      </FormGroup>
      <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxSetting;
