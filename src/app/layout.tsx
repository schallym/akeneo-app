import { Lato } from "next/font/google";
import SideNav from "@/ui/nav/sidenav";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const lato = Lato({ subsets: ["latin"], weight: "400", style: "normal" });

const ThemeClient = dynamic(() => import("@/ui/theme-client"), { ssr: false });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lato.className} m-0`}>
        <ThemeClient>
          <Toaster position="bottom-right" />
          <main className="flex">
            <SideNav />
            <div className="container mx-5 mt-7">{children}</div>
          </main>
        </ThemeClient>
      </body>
    </html>
  );
}
