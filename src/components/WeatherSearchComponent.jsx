// import { useState, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// const SearchBar = ({ setCity, fetchWeather }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       if (searchTerm.length > 2) {
//         fetchSuggestions();
//       } else {
//         setSuggestions([]);
//       }
//     }, 300); // Delay of 300ms

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm]);

//   const fetchSuggestions = async () => {
//     try {
//       const response = await fetch(
//         `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch suggestions.");
//       }

//       const data = await response.json();
//       setSuggestions(data);
//     } catch (error) {
//       console.error(error);
//       setSuggestions([]);
//     }
//   };

//   const handleSelectSuggestion = (cityName) => {
//     setSearchTerm(cityName);
//     setSuggestions([]);
//     setCity(cityName);
//     fetchWeather(cityName);
//   };

//   return (
//     <div className="w-full max-w-md relative">
//       <input
//         type="text"
//         placeholder="Enter city name"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-3 border border-gray-300 focus:border-gray-900 rounded-full mb-4 text-gray-700 focus:outline-none"
//       />
//       <span
//         onClick={() => fetchWeather(searchTerm)}
//         className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
//       >
//         <MagnifyingGlassIcon className="h-5 w-5 mb-4" />
//       </span>
//       {suggestions.length > 0 && (
//         <ul className="absolute w-full bg-white shadow-md max-h-48 overflow-y-auto z-10">
//           {suggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               onClick={() =>
//                 handleSelectSuggestion(
//                   `${suggestion.name}, ${suggestion.country}`
//                 )
//               }
//               className="p-2 hover:bg-blue-100 cursor-pointer"
//             >
//               {suggestion.name}, {suggestion.country}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;
