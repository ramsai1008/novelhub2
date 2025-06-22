import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBookmarksForUser } from "@/lib/firebase";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await getAuthSession();

  // 🔒 Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }

  const bookmarks = await getBookmarksForUser(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔖 Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((b) => (
            <li key={b.id}>
              <Link href={`/novels/${b.novelId}/chapter/${b.chapterId}`}>
                📘 {b.novelTitle} — Chapter {b.chapterTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
