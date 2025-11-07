import toast from 'react-hot-toast';

// Custom toast configurations with #1973AE branding
export const showSuccessToast = (message: string) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#1973AE',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(25, 115, 174, 0.3)',
      maxWidth: '90vw',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#1973AE',
    },
  });
};

export const showErrorToast = (message: string) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-center',
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      maxWidth: '90vw',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

export const showInfoToast = (message: string) => {
  return toast(message, {
    duration: 4000,
    position: 'top-center',
    icon: 'ℹ️',
    style: {
      background: '#1973AE',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(25, 115, 174, 0.3)',
      maxWidth: '90vw',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#1973AE',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(25, 115, 174, 0.3)',
      maxWidth: '90vw',
    },
  });
};

export const showWarningToast = (message: string) => {
  return toast(message, {
    duration: 4500,
    position: 'top-center',
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
      maxWidth: '90vw',
    },
  });
};

// Promise toast for async operations
export const showPromiseToast = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: {
        background: '#1973AE',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(25, 115, 174, 0.3)',
        maxWidth: '90vw',
      },
      success: {
        iconTheme: {
          primary: '#fff',
          secondary: '#1973AE',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
    }
  );
};
