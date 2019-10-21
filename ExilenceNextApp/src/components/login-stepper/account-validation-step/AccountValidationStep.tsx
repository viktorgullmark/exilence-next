import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountStore } from '../../../store/accountStore';

interface AccountValidationStepProps {
  accountStore?: AccountStore
}

const AccountValidationStep: React.FC<AccountValidationStepProps> = ({ accountStore }: AccountValidationStepProps) => {
  const { t } = useTranslation();

  return (
        <div>
            account-validation-step
        </div>
  );
}

export default inject('accountStore')(observer(AccountValidationStep));
