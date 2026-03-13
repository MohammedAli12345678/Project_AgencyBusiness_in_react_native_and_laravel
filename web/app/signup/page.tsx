"use client";

import Header from "@/components/Header";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }; 
   let x: number = 5;
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}