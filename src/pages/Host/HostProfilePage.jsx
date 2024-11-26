import React, {useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../../firebaseConfig.js";
import LoadingPage from "../service/LoadingPage.jsx";
import {addDoc, collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc} from "firebase/firestore";
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
    const [reviewerDetails, setReviewerDetails] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);


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
        return <LoadingPage/>;
    }

    return (
        <>

            <div
                className="host-profile-page flex-col min-h-screen flex pt-2 px-4" style={{backgroundColor: 'var(--secondary-dark-2)'}}>
                <HeaderComponent/>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-24">

                    <div className="rounded-lg shadow-lg p-6 space-y-2 " style={{backgroundColor: 'var(--primary-dark)'}}>

                        <div
                            className="p-4 rounded-lg shadow-lg flex space-x-4 items-center justify-between " style={{backgroundColor: 'var(--secondary-dark-2)'}}>
                            <div className="flex flex-row justify-center items-center">
                                <Avatar alt={hostDetails.firstName} src={hostDetails.profilePic}
                                        sx={{width: 100, height: 100}}/>
                                <Typography variant="p" component="div" className="text-4xl text-primary-light font-bold pl-3">
                                    {`${hostDetails.firstName} ${hostDetails.lastName}`}
                                </Typography>
                            </div>

                            <Rating className="" name="read-only" value={hostDetails.ratings} readOnly size="large"
                                    precision={0.1}/>
                        </div>

                        <div className="flex space-x-8 pb-36">
                            <List className="text-primary-light space-y-12">
                                <ListItem>
                                    <ListItemIcon><EmailTwoToneIcon color="primary" sx={{fontSize: 40}}/></ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.email}
                                        primaryTypographyProps={{fontWeight: 'medium', fontSize: '30px'}}
                                    />
                                </ListItem>
                                <ListItem className="justify-center items-center">
                                    <ListItemIcon><InfoTwoToneIcon color="primary" sx={{fontSize: 40}}/></ListItemIcon>
                                    <ListItemText
                                        primary={hostDetails.bio}
                                        primaryTypographyProps={{fontWeight: 'medium', fontSize: '30px'}}
                                    />
                                </ListItem>
                            </List>
                        </div>

                        <div className="bg-opacity-30 border-4 rounded-lg p-6 space-y-6" style={{backgroundColor: 'var(--secondary-dark-1)', borderColor: 'var(--secondary-dark-2)'}}>
                            <div className="flex flex-row justify-between">
                                <Typography variant="h5" component="div" className="text-primary-light">Add Review</Typography>
                                <Rating name="simple-controlled" value={value}
                                        onChange={(event, newValue) => setValue(newValue)} size="large"/>
                            </div>

                            <TextField
                                label="Enter Review"
                                onChange={(e) => setReview(e.target.value)}
                                fullWidth
                                multiline
                                slotProps={{input: {style: {color: 'white'}}}}
                                sx={{
                                    label: {color: 'var(--primary-light)'},
                                    bgcolor: 'var(--primary-dark)',
                                    borderRadius: '.5rem',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderRadius: '.5rem',
                                            input: {color: 'var(--primary-light)'},
                                        },
                                    },
                                }}
                            />
                            <Button variant="contained" endIcon={<SendIcon/>} onClick={handleSubmit} fullWidth
                                    className="btn btn-primary">
                                Send
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg shadow-lg p-6 space-y-8 " style={{backgroundColor: 'var(--primary-dark)'}}>
                        <div>
                            <Typography variant="h5" component="div" className="text-primary-light mb-4"
                                        sx={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '36px'
                                        }}>Reviews</Typography>
                            <h5 className="mb-4 border-b-2 pb-2" style={{borderColor: 'var(--secondary-light-2)'}}></h5>
                        </div>

                        <div style={{maxHeight: '625px', overflowY: 'auto'}}>
                            {reviewDetails.length > 0 ? (
                                reviewDetails.map((review, index) => (
                                    <Card key={index}
                                          sx={{
                                              bgcolor: 'var(--secondary-light-2)',
                                              borderRadius: '16px',
                                              padding: '16px',
                                              marginBottom: '20px',
                                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                          }}>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <Typography variant="p" component="div" color="primary-light"
                                                            className="text-2xl font-bold">
                                                    {review.reviewerDetails ? `${review.reviewerDetails.firstName} ${review.reviewerDetails.lastName}` : 'Reviewer Not Found'}
                                                </Typography>
                                                <Rating value={review.rating} readOnly size="large"/>
                                            </div>
                                            <div>
                                                <Typography variant="p" component="div"
                                                            color="textSecondary">
                                                    {review.createdAt.toDate().toLocaleDateString()}
                                                </Typography>
                                            </div>
                                            <h5 className="mb-4 border-b-2 pb-2" style={{borderColor: 'var(--secondary-light-2)'}}></h5>

                                            <Typography variant="body2" color="textSecondary"
                                                        sx={{
                                                            marginTop: '8px',
                                                            fontSize: '20px',
                                                            whiteSpace: 'pre-line',
                                                            wordWrap: 'break-word',
                                                            overflowWrap: 'break-word'
                                                        }}>
                                                {review.review}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body1" component="div" className="text-primary-light">No reviews
                                    yet.</Typography>
                            )}
                        </div>


                    </div>
                </div>
            </div>
            <Modal open={modalOpen} onClose={handleModalClose}>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-white rounded-lg shadow-lg p-8">
                    <h2 className="text-h3 font-semibold text-neutral-black mb-4 text-center font-archivo">Review
                        Sent</h2>
                    <p className="text-body text-detail-gray text-center mb-6 font-inter">
                        Your review has been submitted.
                    </p>
                    <Button
                        onClick={handleModalClose}
                        variant="contained"
                        color="primary"
                        className="mt-4 w-full bg-accent-blue hover:bg-primary-dark text-neutral-white py-2 rounded-lg font-medium"
                    >
                        Close
                    </Button>
                </div>
            </Modal>
            <FooterComponent/>
        </>

    );

};

export default HostProfilePage;