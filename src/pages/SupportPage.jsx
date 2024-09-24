import React from 'react';
import SupportForm from '../components/SupportForm.jsx';
import FAQ from '../components/FAQ';

const SupportPage = () => {
    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <SupportForm />
            <div className="bg-gray-900 p-6">
                <FAQ />
            </div>
        </div>
    );
};

export default SupportPage;
