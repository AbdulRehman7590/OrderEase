import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

const footerLinks = [
  { name: "Terms of Service", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Contact Us", href: "/contact" },
  { name: "Careers", href: "#" },
  { name: "Blog", href: "#" },
  { name: "FAQs", href: "#" },
];

const socialLinks = [
  { icon: <Instagram className="h-5 w-5" />, href: "#" },
  { icon: <Twitter className="h-5 w-5" />, href: "#" },
  { icon: <Facebook className="h-5 w-5" />, href: "#" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-indigo-800 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                Order Ease
              </span>
            </Link>
            <p className="text-indigo-100">
              Revolutionizing food ordering with technology and taste.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                  aria-label="Social media link"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-indigo-100 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.slice(3).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-indigo-100 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-indigo-100">
              Subscribe to our newsletter for the latest offers and updates.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-indigo-200"
              />
              <Button
                type="submit"
                className="px-4 py-2 rounded-lg bg-white text-indigo-600 font-medium hover:bg-gray-100 transition-colors duration-300"
              >
                Join
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-indigo-100 flex items-center">
              © 2025 Order Ease. All rights reserved.
            </p>
            <p className="text-xs text-center text-indigo-100/80">
              Order Ease is not responsible for any food cravings induced by our
              platform.
            </p>
            <div className="flex items-center gap-2 text-sm text-indigo-100">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-300 fill-red-300" />
              <span>in Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
