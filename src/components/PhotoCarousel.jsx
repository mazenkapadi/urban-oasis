import React, { useState } from 'react';
import Slider from 'react-slick';


const PhotoCarousel = () => {
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        centerMode: true,
        centerPadding: '60px px-20',
        variableWidth: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px px-10',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px px-10',
                    slidesToShow: 1
                }
            }
        ],
        nextArrow: (
            <div >
                <div className="next-slick-arrow" >
                    <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960"
                         width="24" >
                        <path
                            d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
                    </svg >
                </div >
            </div >
        ),

        prevArrow: (
            <div >
                <div className="next-slick-arrow rotate-180" >
                    <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960"
                         width="24" >
                        <path
                            d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
                    </svg >
                </div >
            </div >
        ),
        afterChange: (currentSlide) => {
            setActiveSlide(currentSlide);
        },
    };

    const [ activeSlide, setActiveSlide ] = useState(0);
    const images = [
        'src/TestImages/TestImage1.jpg',
        'src/TestImages/TestImage2.jpg',
        'src/TestImages/TestImage3.jpg',
    ];

    return (
        <div className="items-center justify-center p-8 " >
            <Slider {...carouselSettings}>
                {images.map((image, index) => (
                    <div key={index}
                         className={`relative ${index === activeSlide ? 'opacity-100' : 'opacity-50 hover:opacity-75 transition duration-300 ease-in-out'} flex px-4`} >
                        <img src={image} alt={`Image ${index + 1}`}
                             className="w-[400px] h-[300px] object-cover rounded-lg" />
                    </div >
                ))}
            </Slider >
        </div >
    )
        ;
};

export default PhotoCarousel;

