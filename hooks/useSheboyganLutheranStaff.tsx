import React from 'react';

import useLocalStorage from './useLocalStorage';

type SheboyganLutheranStaffState = {
  email: string | undefined;
  isEligible: boolean;
  alreadyUsed: boolean;
  firstName: string;
  lastName: string;
};

const initialState: SheboyganLutheranStaffState = {
  email: undefined,
  isEligible: false,
  alreadyUsed: false,
  firstName: '',
  lastName: '',
};

type SheboyganLutheranStaffContextType = SheboyganLutheranStaffState & {
  verifyEmail: ({
    email,
    sheboyganLutheranStaffId,
  }: {
    email: string;
    sheboyganLutheranStaffId: string;
  }) => Promise<{
    isEligible: boolean;
    alreadyUsed: boolean;
  }>;
  resetState: () => void;
  notEligibleNotAlreadyUsed: boolean;
  notEligibleAlreadyUsed: boolean;
  isSubmitting: boolean;
};

const SheboyganLutheranStaffContext =
  React.createContext<SheboyganLutheranStaffContextType>(
    initialState as SheboyganLutheranStaffContextType
  );

function useSheboyganLutheranStaff() {
  const context = React.useContext(SheboyganLutheranStaffContext);
  if (!context) {
    throw new Error(
      'useSheboyganLutheranStaff must be used within a SheboyganLutheranStaffProvider'
    );
  }
  return context;
}

type SheboyganLutheranStaffProviderType = {
  children: React.ReactNode;
};

function SheboyganLutheranStaffProvider({
  children,
}: SheboyganLutheranStaffProviderType) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localStorageState, saveLocalStorageState] = useLocalStorage(
    'sheb-luth-staff-25',
    JSON.stringify(initialState)
  );

  const [state, saveState] = React.useState<SheboyganLutheranStaffState>(
    JSON.parse(localStorageState)
  );

  React.useEffect(() => {
    saveLocalStorageState(JSON.stringify(state));
  }, [state, saveLocalStorageState]);

  const verifyEmail = async ({
    email,
    sheboyganLutheranStaffId,
  }: {
    email: string;
    sheboyganLutheranStaffId: string;
  }) => {
    setIsSubmitting(true);
    const response = await fetch(
      `/api/sheboygan-lutheran-staff/verify-email?id=${sheboyganLutheranStaffId}&email=${encodeURIComponent(
        email
      )}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      setIsSubmitting(false);
      throw new Error('Failed to verify email');
    }

    const {
      isEligible,
      alreadyUsed,
      firstName,
      lastName,
    }: {
      isEligible: boolean;
      alreadyUsed: boolean;
      firstName: string;
      lastName: string;
    } = await response.json();
    saveState({ email, isEligible, alreadyUsed, firstName, lastName });
    setIsSubmitting(false);
    return { isEligible, alreadyUsed };
  };

  const resetState = () => {
    saveState(initialState);
  };

  const notEligibleNotAlreadyUsed =
    !!state.email && !state.isEligible && !state.alreadyUsed;
  const notEligibleAlreadyUsed =
    !!state.email && !state.isEligible && state.alreadyUsed;

  return (
    <SheboyganLutheranStaffContext.Provider
      value={{
        ...state,
        verifyEmail,
        resetState,
        notEligibleNotAlreadyUsed,
        notEligibleAlreadyUsed,
        isSubmitting,
      }}
    >
      {children}
    </SheboyganLutheranStaffContext.Provider>
  );
}

export { SheboyganLutheranStaffProvider, useSheboyganLutheranStaff };
