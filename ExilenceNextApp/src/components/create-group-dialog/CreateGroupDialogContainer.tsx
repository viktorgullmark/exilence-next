import React from 'react';
import CreateGroupDialog from './CreateGroupDialog';

interface Props {
  show: boolean;
  onClose: () => void;
}

const CreateGroupDialogContainer: React.FC<Props> = ({
  show,
  onClose
}: Props) => {
  const onCreate = () => {
    console.log('should create grp');
  };
  return (
    <CreateGroupDialog show={show} onClose={onClose} onCreate={onCreate} />
  );
};

export default CreateGroupDialogContainer;
