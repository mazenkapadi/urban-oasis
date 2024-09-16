import {
    CalendarDaysIcon,
    UserGroupIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline'

function AuthLeftComponent() {
    return (
        <div className="flex w-2/3 items-center justify-center h-screen bg-gray-900 p-8" >
            <div className="leftColumn w-full max-w-lg p-8" >
                <h2 className="text-4xl text-gray-500 mb-8 font-archivo" >Urban Oasis</h2 >
                <div className="flex items-start mb-6" >
                    <CalendarDaysIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >Community Centered Design</h4 >
                        <p className="text-gray-400" >Tailored for local connections and easy event management</p >
                    </div >
                </div >

                <div className="flex items-start mb-6" >
                    <UserGroupIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >User Friendly Experience</h4 >
                        <p className="text-gray-400" >Intuitive interface for effortless event creation and
                            participation</p >
                    </div >
                </div >

                <div className="flex items-start" >
                    <PresentationChartLineIcon className="h-6 w-6 text-gray-400 mr-4 mt-1" />
                    <div >
                        <h4 className="text-lg font-semibold text-gray-300 mb-2" >Flexible Scalability</h4 >
                        <p className="text-gray-400" >Adaptable to events of any size, from small gatherings to
                            large-scale festivals</p >
                    </div >
                </div >
            </div >

        </div >
    );
}

export default AuthLeftComponent;