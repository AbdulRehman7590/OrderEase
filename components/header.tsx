import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <UtensilsCrossed className="h-6 w-6" />
          <span>Order Ease</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Menu
          </Link>
          <Link
            href="/order"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Order
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
