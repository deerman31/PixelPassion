// app/dashboard/page.tsx

import Link from "next/link"; // このインポートが抜けていた
import { Header } from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 bg-black">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">
                Find Your Perfect Match with Matcha
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join millions of people discovering meaningful connections
                through shared interests, values, and authentic conversations.
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Matcha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
