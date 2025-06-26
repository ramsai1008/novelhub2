import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { SearchProvider } from "../context/SearchContext";
import { ThemeToggle } from "../components/ThemeToggle";
import NavbarUserActions from "../components/NavbarUserActions";
import { useAuth } from "../lib/useAuth";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovelHub",
  description: "A novel reading website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        // Check Firestore for isAdmin flag
        const { getDoc, doc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(!!userDoc.exists() && !!userDoc.data().isAdmin);
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim().length === 0) return;
    router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors min-h-screen`}>
        <ThemeProvider>
          <SearchProvider>
            <nav className="p-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-between items-center shadow-lg">
              <div className="space-x-4 flex items-center">
                <Link href="/" className="hover:underline text-white font-bold tracking-wide text-lg">Home</Link>
                <Link href="/bookmarks" className="hover:underline text-white/90">Bookmarks</Link>
                <Link href="/history" className="hover:underline text-white/90">History</Link>
                <Link href="/dashboard" className="hover:underline text-white/90">Dashboard</Link>
                {isAdmin && (
                  <Link href="/admin" className="hover:underline text-yellow-300 font-bold">Admin</Link>
                )}
              </div>
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </form>
                <ThemeToggle />
                <NavbarUserActions />
              </div>
            </nav>
            <main className="p-4">{children}</main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
