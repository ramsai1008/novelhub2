import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovelHub",
  description: "A novel reading website like ReadNovelFull",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors min-h-screen`}
      >
        <ThemeProvider>
          {/* HEADER */}
          <header className="bg-gray-100 dark:bg-gray-900 shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                <Link href="/">NovelHub</Link>
              </div>
              <nav className="space-x-4 text-sm md:text-base">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <Link href="/genres" className="hover:underline">
                  Genres
                </Link>
                <Link href="/latest" className="hover:underline">
                  Latest
                </Link>
                <Link href="/bookmarks" className="hover:underline">
                  Bookmarks
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search novels..."
                  className="px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-700 text-sm"
                />
                <ThemeToggle />
                <Link href="/login" className="hover:underline text-sm">
                  Login
                </Link>
              </div>
            </div>
          </header>

          {/* MAIN */}
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="bg-gray-200 dark:bg-gray-800 text-sm text-center py-4 mt-auto">
            <div className="container mx-auto px-4">
              &copy; {new Date().getFullYear()} NovelHub. All rights reserved. |{" "}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
