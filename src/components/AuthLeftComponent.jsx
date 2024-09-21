import {
    CalendarDaysIcon,
    UserGroupIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline'

function AuthLeftComponent() {
    return (
        <div className="flex w-full items-center justify-center h-screen bg-gray-900 p-8" >
            <div className="leftColumn w-full max-w-lg p-8" >
                <h2 className="text-4xl text-gray-200 mb-8 font-archivo" >Urban Oasis</h2 >
                <div className="flex items-start mb-6" >
                    <CalendarDaysIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >Connect Your Community</h4 >
                        <p className="text-gray-400" >Discover local events and connect with your neighbors</p >
                    </div >
                </div >

                <div className="flex items-start mb-6" >
                    <UserGroupIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >Ease of Use</h4 >
                        <p className="text-gray-400" >Effortless event creation and seamless registration</p >
                    </div >
                </div >

                <div className="flex items-start mb-6" >
                    <PresentationChartLineIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >Flexibility</h4 >
                        <p className="text-gray-400" >From block parties to music festivals, we've got you covered</p >
                    </div >
                </div >
            </div >

        </div >
    );
}

export default AuthLeftComponent;