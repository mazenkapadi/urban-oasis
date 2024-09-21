import React from 'react';
import SupportForm from '../components/SupportForm.jsx';
import FAQ from '../components/FAQ';

const SupportPage = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <SupportForm />
                <FAQ />
            </div>
        </div>
    );
};

export default SupportPage;
