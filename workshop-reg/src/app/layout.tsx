import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "../../components/providers/AuthProvider";
import ReactQueryProvider from "../../components/providers/QueryReactProvider";

export const metadata: Metadata = {
  title: "Workshop Certification",
  description: "Workshop & Certification Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}