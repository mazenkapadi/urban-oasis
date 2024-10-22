import React, {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../firebaseConfig.js";
import LoadingPage from "./LoadingPage.jsx";
import {addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import HeaderComponent from "../components/HeaderComponent.jsx";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    ListItemIcon,
    ListItemText,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Person2TwoToneIcon from '@mui/icons-material/Person2TwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import GradeTwoToneIcon from '@mui/icons-material/GradeTwoTone';
import SendIcon from '@mui/icons-material/Send';
import FooterComponent from "../components/FooterComponent.jsx";
import StarIcon from '@mui/icons-material/Star';
import {useParams} from "react-router-dom";


const HostProfilePage = () => {
    const [userId, setUserId] = useState(null);
    const {hostId} = useParams();
    const [loading, setLoading] = useState(true);
    const [hostDetails, setHostDetails] = useState({
        bio: '',
        profilePic: '',
        email: '',
        firstName: '',
        lastName: '',
        ratings: 0,
    });
    const [value, setValue] = useState(2);
    const [review, setReview] = useState('');
    const [error, setError] = useState(null);
    const [reviewDetails, setReviewDetails] = useState([])

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
                const reviewData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReviewDetails(reviewData);
            }
            setLoading(false);
        };

        fetchEventData();
    }, [userId]);


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
                    ratingsTotaled: updatedRatingsTotaled || 0,
                    numRatings: updatedNumRatings|| 0,
                    overall: updatedOverall || 0
                }
            });
        } catch (error) {
            setError(error.message);
        }
    }

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <>
            <HeaderComponent/>
            <div className="host-profile-page">
                <div
                    className="flex justify-center items-center py-10 px-4 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen">
                    <div className="box-border w-full max-w-5xl rounded-lg bg-gray-900 shadow-lg h-full p-6">
                        <div className="flex">
                            <Avatar
                                alt={hostDetails.firstName}
                                src={hostDetails.profilePic}
                                sx={{width: 280, height: 280}}
                            />
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Person2TwoToneIcon color="primary" sx={{fontSize: 40}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.firstName + ' ' + hostDetails.lastName}
                                        primaryTypographyProps={{
                                            fontWeight: 'medium',
                                            fontSize: '30px',
                                            color: 'white',
                                        }}
                                    />
                                </ListItem>,
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailTwoToneIcon color="primary" sx={{fontSize: 40}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.email}
                                        primaryTypographyProps={{
                                            fontWeight: 'medium',
                                            fontSize: '30px',
                                            color: 'white',
                                        }}
                                    />
                                </ListItem>,
                                <ListItem>
                                    <ListItemIcon>
                                        <GradeTwoToneIcon color="primary" sx={{fontSize: 40}}/>
                                    </ListItemIcon>
                                    <Rating
                                        name="read-only"
                                        value={hostDetails.ratings}
                                        readOnly
                                        size="large"
                                        precision={0.2}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        // sx={{
                                        //     bgcolor: 'rgb(107 114 128)',
                                        // }}
                                    />
                                </ListItem>,
                            </List>


                        </div>

                        <div
                            className="flex flex-col p-2 w-full h-fit bg-gray-500 bg-opacity-30 border-4 border-gray-500 rounded-lg gap-2">
                            <p className="text-white text-2xl font-bold">Add Review</p>
                            <Rating
                                name="simple-controlled"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                            />
                            <TextField
                                id="outline-multiline-flexible"
                                label="Enter Review"
                                onChange={(e) => setReview(e.target.value)}
                                sx={{
                                    label: {color: 'white'},
                                    bgcolor: 'rgb(17 24 39)',
                                    input: {color: 'white'},
                                }}
                            />
                            <Button variant="contained" endIcon={<SendIcon/>} onClick={handleSubmit}>
                                Send
                            </Button>
                        </div>

                        <div className="w-full pt-8">
                            <h1 className='text-3xl text-white font-bold pb-2'>Reviews</h1>
                            {reviewDetails.length > 0 ? (
                                reviewDetails.map((review, index) => (
                                    <Card variant="outlined"
                                          key={index}
                                          sx={{
                                              bgcolor: 'rgb(107 114 128)',
                                              marginBottom: '15px'
                                          }}
                                    >
                                        <CardContent>
                                            <Rating
                                                name="read-only"
                                                value={review.rating}
                                                readOnly
                                            />
                                            <Typography variant="h5" component="div">
                                                {review.review}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-white">No reviews yet.</p>
                            )}
                        </div>

                    </div>
                </div>
                <FooterComponent/>
            </div>
        </>

    );

};

export default HostProfilePage;