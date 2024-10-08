import React from 'react';

const HostEventCard = ({event, status}) => {
    const {
        basicInfo: {title: eventName},
        eventDetails: {eventDateTime, eventPrice, capacity},
        attendeesCount
    } = event;

    const statusText = status === 'Future' ? 'Future Event' : 'Past Event';
    const statusBgColor = status === 'Future' ? 'bg-green-200' : 'bg-red-200';

    return (
        <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 bg-white" >
            <h3 className="text-lg font-semibold mb-2 text-gray-900" >{eventName}</h3 >
            <div className="flex justify-between items-start" >
                <div >
                    <p className="text-gray-700 mb-1" >
                        Attendees: <span className="font-bold" >{attendeesCount || 0}</span > / <span
                        className="font-bold" >{capacity || 'Unlimited'}</span >
                    </p >
                    <p className="text-gray-700" >
                        Date: <span
                        className="font-bold" >{new Date(eventDateTime.toDate()).toLocaleDateString()}</span >
                    </p >
                </div >
                <div >
                    <p className={`text-gray-900 font-bold mt-2 p-2 rounded ${statusBgColor} inline-block`} >
                        {statusText}
                    </p >
                </div >
            </div >
        </div >

    );
};

export default HostEventCard;
