import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import {ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/20/solid';
import {useParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db, storage} from "../firebaseConfig.js";
import {getDownloadURL, ref} from "firebase/storage";

const PhotoCarousel = ({eventId, eventTitle}) => {
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

                    if (data.eventDetails?.images) {
                        const imageUrls = await Promise.all(
                            data.eventDetails.images.map(async (image) => {
                                const storageRef = ref(storage, `eventImages/${eventTitle}/${image.name}`);
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

    const NextArrow = ({onClick}) => (
        <div
            className="absolute top-0 right-0 h-full w-10 z-10 cursor-pointer flex items-center justify-center bg-gradient-to-l from-gray-800 to-transparent hover:bg-gradient-to-l hover:from-gray-600 opacity-75"
            onClick={onClick}
        >
            <ChevronRightIcon className="w-8 h-8 text-white"/>
        </div>
    );

    const PrevArrow = ({onClick}) => (
        <div
            className="absolute top-0 left-0 h-full w-10 z-10 cursor-pointer flex items-center justify-center bg-gradient-to-r from-gray-800 to-transparent hover:bg-gradient-to-r hover:from-gray-600 opacity-75"
            onClick={onClick}
        >
            <ChevronLeftIcon className="w-8 h-8 text-white"/>
        </div>
    );


    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        centerMode: true,
        centerPadding: '20px',
        variableWidth: true,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '30px',
                    slidesToShow: 1,
                },
            },
        ],
        afterChange: (currentSlide) => {
            setActiveSlide(currentSlide);
        },
    };


    return (
        <div className="relative items-center justify-center p-8">
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
