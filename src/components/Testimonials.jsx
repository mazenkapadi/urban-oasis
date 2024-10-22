import React from 'react';
import Slider from 'react-slick';

const Testimonials = () => {
    const testimonials = [
        {
            name: "John Doe",
            text: "This platform has transformed the way I manage events! Highly recommend.",
            image: "path/to/john.jpg",
        },
        {
            name: "Jane Smith",
            text: "I love the user-friendly interface and the seamless RSVP process.",
            image: "path/to/jane.jpg",
        },
        {
            name: "Emily Johnson",
            text: "The experience has been nothing short of amazing. Everything works flawlessly!",
            image: "path/to/emily.jpg",
        },
        {
            name: "Michael Brown",
            text: "Best event management platform I've used. It makes everything so easy.",
            image: "path/to/michael.jpg",
        },
        {
            name: "Sarah Wilson",
            text: "Simple and intuitive interface, I can’t imagine organizing events without it now.",
            image: "path/to/sarah.jpg",
        },
        {
            name: "Daniel Davis",
            text: "Their customer support is top-notch! Quick responses and very helpful.",
            image: "path/to/daniel.jpg",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        arrows: false,
        showDots: false,
    };

    return (
        <section className="p-8" >
            <h2 className="text-3xl font-bold mb-6 text-center" >User Testimonials</h2 >
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-white shadow-md rounded-lg text-center mx-4" >
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                        <p className="text-lg italic mb-2" >{testimonial.text}</p >
                        <p className="font-semibold" >{testimonial.name}</p >
                    </div >
                ))}
            </Slider >
        </section >
    );
};

export default Testimonials;
