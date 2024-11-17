// app/forgot-password/page.tsx
import { AuthHeader } from '../components/AuthHeader'

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <AuthHeader />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Reset Your Password
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              Send Reset Instructions
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Back to login
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}