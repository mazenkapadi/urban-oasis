import React, { useState } from 'react';
import HeaderComponent from "../components/HeaderComponent.jsx";

const SupportPage = () => {
    const [ activeTab, setActiveTab ] = useState('attending');
    const [ openQuestion, setOpenQuestion ] = useState(null);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ issue, setIssue ] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Support request submitted by ${name}`);
    };

    return (
        <div className="bg-gray-900 min-h-screen p-4 md:p-8 text-white flex flex-col gap-8" >
            <HeaderComponent />

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-full" >
                {/* FAQs Section - 2/3 width on md and lg screens */}
                <div className="md:w-2/3 bg-gray-800 rounded-lg shadow-lg p-4 md:p-6" >

                    <h2 className="text-2xl font-bold mb-6" >Frequently Asked Questions</h2 >

                    <div className="flex space-x-4 mb-6 border-b border-gray-600" >
                        {[ 'attending', 'organizing', 'account' ].map((tab) => (
                            <button
                                key={tab}
                                className={`pb-2 font-semibold ${
                                    activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button >
                        ))}
                    </div >

                    <div className="space-y-4" >
                        {faqs[activeTab].map((faq, index) => (
                            <button
                                key={index}
                                onClick={() => toggleQuestion(index)}
                                className="w-full text-left border border-gray-600 rounded-md p-4 text-lg font-semibold hover:bg-gray-700 transition"
                            >
                                <div className="flex justify-between items-center" >
                                    {faq.question}
                                </div >
                                {openQuestion === index && (
                                    <p className="mt-2 text-gray-300" >{faq.answer}</p >
                                )}
                            </button >
                        ))}
                    </div >
                </div >

                {/* Support Form Section - 1/3 width on md and lg screens */}
                <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-lg p-4 md:p-6" >
                    <h2 className="text-2xl font-bold mb-4" >Submit a Support Request</h2 >
                    <form onSubmit={handleSubmit} className="space-y-4" >
                        {[
                            {label: "Name", value: name, setter: setName, type: "text"},
                            {label: "Email", value: email, setter: setEmail, type: "email"},
                            {label: "Phone Number", value: phone, setter: setPhone, type: "tel"}
                        ].map(({label, value, setter, type}) => (
                            <div key={label} >
                                <label className="block text-gray-300" >{label}</label >
                                <input
                                    type={type}
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                    className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div >
                        ))}
                        <div >
                            <label className="block text-gray-300" >Describe Your Issue</label >
                            <textarea
                                value={issue}
                                onChange={(e) => setIssue(e.target.value)}
                                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                required
                            />
                        </div >
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Submit
                        </button >
                    </form >
                </div >
            </div >
        </div >
    );
};

export default SupportPage;
