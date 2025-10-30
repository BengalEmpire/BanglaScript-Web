"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PopupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Iframe Section */}
      <div className="flex-grow w-full h-[100vh] bg-gray-100">
        <iframe
          src="https://banglascript.netlify.app/"
          title="BanglaScript App"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
