import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import BootstrapActivation from "./components/BootstrapActivation";
import Header from "./nav/Header";
import Footer from "./nav/Footer";
import AppState from "./components/AppState";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next App",
  description: "VirtualMe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppState>
        
        <body className={inter.className}>

            <Header/>

              <div className="container">
                <main role="main" className="pb-3">
                  {children}
                </main>
              </div>
            
            <Footer/>

            <BootstrapActivation/>
        </body>
          
      </AppState>
    </html>
  );
}
