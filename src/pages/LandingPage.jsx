// import { useNavigate } from "react-router-dom";
// import HeaderComponent from "../components/HeaderComponent.jsx";
// import FooterComponent from "../components/FooterComponent.jsx";
// import EventCarousel from "../components/EventCarousel.jsx";
// import PhotoCarousel from "../components/PhotoCarousel.jsx";
// import React from "react";
//
// function LandingPage() {
//
//     const images = [
//         'https://via.placeholder.com/600x400?text=Slide+1',
//         'https://via.placeholder.com/600x400?text=Slide+2',
//         'https://via.placeholder.com/600x400?text=Slide+3',
//     ];
//
//     return (
//         <>
//             <HeaderComponent />
//             <div className="pt-24">
//                 <div className="container mx-auto px-6 py-12" >
//                     <div className="text-center mb-16" >
//                         <h1 className="text-5xl font-bold mb-6 text-gray-800" >Welcome to UrbanOasis</h1 >
//                         <p className="text-xl text-gray-600" >Discover events and manage your community seamlessly</p >
//                     </div >
//                     <div className="space-y-16" >
//                         <div className="photo-carousel" >
//                             <PhotoCarousel images={images} />
//                         </div >
//                         <div className="event-carousel" >
//                             <EventCarousel />
//                         </div >
//                     </div >
//                 </div >
//             </div >
//             <FooterComponent />
//         </>
//     );
//
// }
//
// export default LandingPage;



import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Users } from "lucide-react"
import HeaderComponent from "../components/HeaderComponent"
import FooterComponent from "../components/FooterComponent"
import EventCarousel from "../components/EventCarousel"
import PhotoCarousel from "../components/PhotoCarousel"

export default function LandingPage() {
    const navigate = useNavigate()

    const images = [
        '/placeholder.svg?height=400&width=600&text=Community+Event',
        '/placeholder.svg?height=400&width=600&text=Local+Gathering',
        '/placeholder.svg?height=400&width=600&text=Neighborhood+Festival',
    ]

    const features = [
        { icon: Search, title: "Discover Events", description: "Find exciting local events tailored to your interests." },
        { icon: Calendar, title: "Easy Scheduling", description: "Effortlessly plan and manage your community activities." },
        { icon: Users, title: "Connect with Neighbors", description: "Build stronger bonds within your community." },
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderComponent />
            <main className="flex-grow">
                <section className="pt-24 pb-12 bg-gradient-to-b from-primary/20 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">Welcome to UrbanOasis</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Discover events, manage your community, and connect with neighbors seamlessly
                            </p>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <form className="flex gap-4 mb-8" onSubmit={(e) => e.preventDefault()}>
                                <Input type="text" placeholder="Search events..." className="flex-grow" />
                                <Button type="submit">Search</Button>
                            </form>
                        </div>
                        <div className="mb-16">
                            <PhotoCarousel images={images} />
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
                        <EventCarousel />
                        <div className="text-center mt-8">
                            <Button onClick={() => navigate('/events')}>View All Events</Button>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose UrbanOasis?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Start exploring events, connecting with neighbors, and making a difference in your local area.
                        </p>
                        <Button size="lg" onClick={() => navigate('/signup')}>Sign Up Now</Button>
                    </div>
                </section>
            </main>
            <FooterComponent />
        </div>
    )
}