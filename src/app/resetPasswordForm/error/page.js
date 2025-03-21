// app/resetPasswordForm/error/page.js
import Link from 'next/link';

export default function VerificationSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Invalid Password Reset Link
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        The password reset link is invalid or has expired. Please request a new link.
                    </p>
                    
                    {/* Error Message Box */}
                    <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center">
                        Please try resetting your password again or contact support if the issue persists.
                    </div>

                    <div className="mt-8 space-y-4">
                        <div>
                            <Link 
                                href="/forgotPassword"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                Return to Forgot Password Page
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}