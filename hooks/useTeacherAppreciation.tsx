import React from 'react';
import useLocalStorage from './useLocalStorage';
import { TeacherAppreciation } from 'interfaces';

type TeacherAppreciationState = {
  email: string | undefined;
  isEligible: boolean;
  alreadyUsed: boolean;
};

const initialState: TeacherAppreciationState = {
  email: undefined,
  isEligible: false,
  alreadyUsed: false,
};

type TeacherAppreciationContextType = TeacherAppreciationState & {
  addEmailToUsedEmails: (email: string) => Promise<TeacherAppreciation>;
  verifyEmail: ({
    email,
    teacherAppreciationId,
  }: {
    email: string;
    teacherAppreciationId: string;
  }) => Promise<{
    isEligible: boolean;
    alreadyUsed: boolean;
  }>;
  resetState: () => void;
};

const TeacherAppreciationContext =
  React.createContext<TeacherAppreciationContextType>(
    initialState as TeacherAppreciationContextType
  );

function useTeacherAppreciation() {
  const context = React.useContext(TeacherAppreciationContext);
  if (!context) {
    throw new Error(
      'useTeacherAppreciation must be used within a TeacherAppreciationProvider'
    );
  }
  return context;
}

type TeacherAppreciationProviderType = {
  children: React.ReactNode;
};

function TeacherAppreciationProvider({
  children,
}: TeacherAppreciationProviderType) {
  const [localStorageState, saveLocalStorageState] = useLocalStorage(
    'ta-24',
    JSON.stringify(initialState)
  );

  const [state, saveState] = React.useState<TeacherAppreciationState>(
    JSON.parse(localStorageState)
  );

  React.useEffect(() => {
    saveLocalStorageState(JSON.stringify(state));
  }, [state, saveLocalStorageState]);

  const verifyEmail = async ({
    email,
    teacherAppreciationId,
  }: {
    email: string;
    teacherAppreciationId: string;
  }) => {
    const response = await fetch(`/api/teacher-appreciation/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ email, id: teacherAppreciationId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    const response = await fetch(`/api/teacher-appreciation/add-used-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to add email to used emails');
    }

    const updatedTeacherAppreciation: TeacherAppreciation =
      await response.json();
    saveState({ email, isEligible: false, alreadyUsed: true });
    return updatedTeacherAppreciation;
  };

  const resetState = () => {
    saveState(initialState);
  };

  return (
    <TeacherAppreciationContext.Provider
      value={{ ...state, addEmailToUsedEmails, verifyEmail, resetState }}
    >
      {children}
    </TeacherAppreciationContext.Provider>
  );
}

export { useTeacherAppreciation, TeacherAppreciationProvider };
