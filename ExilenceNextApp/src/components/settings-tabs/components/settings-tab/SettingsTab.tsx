import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';

interface Props {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function SettingsTab(props: Props) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Typography
      component="div"
      role="tabpanel"
      style={{ width: '100%', position: 'relative' }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={2}>
        <Box position="absolute" top={theme.spacing(2)} right={theme.spacing(2)}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('label.requires_snapshot_info')}
          </Typography>
        </Box>
        {children}
      </Box>
    </Typography>
  );
}

export default observer(SettingsTab);
