import React, { useRef } from 'react';
import { CardMedia, Dialog, DialogTitle } from '@mui/material';

type BulkSellGuideDialogProps = {
  onClose: () => void;
  isOpen: boolean;
};

const BulkSellGuideDialog = ({ onClose, isOpen }: BulkSellGuideDialogProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    if (ref.current) ref.current.play();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={isOpen} maxWidth="md">
      <DialogTitle id="simple-dialog-title">Bulk Sell Video Guide</DialogTitle>
      <CardMedia
        component="video"
        src="https://i.gyazo.com/636739904f0f072ccb8f489c67b9b4b3.mp4"
        muted
        onCanPlay={play}
        ref={ref}
        controls
      />
    </Dialog>
  );
};

export default BulkSellGuideDialog;
