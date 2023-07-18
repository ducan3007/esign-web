import { ToastOptions, toast } from 'react-toastify';

interface ToastProps {
  message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info';
  options?: ToastOptions;
}

export const Toast = (props: ToastProps) => {
  const propCopy = Object.assign({}, props);
  delete propCopy.options?.style;
  switch (props.type) {
    case 'success':
      return toast.success(props.message, {
        style: {
          borderColor: 'var(--green1)',
          ...props.options?.style,
        },
        ...propCopy.options,
      });
    case 'error':
      return toast.error(props.message, {
        style: {
          borderColor: 'var(--red)',
          ...props.options?.style,
        },
        autoClose: 3500,
        ...propCopy.options,
      });
    case 'warning':
      return toast.warning(props.message, {
        style: {
          borderColor: 'var(--yellow1)',
          ...props.options?.style,
        },
        ...propCopy.options,
      });
    case 'info':
      return toast.info(props.message, {
        style: {
          borderColor: 'var(--blue1)',
          ...props.options?.style,
        },
        ...propCopy.options,
      });
  }
};
