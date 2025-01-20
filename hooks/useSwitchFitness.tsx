import React from 'react';
import useLocalStorage from './useLocalStorage';

import { SwitchFitnessDiscount } from 'interfaces';

type SwitchFitnessDiscountState = {
  email: string | undefined;
  isEligible: boolean;
  alreadyUsed: boolean;
};

const initialState: SwitchFitnessDiscountState = {
  email: undefined,
  isEligible: false,
  alreadyUsed: false,
};

type SwitchFitnessDiscountContextType = SwitchFitnessDiscountState & {
  addEmailToUsedEmails: (email: string) => Promise<SwitchFitnessDiscount>;
  verifyEmail: ({
    email,
    switchFitnessId,
  }: {
    email: string;
    switchFitnessId: string;
  }) => Promise<{
    isEligible: boolean;
    alreadyUsed: boolean;
  }>;
  resetState: () => void;
};

const SwitchFitnessDiscountContext =
  React.createContext<SwitchFitnessDiscountContextType>(
    initialState as SwitchFitnessDiscountContextType
  );

function useSwitchFitnessDiscount() {
  const context = React.useContext(SwitchFitnessDiscountContext);
  if (!context) {
    throw new Error(
      'useSwitchFitnessDiscount must be used within a SwitchFitnessDiscountProvider'
    );
  }
  return context;
}

function SwitchFitnessDiscountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localStorageState, saveLocalStorageState] = useLocalStorage(
    'sfd-25',
    JSON.stringify(initialState)
  );

  const [state, saveState] = React.useState<SwitchFitnessDiscountState>(
    JSON.parse(localStorageState)
  );

  React.useEffect(() => {
    saveLocalStorageState(JSON.stringify(state));
  }, [state, saveLocalStorageState]);

  const verifyEmail = async ({
    email,
    switchFitnessId,
  }: {
    email: string;
    switchFitnessId: string;
  }) => {
    const response = await fetch(`/api/switch-fitness/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, id: switchFitnessId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify email');
    }

    const {
      isEligible,
      alreadyUsed,
    }: { isEligible: boolean; alreadyUsed: boolean } = await response.json();
    saveState({ ...state, email, isEligible, alreadyUsed });
    return { isEligible, alreadyUsed };
  };

  const addEmailToUsedEmails = async (email: string) => {
    const response = await fetch(`/api/switch-fitness/add-used-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to add email to used emails');
    }

    const updatedSwitchFitness: SwitchFitnessDiscount = await response.json();
    saveState({ ...state, email, isEligible: false, alreadyUsed: true });
    return updatedSwitchFitness;
  };

  const resetState = () => {
    saveState(initialState);
  };

  return (
    <SwitchFitnessDiscountContext.Provider
      value={{ ...state, addEmailToUsedEmails, verifyEmail, resetState }}
    >
      {children}
    </SwitchFitnessDiscountContext.Provider>
  );
}

export { SwitchFitnessDiscountProvider, useSwitchFitnessDiscount };
