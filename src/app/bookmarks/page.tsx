// src/app/bookmarks/page.tsx
"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return <p>Redirecting to login...</p>;

  return <div>Your bookmarks go here!</div>;
}
