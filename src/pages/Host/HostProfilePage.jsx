import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig.js";
import LoadingPage from "../service/LoadingPage.jsx";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    Timestamp,
    where
} from "firebase/firestore";
import HeaderComponent from "../../components/HeaderComponent.jsx";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    ListItemIcon,
    ListItemText, Modal,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import SendIcon from '@mui/icons-material/Send';
import FooterComponent from "../../components/FooterComponent.jsx";
import { useParams } from "react-router-dom";
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '/tailwind.config.js';
import StarBorderPurple500SharpIcon from '@mui/icons-material/StarBorderPurple500Sharp';
import themeManager from "../../utils/themeManager.jsx";
import EventCard from "../../components/EventCards/EventCard.jsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


const HostProfilePage = () => {
    const fullConfig = resolveConfig(tailwindConfig);
    const colors = fullConfig.theme.colors;
    const [ userId, setUserId ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ hostDetails, setHostDetails ] = useState({
        bio: '',
        profilePic: '',
        email: '',
        firstName: '',
        lastName: '',
        ratings: 0,
    });
    const [ value, setValue ] = useState(0);
    const [ review, setReview ] = useState('');
    const [ error, setError ] = useState(null);
    const [ reviewDetails, setReviewDetails ] = useState([]);
    const {hostId} = useParams();
    const [ reviewerDetails, setReviewerDetails ] = useState([]);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ hostedEvents, setHostedEvents ] = useState([]);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {

            // Fetch host data if available
            if (hostId) {
                const hostDocRef = doc(db, 'Users', hostId);
                const hostDocSnap = await getDoc(hostDocRef);
                if (hostDocSnap.exists()) {
                    const hostData = hostDocSnap.data();
                    setHostDetails({
                        bio: hostData.bio || '',
                        profilePic: hostData.profilePic || '',
                        firstName: hostData.name.firstName || '',
                        lastName: hostData.name.lastName || '',
                        ratings: hostData.ratings.overall || 0,
                        email: hostData.contact.email || '',

                    });
                }
                // const reviewDocRef = collection(db, 'Users', userId, 'Ratings');
                // const reviewDocSnap = await getDocs(reviewDocRef);
                // if (reviewDocSnap.exists()) {
                //     const reviewData = reviewDocSnap.data();
                //     setReviewDetails(reviewData);
                // }
                const querySnapshot = await getDocs(collection(db, "Users", hostId, 'Ratings'));
                const reviewsWithUserInfo = await Promise.all(querySnapshot.docs.map(async (docs) => {
                    const reviewData = docs.data();
                    const reviewerId = reviewData.user;

                    const userDocRef = doc(db, 'Users', reviewerId);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        return {
                            id: doc.id,
                            ...reviewData,
                            reviewerDetails: {
                                firstName: userData.name.firstName,
                                lastName: userData.name.lastName,
                            }
                        };
                    }

                }));

                setReviewDetails(reviewsWithUserInfo);
            }
            setLoading(false);

        };

        fetchEventData();
        fetchHostedEvents(hostId);
    }, [ hostId ]);

    const fetchHostedEvents = async (hostId) => {
        try {
            const eventsRef = collection(db, 'Events');
            const q = query(eventsRef, where('hostId', '==', hostId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const events = await Promise.all(
                    querySnapshot.docs.map(async (eventDoc) => {
                        const eventData = eventDoc.data();
                        const eventId = eventDoc.id;

                        // Fetch attendeesCount from EventRSVPs
                        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
                        const eventRsvpsSnap = await getDoc(eventRsvpsDocRef);
                        let attendeesCount = 0;
                        if (eventRsvpsSnap.exists()) {
                            const eventRsvps = eventRsvpsSnap.data().rsvps || {};
                            attendeesCount = Object.values(eventRsvps).reduce(
                                (acc, rsvp) => acc + (rsvp.quantity || 0),
                                0
                            );
                        }

                        return {
                            id: eventId,
                            ...eventData,
                            attendeesCount: attendeesCount,
                        };
                    })
                );
                setHostedEvents(events);
            }
        } catch (err) {
            console.error('Error fetching hosted events:', err);
            setError('An error occurred while fetching hosted events.');
        }
    };

    const currentDateTime = new Date();

    // Combine past and future events with a status tag
    const allEvents = hostedEvents.map(event => {
        const eventDate = event.eventDetails.eventDateTime.toDate();
        return {
            ...event,
            status: eventDate > currentDateTime ? 'Future' : 'Past'
        };
    });

    const futureEvents = allEvents.filter(event => event.status === 'Future');

    const displayedEvents = [ ...futureEvents ];
    // const calculateAverageRating = (ratingsTotaled) => {
    //     if (!ratingsTotaled) return 0;
    //     const totalRating = ;
    //     return totalRating / ratingsTotaled.length;
    // };

    const handleSubmit = async () => {
        try {
            if (!hostId) {
                console.error("User not authenticated.");
                return;
            }
            const newReviewRef = collection(db, 'Users', hostId, 'Ratings');
            const newReviewData = {
                rating: value,
                review: review,
                user: userId,
                createdAt: Timestamp.now(),
            };
            await addDoc(newReviewRef, newReviewData);


            const hostDocRef = doc(db, "Users", hostId);
            const hostDocSnapshot = await getDoc(hostDocRef);
            const hostData = hostDocSnapshot.data();

            const updatedRatingsTotaled = hostData.ratings.ratingsTotaled + newReviewData.rating;
            const updatedNumRatings = hostData.ratings.numRatings + 1;
            const updatedOverall = updatedRatingsTotaled / updatedNumRatings;

            await updateDoc(hostDocRef, {
                ratings: {
                    ratingsTotaled: updatedRatingsTotaled,
                    numRatings: updatedNumRatings,
                    overall: updatedOverall
                }
            });

            setModalOpen(true);
        } catch (error) {
            setError(error.message);
        }
    }

    const handleModalClose = () => {
        setModalOpen(false);
        window.location.reload();
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <>
            <div
                className={`host-profile-page flex-col min-h-screen flex pt-2 px-4 ${darkMode ? "bg-Dark-D2" : "bg-Light-L2"}`} >
                <HeaderComponent />
                <div className="pb-10" >
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-24 pb-10" >

                        <div
                            className={`rounded-lg shadow-lg p-6 space-y-2 ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} >

                            <div
                                className={`p-4 rounded-lg shadow-lg flex space-x-4 items-center justify-between ${darkMode ? "bg-Dark-D2" : "bg-Light-L2"}`} >
                                <div className="flex flex-row justify-center items-center" >
                                    <Avatar alt={hostDetails.firstName} src={hostDetails.profilePic}
                                            sx={{width: 100, height: 100}} />
                                    <Typography variant="span" component="div"
                                                className={`text-h3 font-inter font-bold pl-3 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >
                                        {`${hostDetails.firstName} ${hostDetails.lastName}`}
                                    </Typography >
                                </div >

                                <Rating className="" name="read-only" value={hostDetails.ratings} readOnly
                                        emptyIcon={<StarBorderPurple500SharpIcon
                                            sx={{
                                                color: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                                fontSize: 30,
                                            }} />} size="large"
                                        precision={0.1} />
                            </div >

                            <div className="flex space-x-8 pb-36" >
                                <List
                                    className={` space-y-12 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >
                                    <ListItem >
                                        <ListItemIcon ><EmailTwoToneIcon
                                            sx={{fontSize: 40, color: colors["accent-blue"]}} /></ListItemIcon >
                                        <span
                                            className={`font-medium text-h3 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >{hostDetails.email}</span >
                                    </ListItem >
                                    <ListItem className="justify-center items-center" >
                                        <ListItemIcon ><InfoTwoToneIcon
                                            sx={{fontSize: 40, color: colors["accent-blue"]}} /></ListItemIcon >
                                        <span
                                            className={`font-medium text-h3 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >{hostDetails.bio}</span >
                                    </ListItem >
                                </List >
                            </div >

                            <div
                                className={`bg-opacity-30 border-4 rounded-lg p-6 space-y-6 ${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} ${darkMode ? "border-Dark-D2" : "border-Light-L2"}`} >
                                <div className="flex flex-row justify-between" >
                                    <Typography variant="span" component="div"
                                                className={`text-h4 font-inter ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Add
                                        Review</Typography >
                                    <Rating
                                        name="simple-controlled"
                                        value={value}
                                        precision={0.1}
                                        onChange={(event, newValue) => setValue(newValue)}
                                        emptyIcon={
                                            <StarBorderPurple500SharpIcon
                                                sx={{
                                                    color: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                                    fontSize: 30,
                                                }}
                                            />
                                        }
                                        size="large"
                                    />
                                </div >

                                <TextField
                                    label="Enter Review"
                                    onChange={(e) => setReview(e.target.value)}
                                    fullWidth
                                    multiline
                                    slotProps={{input: {style: {color: darkMode ? colors["Light-L3"] : colors["Dark-D2"]}}}}
                                    sx={{
                                        label: {color: darkMode ? colors["primary-light"] : colors["primary-dark"]},
                                        bgcolor: darkMode ? colors["primary-dark"] : colors["primary-light"],
                                        borderRadius: '.5rem',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderRadius: '.5rem',
                                                input: {color: darkMode ? colors["primary-light"] : colors["primary-dark"]},
                                            },
                                        },
                                    }}
                                />
                                <button onClick={handleSubmit}
                                        className="button btn btn-primary w-full" >
                                    <SendIcon className="mr-3" />
                                    <span
                                        className={`text-button font-inter  ${darkMode ? "text-primary-light" : "text-primary-light"}`} >Send</span >
                                </button >
                            </div >
                        </div >

                        <div
                            className={`rounded-lg shadow-lg p-6 space-y-8 ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} >
                            <div >
                                <Typography variant="span" component="div"
                                            className={`text-h4 font-inter mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}
                                            sx={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                            }} >Reviews</Typography >
                                <div
                                    className={`mb-4 border-b-2 pb-2 ${darkMode ? "border-Light-L2" : "border-Dark-D2"}`} ></div >
                            </div >

                            <div style={{maxHeight: '625px', overflowY: 'hidden'}} >
                                {reviewDetails.length > 0 ? (
                                    reviewDetails.map((review, index) => (
                                        <Card key={index}
                                              sx={{
                                                  bgcolor: darkMode ? colors["Dark-D1"] : colors["Light-L1"],
                                                  borderRadius: '16px',
                                                  padding: '16px',
                                                  marginBottom: '20px',
                                                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                              }} >
                                            <CardContent >
                                                <div className="flex items-center justify-between" >
                                                    <Typography variant="span" component="div"
                                                                color={`${darkMode ? colors["primary-light"] : colors["primary-dark"]}`}
                                                                className="font-inter text-h4 font-bold" >
                                                        {review.reviewerDetails ? `${review.reviewerDetails.firstName} ${review.reviewerDetails.lastName}` : 'Reviewer Not Found'}
                                                    </Typography >
                                                    <Rating value={review.rating} readOnly precision={0.1}
                                                            emptyIcon={<StarBorderPurple500SharpIcon
                                                                sx={{
                                                                    color: darkMode ? colors["primary-dark"] : colors["primary-light"],
                                                                    fontSize: 30
                                                                }} />}
                                                            size="large" />
                                                </div >
                                                <div >
                                                    <Typography variant="span" component="div"
                                                                color={`${darkMode ? colors["Light-L1"] : colors["Dark-D1"]}`}
                                                                className="font-inter text-body" >
                                                        {review.createdAt.toDate().toLocaleDateString()}
                                                    </Typography >
                                                </div >
                                                <h5 className={`mb-4 border-b-2 pb-2  ${darkMode ? "border-Light-L1" : "border-Dark-D1"}`} ></h5 >

                                                <Typography variant="body2"
                                                            color={`${darkMode ? colors["Light-L2"] : colors["Dark-D2"]}`}
                                                            sx={{
                                                                marginTop: '8px',
                                                                fontSize: '20px',
                                                                whiteSpace: 'pre-line',
                                                                wordWrap: 'break-word',
                                                                overflowWrap: 'break-word'
                                                            }} >
                                                    {review.review}
                                                </Typography >
                                            </CardContent >
                                        </Card >
                                    ))
                                ) : (
                                    <Typography variant="span" component="div"
                                                className={`font-inter text-h4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >No
                                        reviews
                                        yet.</Typography >
                                )}
                            </div >


                        </div >
                    </div >
                    <div
                        className={`rounded-lg shadow-lg p-6 space-y-2 ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} >
                        <span
                            className={`text-h4 font-bold mb-1 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >This Host's Events</span >
                        <Swiper
                            modules={[ Navigation, Pagination ]}
                            spaceBetween={8}
                            slidesPerView="auto"
                            navigation={false}
                            pagination={false}
                            loop={false}
                            centeredSlides={false}
                            allowTouchMove={true}
                            freeMode={true}
                        >
                            {displayedEvents.length > 0 ? (
                                displayedEvents.map((event) => (
                                    <SwiperSlide key={event.id} style={{width: 'auto', padding: '8px'}} >
                                        <EventCard
                                            eventId={event.id}
                                            title={event.basicInfo.title}
                                            location={event.basicInfo.location.label || 'Location not specified'}
                                            date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                                            price={event.eventDetails.eventPrice}
                                            image={event.eventDetails.images[0]?.url || '/images/placeholder.png'}
                                        />
                                    </SwiperSlide >
                                ))
                            ) : (
                                <div
                                    className={`text-body text-Dark-D1 dark:text-Light-L1 text-center mt-8 w-full ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} >No
                                    events found! We're always
                                    adding new events, check back later!</div >
                            )}
                        </Swiper >
                    </div >
                </div >

            </div >
            <Modal open={modalOpen} onClose={handleModalClose} >
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg shadow-lg p-8 text-center ${darkMode ? "bg-primary-light" : "bg-primary-dark"}`} >
                    <h3 className={`text-h3 font-semibold mb-4 text-center font-archivo ${darkMode ? "text-primary-dark" : "text-primary-light"}`} >Review
                        Sent</h3 >
                    <span
                        className={`text-body text-center mb-6 font-inter ${darkMode ? "text-Dark-D2" : "text-Light-L2"}`} >
                        Your review has been submitted.
                    </span >
                    <Button
                        onClick={handleModalClose}
                        variant="contained"
                        color="primary"
                        className="mt-4 w-full btn btn-primary"
                    >
                        Close
                    </Button >
                </div >
            </Modal >
            <FooterComponent />
        </>

    );

};

export default HostProfilePage;