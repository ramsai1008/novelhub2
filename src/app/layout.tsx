"use client";
import { useAuth } from "@/lib/useAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <html>
      <body>
        <nav className="p-4 bg-gray-200 flex justify-between">
          <span className="font-bold">NovelHub</span>
          {user ? (
            <span>Welcome, {user.email}</span>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
