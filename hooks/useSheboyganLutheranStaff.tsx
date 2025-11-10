import React from 'react';

import useLocalStorage from './useLocalStorage';

import { SheboyganLutheranStaff } from 'interfaces';

type SheboyganLutheranStaffState = {
  email: string | undefined;
  isEligible: boolean;
  alreadyUsed: boolean;
};

const initialState: SheboyganLutheranStaffState = {
  email: undefined,
  isEligible: false,
  alreadyUsed: false,
};

type SheboyganLutheranStaffContextType = SheboyganLutheranStaffState & {
  addEmailToUsedEmails: (email: string) => Promise<SheboyganLutheranStaff>;
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
    const response = await fetch(
      `/api/sheboygan-lutheran-staff/verify-email?id=${sheboyganLutheranStaffId}&email=${email}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify email');
    }

    const {
      isEligible,
      alreadyUsed,
    }: { isEligible: boolean; alreadyUsed: boolean } = await response.json();
    saveState({ email, isEligible, alreadyUsed });
    return { isEligible, alreadyUsed };
  };

  const addEmailToUsedEmails = async (email: string) => {
    const response = await fetch(
      `/api/sheboygan-lutheran-staff/add-used-email`,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add email to used emails');
    }

    const updatedShebLutheranStaff: SheboyganLutheranStaff =
      await response.json();
    saveState({ email, isEligible: false, alreadyUsed: true });
    return updatedShebLutheranStaff;
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
        addEmailToUsedEmails,
        verifyEmail,
        resetState,
        notEligibleNotAlreadyUsed,
        notEligibleAlreadyUsed,
      }}
    >
      {children}
    </SheboyganLutheranStaffContext.Provider>
  );
}

export { SheboyganLutheranStaffProvider, useSheboyganLutheranStaff };
