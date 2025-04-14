"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Order", href: "/order" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl mx-auto ">
      <div
        className={`flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 shadow-xl px-6 transition-all duration-300 ${
          scrolled ? "scale-[0.98] shadow-2xl" : ""
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 py-4 font-bold text-2xl text-gray-800 hover:text-primary transition-colors"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <UtensilsCrossed className="relative h-7 w-7 text-indigo-800 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
            Order Ease
          </span>
        </Link>

        {/* Navigation - Centered */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-gray-700 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group transition-all duration-300 hover:text-indigo-700"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Contact Button - Right */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.03]"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 rounded-xl bg-white/90 backdrop-blur-md shadow-md px-6 py-4">
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 px-4 py-2 text-center rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 text-white text-sm font-medium shadow hover:shadow-lg"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
