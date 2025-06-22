"use client";

import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth"; // your custom hook for auth context

interface Props {
  novelId: string;
  chapterId: string;
}

export default function BookmarkButton({ novelId, chapterId }: Props) {
  const { user } = useAuth(); // make sure this returns user with user.uid
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkBookmark = async () => {
      const ref = doc(db, "bookmarks", `${user.uid}_${novelId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.chapterId === chapterId) {
          setIsBookmarked(true);
        }
      }
      setLoading(false);
    };

    checkBookmark();
  }, [user, novelId, chapterId]);

  const toggleBookmark = async () => {
    if (!user) return alert("Login required to bookmark.");
    const ref = doc(db, "bookmarks", `${user.uid}_${novelId}`);

    if (isBookmarked) {
      await deleteDoc(ref);
      setIsBookmarked(false);
    } else {
      await setDoc(ref, {
        novelId,
        chapterId,
        userId: user.uid,
        timestamp: Date.now() // 🔥 Add timestamp here
      });
      setIsBookmarked(true);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleBookmark}
      className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
    >
      {isBookmarked ? "🔖 Bookmarked" : "📑 Bookmark"}
    </button>
  );
}
