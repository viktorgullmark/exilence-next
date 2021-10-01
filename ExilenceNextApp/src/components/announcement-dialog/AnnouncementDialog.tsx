import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import useStyles from './AnnouncementDialog.styles';
import { IApiAnnouncement } from '../../interfaces/api/api-announcement.interface';
import ReactMarkdown from 'react-markdown';

type AnnouncementDialogProps = {
  show: boolean;
  announcement: IApiAnnouncement;
  onClose: () => void;
};

const AnnouncementDialog = ({ show, announcement, onClose }: AnnouncementDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{t('title.announcement_dialog_title')}</DialogTitle>
      <DialogContent>
        <Box width={1} mb={1}>
          <Typography variant="h6">{announcement.title}</Typography>
        </Box>
        <Box width={1} mb={2}>
          <ReactMarkdown>{announcement.message}</ReactMarkdown>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary" variant="contained">
          {t('action.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementDialog;
