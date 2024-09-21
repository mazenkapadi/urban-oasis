import React, { useState } from 'react';

const FAQPage = () => {
    const [activeTab, setActiveTab] = useState('attending');
    const [openQuestion, setOpenQuestion] = useState(null);


    const faqs = {
        attending: [
            {
                question: "Where can I view my event tickets?",
                answer: `Once you're logged in to UrbanOasis, you can find all your purchased tickets under the "My Tickets" section in your profile. Alternatively, check your email for a link to view your tickets.`
            },
            {
                question: "How do I change my ticket information?",
                answer: "If you need to change details like the attendee's name or contact info, head to the 'My Tickets' section, click on the event, and choose 'Edit Details'. Changes are only allowed if the event host has enabled this option."
            },
            {
                question: "Can I transfer my ticket to someone else?",
                answer: "Yes, if the host allows ticket transfers. Go to the 'My Tickets' page, select the ticket, and click 'Transfer Ticket'. You will need the recipient's email to complete the transfer."
            },
            {
                question: "What should I do if I arrive late to an event?",
                answer: "Late arrivals are subject to the event host's policies. Check the event details or contact the host directly to confirm whether you'll still be able to attend."
            }
        ],
        organizing: [
            {
                question: "How do I start hosting an event on UrbanOasis?",
                answer: "To start hosting an event, create an UrbanOasis account and click the 'Host an Event' button. Fill in your event details, set your ticket pricing, and publish when ready."
            },
            {
                question: "Can I change my event date or location after publishing?",
                answer: "Yes, changes to the event date or location can be made. Simply go to 'Manage Events', select your event, and update the details. Attendees will be automatically notified of any changes."
            },
            {
                question: "How do I cancel or postpone my event?",
                answer: "If you need to cancel or postpone your event, go to the 'Manage Events' page, select the event, and choose either 'Cancel' or 'Postpone'. Be sure to notify attendees and issue refunds if necessary."
            },
            {
                question: "Can I offer early-bird or discount tickets?",
                answer: "Yes, when setting up your event, you can create multiple ticket tiers, including early-bird or discount tickets, with specific start and end dates for availability."
            }
        ],
        account: [
            {
                question: "How do I update my email address?",
                answer: "To update your email address, navigate to the 'Settings' page and click 'Change Email'. You'll need to enter your new email and current password to verify the update."
            },
            {
                question: "What should I do if I forget my password?",
                answer: "Click 'Forgot Password' on the login page, and we'll send a reset link to your registered email. Follow the instructions in the email to set a new password."
            },
            {
                question: "How do I delete my UrbanOasis account?",
                answer: "If you'd like to delete your account, visit the 'Settings' page and select 'Close Account'. Please note that this action is permanent, and all of your data will be lost."
            },
            {
                question: "Can I manage multiple events from one account?",
                answer: "Yes, as a host, you can manage multiple events from a single UrbanOasis account. Simply go to the 'Manage Events' page to view and edit all your hosted events."
            }
        ]
    };

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Common Issues and Questions</h2>

                {/* Tab Navigation */}
                <div className="mb-6 flex space-x-4 border-b-2">
                    <button
                        className={`pb-2 ${activeTab === 'attending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('attending')}
                    >
                        Attending an Event
                    </button>
                    <button
                        className={`pb-2 ${activeTab === 'organizing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('organizing')}
                    >
                        Hosting an Event
                    </button>
                    <button
                        className={`pb-2 ${activeTab === 'account' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('account')}
                    >
                        Account & Settings
                    </button>
                </div>


                <div className="space-y-4">
                    {faqs[activeTab].map((faq, index) => (
                        <div key={index} className="border-b">
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full text-left text-lg font-semibold py-2 text-gray-800 hover:text-blue-600"
                            >
                                {faq.question}
                            </button>
                            {openQuestion === index && (
                                <p className="mt-2 text-gray-700">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
