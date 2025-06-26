import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../lib/useAuth";
import SignOutButton from "../components/SignOutButton";

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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors min-h-screen`}>
        <ThemeProvider>
          <nav className="p-4 bg-gray-100 dark:bg-gray-900 flex justify-between items-center">
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/bookmarks" className="hover:underline">Bookmarks</Link>
              <Link href="/history" className="hover:underline">History</Link>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user && <SignOutButton />}
            </div>
          </nav>
          <main className="p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
