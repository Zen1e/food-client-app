"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  useEffect(() => {
    document.body.setAttribute("data-page", pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>NomNom</title>
        <link rel="icon" href="./logo.svg" />
      </head>
      <body
      >
        {children}
      </body>
    </html>
  );
}
