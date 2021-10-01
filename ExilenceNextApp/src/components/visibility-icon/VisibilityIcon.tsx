import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type VisibilityIconProps = {
  visible: boolean;
  position: 'start' | 'end';
  handleClickShowIcon: () => void;
  handleMouseDownIcon: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const VisibilityIcon = ({
  visible,
  position,
  handleClickShowIcon,
  handleMouseDownIcon,
}: VisibilityIconProps) => {
  const { t } = useTranslation();

  return (
    <InputAdornment position={position}>
      <IconButton
        title={t('label.toggle_visibility_icon_title')}
        onClick={handleClickShowIcon}
        onMouseDown={handleMouseDownIcon}
        edge="start"
        size="small"
      >
        {visible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
};

export default VisibilityIcon;
