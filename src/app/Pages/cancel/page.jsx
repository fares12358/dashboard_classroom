import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
            <h1 className="text-2xl font-bold text-red-600">
                ❌ Payment canceled
            </h1>
            <p className="mt-2 text-gray-700">
                Your payment was not completed. You can go back and try again.
            </p>
        </div>
    );
}

export default page