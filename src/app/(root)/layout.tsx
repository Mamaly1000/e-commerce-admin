import ModalProviders from "@/providers/ModalProviders";
import "../globals.css";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={twMerge(
            inter.className,
            "min-w-full min-h-screen flex items-center justify-center bg-slate-900"
          )}
        >
          <section>
            <ModalProviders />
            {children}
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
