import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountStore } from '../../../store/accountStore';

interface CharacterSelectionStepProps {
  accountStore?: AccountStore
}

const CharacterSelectionStep: React.FC<CharacterSelectionStepProps> = ({ accountStore }: CharacterSelectionStepProps) => {
  const { t } = useTranslation();

  return (
        <div>
            character-selection-step
        </div>
  );
}

export default inject('accountStore')(observer(CharacterSelectionStep));
