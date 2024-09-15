import React, { useState, useRef, useEffect } from 'react';

function EventCarousel({ events }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const carouselRef = useRef(null);

    const handleScroll = (direction) => {
        const carousel = carouselRef.current;
        const scrollAmount = carousel.offsetWidth / 3; // Adjust scroll amount as needed

        setScrollPosition((prevPosition) =>
            Math.max(0, Math.min(prevPosition + (direction === 'left' ? -scrollAmount : scrollAmount), carousel.scrollWidth - carousel.offsetWidth))
        );
    };

    useEffect(() => {
        carouselRef.current.scrollLeft = scrollPosition;
    }, [scrollPosition]);

    return (
        <div className="relative">
            <div className="flex overflow-x-auto scroll-smooth" ref={carouselRef}>

            </div>

            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
                onClick={() => handleScroll('left')}
            >
                &gt;
            </button>
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
                onClick={() => handleScroll('right')}
            >
                &lt;
            </button>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gray-400 rounded-full"
                    style={{ width: `${(scrollPosition / (carouselRef.current?.scrollWidth - carouselRef.current?.offsetWidth || 1)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}

export default EventCarousel;