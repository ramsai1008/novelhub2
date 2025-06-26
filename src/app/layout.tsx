import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import NavbarUserActions from "../components/NavbarUserActions";

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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors min-h-screen`}>
        <ThemeProvider>
          <nav className="p-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-between items-center shadow-lg">
            <div className="space-x-4">
              <Link href="/" className="hover:underline text-white font-bold tracking-wide text-lg">Home</Link>
              <Link href="/bookmarks" className="hover:underline text-white/90">Bookmarks</Link>
              <Link href="/history" className="hover:underline text-white/90">History</Link>
              <Link href="/dashboard" className="hover:underline text-white/90">Dashboard</Link>
              <Link href="/admin" className="hover:underline text-white/90">Admin</Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NavbarUserActions />
            </div>
          </nav>
          <main className="p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
