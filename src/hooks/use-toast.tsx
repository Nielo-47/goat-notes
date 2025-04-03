'use client';

import * as React from 'react';
import { Toaster as Sonner, toast as sonnerToast } from 'sonner';

// Types for our toast implementation
export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
};

// Function to create a toast with our custom props
function toast({
  title,
  description,
  action,
  variant = 'default',
  ...props
}: ToastProps) {
  return sonnerToast(title as string, {
    description,
    action,
    className:
      variant === 'destructive'
        ? 'bg-destructive text-destructive-foreground'
        : variant === 'success'
          ? 'bg-green-600 text-white'
          : undefined,
    ...props,
  });
}

// Re-export Sonner functionality with our custom toast function
function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}

// Toast container component
export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}

export { useToast, toast };
