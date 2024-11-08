import React, { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig.js";
import useEmblaCarousel from "embla-carousel-react";
import '../../index.css';

const HeroCarousel = () => {
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // Track the active index
    const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: 'start' });

    useEffect(() => {
        const fetchImages = async () => {
            const eventImagesRef = ref(storage, "eventImages/");
            try {
                const imageFiles = await listAll(eventImagesRef);
                const imageUrls = await Promise.all(
                    imageFiles.items.map(async (imageRef) => {
                        const imageUrl = await getDownloadURL(imageRef);
                        return imageUrl;
                    })
                );
                setImages(imageUrls);
            } catch (error) {
                console.error("Error fetching images: ", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (embla && images.length > 0) {
            const intervalId = setInterval(() => {
                embla.scrollNext();
            }, 8000);

            // Update active index when the carousel changes
            embla.on("select", () => {
                setActiveIndex(embla.selectedScrollSnap());
            });

            return () => clearInterval(intervalId);
        }
    }, [embla, images.length]);

    return (
        <div className="relative h-screen overflow-hidden">
            <div className="embla h-full" ref={viewportRef}>
                <div className="embla__container flex h-full">
                    {images.length > 0 ? (
                        images.map((url, index) => (
                            <div
                                className={`embla__slide h-full flex-shrink-0 fade-transition ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                                key={index}
                            >
                                <img
                                    src={url}
                                    alt={`Slide ${index}`}
                                    className="w-full h-full object-cover hero-shadow-lg"
                                    style={{ height: "100vh", width: "100vw" }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="embla__slide h-full flex-shrink-0">
                            <p className="text-center text-lg text-gray-500">No images available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
