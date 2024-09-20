import React from 'react';

const PaymentsPage = () => {
    return (
        <div className="w-full h-full p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Credit/Debit Cards</h1>


                <div className="bg-gray-100 p-4 rounded-md border border-gray-200 flex items-center space-x-4">
                    <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m4 4h-1v-4h-1m1 0V9a4 4 0 00-8 0v3m8 0v1a4 4 0 01-8 0v-1m-3 5h14M5 20h14"
                        />
                    </svg>
                    <span className="text-gray-600">
                        You currently don't have any debit or credit cards saved.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
