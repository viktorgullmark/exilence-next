import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountStore } from '../../../store/accountStore';

interface LeagueSelectionStepProps {
  accountStore?: AccountStore
}

const LeagueSelectionStep: React.FC<LeagueSelectionStepProps> = ({ accountStore }: LeagueSelectionStepProps) => {
  const { t } = useTranslation();

  return (
        <div>
            league-selection-step
        </div>
  );
}

export default inject('accountStore')(observer(LeagueSelectionStep));
