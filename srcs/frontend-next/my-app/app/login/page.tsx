// app/login/page.tsx
"use client";

import { AuthHeader } from "../components/AuthHeader";
import * as Form from "@radix-ui/react-form";
import { FormTextField } from "../components/FormTextField";
import { useLoginForm } from "./useLoginForm";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function Page() {
  const {
    formData,
    error,
    showError,
    setShowError,
    handleTextChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-black">
      <AuthHeader />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Welcome back
          </h1>

          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <FormTextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleTextChange}
              placeholder="Enter your username"
            />
            {/* Password */}
            <FormTextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleTextChange}
              placeholder="Enter your password"
            />

            {/* Submit Button */}
            <Form.Submit asChild>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                Login
              </button>
            </Form.Submit>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Forgot your password?
              </a>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </Form.Root>
        </div>
      </main>

      {/* Error Dialog */}
      <AlertDialog.Root open={showError} onOpenChange={setShowError}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-[90vw]">
            <AlertDialog.Title className="text-lg font-medium text-gray-900 mb-2">
              Error
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-500 mb-4">
              {error}
            </AlertDialog.Description>
            <AlertDialog.Action asChild>
              <button
                onClick={() => setShowError(false)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Ok
              </button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
