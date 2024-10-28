import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Testimonials = () => {
    const [ testimonials, setTestimonials ] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const testimonialsCollection = collection(db, 'Testimonials');
                const snapshot = await getDocs(testimonialsCollection);
                const testimonialsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setTestimonials(testimonialsList);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };

        fetchTestimonials();
    }, []);

    const settings = {
        dots: false,
        infinite: testimonials.length > 1,
        speed: 1500,
        slidesToShow: Math.min(testimonials.length, 2),
        slidesToScroll: 1,
        autoplay: testimonials.length > 1,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: false,
    };

    return (
        <section className="p-8" >
            <h2 className="text-3xl font-bold mb-6 text-center" >User Testimonials</h2 >
            {testimonials.length > 0 ? (
                <Slider {...settings}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-4 bg-white shadow-md rounded-lg text-center mx-4" >
                            <p className="text-lg italic mb-2" >{testimonial.content}</p >
                            <p className="font-semibold" >{testimonial.name}</p >
                        </div >
                    ))}
                </Slider >
            ) : (
                <div className="text-center text-gray-500" >No testimonials available at this time.</div >
            )}
        </section >
    );
};

export default Testimonials;
