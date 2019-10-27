import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Character } from '../../../store/domains/character';

interface CharacterSelectionStepProps {
  activeStep: number;
  handleBack: Function;
  handleReset: Function;
  handleCharacterSubmit: Function;
  selectedCharacter?: string;
  characters: Character[];
  styles: Record<string, string>;
}

const CharacterSelectionStep: React.FC<CharacterSelectionStepProps> = (props: CharacterSelectionStepProps) => {
  const { t } = useTranslation();

  return (
    <Formik
    initialValues={{ character: props.selectedCharacter }}
    onSubmit={(values
    ) => {
      props.handleCharacterSubmit(values.character);
    }}
    validationSchema={Yup.object().shape({
      character: Yup.string().required('Required')
    })}
  >
    {formProps => {
      const {
        values,
        touched,
        errors,
        dirty,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset
      } = formProps;
      return (
        <form onSubmit={handleSubmit}>
          <div className={props.styles.stepMainContent}>
            <FormControl
              fullWidth
              margin="normal"
              error={touched.character && errors.character != undefined}
            >
              <InputLabel htmlFor="char-dd">
                {t('label.select_character')}
              </InputLabel>
              <Select
                value={values.character}
                onChange={handleChange}
                inputProps={{
                  name: 'char',
                  id: 'char-dd'
                }}
              >
                {props.characters!.map(
                  (char: Character) => {
                    return (
                      <MenuItem key={char.uuid} value={char.uuid}>
                        {char.name}
                      </MenuItem>
                    );
                  }
                )}
              </Select>
              {touched.character && errors.character && (
                <FormHelperText error>
                  {errors.character && touched.character && errors.character}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className={props.styles.stepFooter}>
            <Button
              disabled={props.activeStep === 0 || isSubmitting}
              onClick={() => props.handleBack()}
            >
              {t('action.back')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {t('action.next')}
            </Button>
          </div>
        </form>
      );
    }}
  </Formik>
  );
}

export default observer(CharacterSelectionStep);