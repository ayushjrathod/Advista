"use client";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
          <nav className="flex space-x-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </nav>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button size="icon" variant="ghost">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
