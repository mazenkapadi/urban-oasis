import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const testimonialsCollection = collection(db, 'Testimonials');
                const snapshot = await getDocs(testimonialsCollection);
                const testimonialsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTestimonials(testimonialsList);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const settings = {
        dots: true,
        infinite: testimonials.length > 1,
        speed: 2000,
        slidesToShow: Math.min(testimonials.length, 2),
        slidesToScroll: 1,
        autoplay: testimonials.length > 1,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false,
        centerMode: true,
        centerPadding: "20px",
    };

    return (
        <div className="">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary-dark">User Testimonials</h2>
            {loading ? (
                <div className="text-center text-gray-500">Loading testimonials...</div>
            ) : testimonials.length > 0 ? (
                <Slider {...settings}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-4 px-10mx-4">
                            <div className="bg-white shadow-md rounded-lg text-center p-2 transition-transform duration-300">
                                <p className="text-lg italic mb-4 text-primary-dark">{testimonial.content}</p>
                                <p className="font-semibold text-accent-blue">- {testimonial.name}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="text-center text-gray-500">No testimonials available at this time.</div>
            )}
        </div>
    );
};

export default Testimonials;
