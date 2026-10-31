"use client";

import { createContext, useContext } from "react";

type ContactState = { dirty: boolean; pending: boolean; uncertain: boolean };

export function createContactCoordination(
  onLockChange: (locked: boolean) => void,
) {
  let contact: ContactState = {
    dirty: false,
    pending: false,
    uncertain: false,
  };
  let navigating = false;

  return {
    update(changes: Partial<ContactState>) {
      contact = { ...contact, ...changes };
      onLockChange(contact.pending || contact.uncertain);
    },
    beginSubmission() {
      if (navigating || contact.pending || contact.uncertain) return false;
      contact.pending = true;
      onLockChange(true);
      return true;
    },
    beginNavigation(confirmDiscard: () => boolean) {
      if (navigating || contact.pending || contact.uncertain) return false;
      if (contact.dirty && !confirmDiscard()) return false;
      navigating = true;
      return true;
    },
    endNavigation() {
      navigating = false;
    },
  };
}

export const ContactCoordinationContext = createContext<ReturnType<
  typeof createContactCoordination
> | null>(null);

export function useContactCoordination() {
  const coordination = useContext(ContactCoordinationContext);
  if (!coordination) throw new Error("ContactForm requires LocaleShell");
  return coordination;
}
