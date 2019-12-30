import React from 'react';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  position: 'start' | 'end';
  handleClickShowIcon: () => void;
  handleMouseDownIcon: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const VisibilityIcon: React.FC<Props> = ({
  visible,
  position,
  handleClickShowIcon,
  handleMouseDownIcon
}: Props) => {
  const { t } = useTranslation();

  return (
    <InputAdornment position={position}>
      <IconButton
        title={t('label.toggle_visibility_icon_title')}
        onClick={handleClickShowIcon}
        onMouseDown={handleMouseDownIcon}
      >
        {visible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
};

export default VisibilityIcon;
