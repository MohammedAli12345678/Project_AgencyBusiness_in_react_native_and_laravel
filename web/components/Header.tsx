"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Replace later with real auth state
  const user = null; // or { name: "Ahmed", role: "admin" }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-red-600">
          Zetrix
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10">
          <Link href="/" className="hover:text-red-500">Home</Link>
          <Link href="/about" className="hover:text-red-500">About</Link>
          <Link href="/projects" className="hover:text-red-500">Projects</Link>
          <Link href="/blog" className="hover:text-red-500">Blog</Link>
          <Link href="/contact" className="hover:text-red-500">Contact</Link>
        </nav>

        {/* Right Side */}
        {user ? (
          <div className="relative">
            <button className="px-4 py-2 bg-gray-100 rounded-lg">
              {/* {user.name} */}
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl"
          >
            Get Started →
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>
      )}
    </header>
  );
}