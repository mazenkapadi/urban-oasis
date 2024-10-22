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
import {useParams} from "react-router-dom";
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';


const HostProfilePage = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hostDetails, setHostDetails] = useState({
        bio: '',
        profilePic: '',
        email: '',
        firstName: '',
        lastName: '',
        ratings: 0,
    });
    const [value, setValue] = useState(0);
    const [review, setReview] = useState('');
    const [error, setError] = useState(null);
    const [reviewDetails, setReviewDetails] = useState([]);
    const {hostId} = useParams();
    const [reviewerDetails, setReviewerDetails] = useState([])

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
                        setReviewerDetails({
                            firstName: userData.name.firstName,
                            lastName: userData.name.lastName,
                        });
                    }

                    return {
                        id: docs.id,
                        ...reviewData,
                        reviewerDetails,
                    };
                }));

                setReviewDetails(reviewsWithUserInfo);
            }
            setLoading(false);

        };

        fetchEventData();
    }, [hostId]);

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
            <div
                className="host-profile-page min-h-screen bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 flex justify-center items-center py-10 px-4">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-8">

                        <div
                            className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 p-4 rounded-lg shadow-lg flex space-x-4 items-center justify-center">
                            <Avatar alt={hostDetails.firstName} src={hostDetails.profilePic}
                                    sx={{width: 100, height: 100}}/>
                            <Typography variant="p" component="div" className="text-4xl text-white font-bold">
                                {`${hostDetails.firstName} ${hostDetails.lastName}`}
                            </Typography>
                        </div>

                        <div className="flex space-x-8 justify-center items-center">
                            <List className="text-white space-y-4">
                                <ListItem>
                                    <ListItemIcon><EmailTwoToneIcon color="primary" sx={{fontSize: 40}}/></ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.email}
                                        primaryTypographyProps={{fontWeight: 'medium', fontSize: '30px'}}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><GradeTwoToneIcon color="primary" sx={{fontSize: 40}}/></ListItemIcon>
                                    <Rating name="read-only" value={hostDetails.ratings} readOnly size="large"
                                            precision={0.1}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><InfoTwoToneIcon color="primary" sx={{fontSize: 40}}/></ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.bio}
                                        primaryTypographyProps={{fontWeight: 'medium', fontSize: '30px'}}
                                    />
                                </ListItem>
                            </List>
                        </div>

                        <div className="bg-gray-500 bg-opacity-30 border-4 border-gray-500 rounded-lg p-6 space-y-4">
                            <Typography variant="h5" component="div" className="text-white">Add Review</Typography>
                            <Rating name="simple-controlled" value={value}
                                    onChange={(event, newValue) => setValue(newValue)} size="large"/>
                            <TextField
                                label="Enter Review"
                                onChange={(e) => setReview(e.target.value)}
                                fullWidth
                                multiline
                                slotProps={{input: {style: {color: 'white'}}}}
                                sx={{
                                    label: {color: 'white'},
                                    bgcolor: 'rgb(17 24 39)',
                                    borderRadius: '.5rem',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderRadius: '.5rem',
                                            input: {color: 'white'},
                                        },
                                    },
                                }}
                            />
                            <Button variant="contained" endIcon={<SendIcon/>} onClick={handleSubmit} fullWidth
                                    className="rounded-lg">
                                Send
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-8 ">
                        <div>
                            <Typography variant="h5" component="div" className="text-white mb-4"
                                        sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '36px'}}>Reviews</Typography>
                            <h5 className="mb-4 border-b-2 border-gray-600 pb-2"></h5>
                        </div>

                        <div style={{maxHeight: '625px', overflowY: 'auto' }}>
                            {reviewDetails.length > 0 ? (
                                reviewDetails.map((review, index) => (
                                    <Card key={index}
                                          sx={{
                                              bgcolor: 'rgb(107 114 128)',
                                              borderRadius: '16px',
                                              padding: '16px',
                                              marginBottom: '20px',
                                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                          }}>
                                        <CardContent>
                                            <Typography variant="p" component="div" color="white"
                                                        className="text-2xl font-bold pb-4">
                                                {reviewerDetails.firstName} {reviewerDetails.lastName}
                                            </Typography>
                                            <Rating value={review.rating} readOnly size="large"/>
                                            <Typography variant="body2" color="textSecondary"
                                                        sx={{marginTop: '8px', fontSize: '24px', whiteSpace: 'pre-line'}}>
                                                {review.review}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body1" component="div" className="text-white">No reviews
                                    yet.</Typography>
                            )}
                        </div>


                    </div>
                </div>
            </div>
            <FooterComponent/>
        </>

    );

};

export default HostProfilePage;