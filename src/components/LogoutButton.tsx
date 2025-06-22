"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="hover:underline text-red-400"
    >
      🚪 Logout
    </button>
  );
}
