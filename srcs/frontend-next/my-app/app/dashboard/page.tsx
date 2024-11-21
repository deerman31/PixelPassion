// app/page.tsx

import Link from 'next/link' // このインポートが抜けていた
import { Header } from '../components/Header'

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
                                Join millions of people discovering meaningful connections through shared interests,
                                values, and authentic conversations.
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

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto max-w-6xl px-4">
                        <h2 className="text-3xl font-bold text-emerald-600 text-center mb-12">Why Choose Matcha?</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-emerald-600 mb-4">Smart Matching</h3>
                                <p className="text-gray-600">
                                    Our intelligent algorithm considers your interests, location, and preferences
                                    to suggest the most compatible matches.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-emerald-600 mb-4">Real Connections</h3>
                                <p className="text-gray-600">
                                    Connect with people who share your interests and values through
                                    meaningful conversations.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-emerald-600 mb-4">Safe & Secure</h3>
                                <p className="text-gray-600">
                                    Your privacy and security are our top priorities. Feel safe while
                                    exploring new connections.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="container mx-auto max-w-6xl px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Match?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join Matcha today and start your journey to meaningful connections.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Create Your Profile
                        </Link>
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
    )
}