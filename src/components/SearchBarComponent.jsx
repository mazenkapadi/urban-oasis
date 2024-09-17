// import React, { useState } from "react";
//
// const SearchBarComponent = () => {
//     const [ searchInput, setSearchInput ] = useState("");
//     const [ searchDate, setSearchDate ] = useState("");
//
//     const handleSearch = () => {
//         console.log("Searching for:", searchInput, "on date:", searchDate);
//
//     };
//
//     return (
//         <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 flex-grow mx-16" >
//             <div className="bg-gray-700 p-2 rounded-lg" >
//                 <input
//                     type="text"
//                     value="zip/city"
//                     readOnly
//                     className="bg-transparent border-none outline-none text-white w-32 text-center"
//                 />
//             </div >
//             <input
//                 type="date"
//                 value={searchDate}
//                 onChange={(e) => setSearchDate(e.target.value)}
//                 className="bg-gray-700 p-2 rounded-lg outline-none text-white date-picker"
//             />
//             <input
//                 type="text"
//                 placeholder="Search for events..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 className="bg-gray-700 p-2 rounded-lg flex-grow outline-none"
//             />
//             <button
//                 className="rounded-lg bg-white text-gray-800 px-6 py-2 flex items-center justify-center"
//                 onClick={handleSearch}
//             >
//                 Search
//             </button >
//         </div >
//     );
// };
//
// export default SearchBarComponent;


import React, { useState } from "react";

const SearchBarComponent = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [zipcode, setZipcode] = useState("");

    const handleSearch = () => {
        console.log("Searching for:", searchInput, "on date:", searchDate, "in zipcode:", zipcode);
    };

    return (
        <div className="flex items-center space-x-4 rounded-lg shadow-md">
            {/* Zipcode Input */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <input
                    type="text"
                    placeholder="Zipcode"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="bg-transparent border-none outline-none text-gray-700 w-24 text-center"
                />
            </div>

            {/* Date Picker */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-gray-700 text-center"
                />
            </div>

            {/* Search Input */}
            <div className="flex-grow">
                <input
                    type="text"
                    placeholder="Search events"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-max p-2 rounded-lg outline-none bg-white text-gray-700"
                />
            </div>

            {/* Search Button */}
            <button
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBarComponent;
