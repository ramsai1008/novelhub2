"use client";
import { useAuth } from "../lib/useAuth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default function NavbarUserActions() {
  const { user } = useAuth();
  if (user) {
    return <SignOutButton />;
  }
  return (
    <>
      <Link href="/login" className="px-3 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-sm sm:text-base">Login</Link>
    </>
  );
}
