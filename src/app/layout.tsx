import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { getAuthSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton"; // We'll add this next

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovelHub",
  description: "Read novels and bookmark your progress",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gray-800 text-white p-4">
          <nav className="flex gap-4 max-w-5xl mx-auto">
            <Link href="/" className="hover:underline">🏠 Home</Link>
            <Link href="/novels" className="hover:underline">📚 Novels</Link>
            <Link href="/bookmarks" className="hover:underline">🔖 Bookmarks</Link>

            {session?.user ? (
              <>
                <span className="ml-auto">👤 {session.user.name || session.user.email}</span>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="ml-auto hover:underline">🔐 Login</Link>
            )}
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
