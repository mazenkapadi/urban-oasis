import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig.js";
import { getDownloadURL, ref } from "firebase/storage";

const PhotoCarousel = ({ eventId }, { eventTitle }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [eventImages, setEventImages] = useState([]);
    const [isLandingPage, setIsLandingPage] = useState(false);

    const images = [
        'src/TestImages/TestImage1.jpg',
        'src/TestImages/TestImage2.jpg',
        'src/TestImages/TestImage3.jpg',
    ];

    useEffect(() => {
        const fetchEventData = async () => {
            if (eventId) {
                const docRef = doc(db, 'Events', eventId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log(docSnap.data());
                    const data = docSnap.data();

                    eventTitle = data.basicInfo.title;
                    if (data.eventDetails?.images) {
                        const imageUrls = await Promise.all(
                            data.eventDetails.images.map(async (image) => {
                                const storageRef = ref(storage, `eventImages/${eventTitle}/${image.name}`);
                                console.log("S", storageRef);
                                return await getDownloadURL(storageRef);
                            })
                        );
                        setEventImages(imageUrls);

                    }
                } else {
                    setIsLandingPage(true);
                    console.log('No such document!');
                }
            }
        };
        fetchEventData();
    }, [eventId]);

    const NextArrow = ({ onClick }) => (
        <div
            className="absolute top-0 right-0 h-full w-10 z-10 cursor-pointer flex items-center justify-center bg-gradient-to-l from-gray-800 to-transparent hover:bg-gradient-to-l hover:from-gray-600 opacity-75"
            onClick={onClick}
        >
            <ChevronRightIcon className="w-8 h-8 text-white" />
        </div>
    );

    const PrevArrow = ({ onClick }) => (
        <div
            className="absolute top-0 left-0 h-full w-10 z-10 cursor-pointer flex items-center justify-center bg-gradient-to-r from-gray-800 to-transparent hover:bg-gradient-to-r hover:from-gray-600 opacity-75"
            onClick={onClick}
        >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
        </div>
    );

    const carouselSettings = {
        dots: false,
        infinite: (isLandingPage ? images.length > 1 : eventImages.length > 1),
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        centerMode: (isLandingPage ? images.length > 1 : eventImages.length > 1),
        centerPadding: (isLandingPage ? images.length > 1 : eventImages.length > 1) ? '20px' : '0px',
        variableWidth: (isLandingPage ? images.length > 1 : eventImages.length > 1),
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: (isLandingPage ? images.length > 1 : eventImages.length > 1),
                    centerPadding: (isLandingPage ? images.length > 1 : eventImages.length > 1) ? '40px' : '0px',
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: (isLandingPage ? images.length > 1 : eventImages.length > 1),
                    centerPadding: (isLandingPage ? images.length > 1 : eventImages.length > 1) ? '30px' : '0px',
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="relative items-center justify-center ">
            <Slider {...carouselSettings}>
                {isLandingPage ? (
                    images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative ${index === activeSlide ? 'opacity-100' : 'opacity-50 hover:opacity-75 transition-opacity duration-300 ease-in-out'} flex px-4`}
                        >
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-[400px] h-[300px] object-cover rounded-lg"
                            />
                        </div>
                    ))
                ) : (
                    eventImages.map((imageUrl, index) => (
                        <div
                            key={index}
                            className={`relative ${index === activeSlide ? 'opacity-100' : 'opacity-50 hover:opacity-75 transition-opacity duration-300 ease-in-out'} flex px-4`}
                        >
                            <img
                                src={imageUrl}
                                alt={`Event Image`}
                                className="w-[400px] h-[300px] object-cover rounded-lg"
                            />
                        </div>
                    ))
                )}
            </Slider>
        </div>
    );
};

export default PhotoCarousel;
