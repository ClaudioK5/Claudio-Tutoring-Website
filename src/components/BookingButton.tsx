"use client";

import { useContact } from "@/lib/contact-context";

type BookingButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export function BookingButton({
  children,
  className = "",
  variant = "primary",
}: BookingButtonProps) {
  const { handleBooking } = useContact();
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <button type="button" onClick={handleBooking} className={`${base} ${className}`}>
      {children}
    </button>
  );
}
