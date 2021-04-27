import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import InfoDialog from '../info-dialog/InfoDialog';

const CreditsDialog = ({ open, onClose }: any) => {
  const [isFetching, setIsFetching] = useState(false);
  const [changelog, setChangelog] = useState('');

  useEffect(() => {
    if (!isFetching) {
      setIsFetching(true);
      fetch('https://raw.githubusercontent.com/viktorgullmark/exilence-next/master/CREDITS.md')
        .then((response) => response.text())
        .then((result) => {
          setChangelog(result);
          setIsFetching(false);
        });
    }
  }, []);

  return (
    <InfoDialog
      show={open}
      title="Credits"
      content={<ReactMarkdown>{isFetching ? '' : changelog}</ReactMarkdown>}
      onClose={onClose}
    />
  );
};

export default CreditsDialog;
