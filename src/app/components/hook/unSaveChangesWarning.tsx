import { useEffect } from 'react';

interface Props {
  condition: boolean;
}

export const useUnSavedChangesWarning = (props: Props) => {
  useEffect(() => {
    const beforeUnload = (e: any) => {
      if (props.condition) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [props.condition]);
};
