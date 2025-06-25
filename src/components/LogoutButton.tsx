"use client";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="hover:underline text-red-400"
    >
      🚪 Logout
    </button>
  );
}
