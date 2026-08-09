import React from 'react';
import { BookOpen, Shield, Mail, Info } from 'lucide-react';

export default function Navbar() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-100 backdrop-blur-md border-b border-slate-200/80">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        {/* Left: Project Name */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-base sm:text-2xl font-semibold">
              Multilingual Audio Detection using Code-Switching
            </h1>
          </div>
        </div>

        {/* Right: Nav Links */}
        <nav className="hidden md:flex items-center space-x-3 text-lg font-medium">
          <button
            onClick={() => scrollToSection("about")}
            className="px-3.5 py-1.5 rounded-lg bg-white text-gray-700 hover:font-bold hover:text-xl transition-all duration-200"
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("privacy")}
            className="px-3.5 py-1.5 rounded-lg bg-white text-gray-700 hover:font-bold hover:text-xl transition-all duration-200"
          >
            Privacy
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="px-3.5 py-1.5 rounded-lg bg-white text-gray-700 hover:font-bold hover:text-xl transition-all duration-200"
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
