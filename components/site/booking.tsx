"use client";

/* Booking sheet + context so any CTA on the page can open it. The form itself
   is Supabase-backed (see booking-form.tsx): live availability, and the slot is
   locked server-side by an exclusion constraint so two people can't take it. */

import { createContext, useContext, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookingForm } from "@/components/site/booking-form";

const BookingContext = createContext<{ open: (_?: string) => void }>({
  open: () => {},
});

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <p className="label-mono text-accent">TUE–SAT · ONE CHAIR · SPYROS</p>
            <SheetTitle>Book a chair</SheetTitle>
            <SheetDescription>
              Live availability — your slot is locked the moment you confirm. No
              double-bookings, ever.
            </SheetDescription>
          </SheetHeader>
          <div className="p-6">
            <BookingForm />
          </div>
        </SheetContent>
      </Sheet>
    </BookingContext.Provider>
  );
}
