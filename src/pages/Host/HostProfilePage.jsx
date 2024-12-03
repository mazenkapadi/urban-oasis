// import React, {useEffect, useState} from 'react';
// import {onAuthStateChanged} from "firebase/auth";
// import {auth, db} from "../../firebaseConfig.js";
// import LoadingPage from "../service/LoadingPage.jsx";
// import {addDoc, collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc} from "firebase/firestore";
// import HeaderComponent from "../../components/HeaderComponent.jsx";
// import {
//     Avatar,
//     Button,
//     Card,
//     CardContent,
//     ListItemIcon,
//     ListItemText, Modal,
//     Rating,
//     TextField,
//     Typography
// } from "@mui/material";
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
// import SendIcon from '@mui/icons-material/Send';
// import FooterComponent from "../../components/FooterComponent.jsx";
// import {useParams} from "react-router-dom";
// import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
// import resolveConfig from 'tailwindcss/resolveConfig';
// import tailwindConfig from '/tailwind.config.js';
// import StarBorderPurple500SharpIcon from '@mui/icons-material/StarBorderPurple500Sharp';
//
//
// const HostProfilePage = () => {
//     const fullConfig = resolveConfig(tailwindConfig);
//     const colors = fullConfig.theme.colors;
//     const [userId, setUserId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [hostDetails, setHostDetails] = useState({
//         bio: '',
//         profilePic: '',
//         email: '',
//         firstName: '',
//         lastName: '',
//         ratings: 0,
//     });
//     const [value, setValue] = useState(0);
//     const [review, setReview] = useState('');
//     const [error, setError] = useState(null);
//     const [reviewDetails, setReviewDetails] = useState([]);
//     const {hostId} = useParams();
//     const [reviewerDetails, setReviewerDetails] = useState([]);
//     const [modalOpen, setModalOpen] = useState(false);
//
//
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             }
//         });
//         return () => unsubscribe();
//     }, []);
//
//     useEffect(() => {
//         const fetchEventData = async () => {
//
//             // Fetch host data if available
//             if (hostId) {
//                 const hostDocRef = doc(db, 'Users', hostId);
//                 const hostDocSnap = await getDoc(hostDocRef);
//                 if (hostDocSnap.exists()) {
//                     const hostData = hostDocSnap.data();
//                     setHostDetails({
//                         bio: hostData.bio || '',
//                         profilePic: hostData.profilePic || '',
//                         firstName: hostData.name.firstName || '',
//                         lastName: hostData.name.lastName || '',
//                         ratings: hostData.ratings.overall || 0,
//                         email: hostData.contact.email || '',
//
//                     });
//                 }
//                 // const reviewDocRef = collection(db, 'Users', userId, 'Ratings');
//                 // const reviewDocSnap = await getDocs(reviewDocRef);
//                 // if (reviewDocSnap.exists()) {
//                 //     const reviewData = reviewDocSnap.data();
//                 //     setReviewDetails(reviewData);
//                 // }
//                 const querySnapshot = await getDocs(collection(db, "Users", hostId, 'Ratings'));
//                 const reviewsWithUserInfo = await Promise.all(querySnapshot.docs.map(async (docs) => {
//                     const reviewData = docs.data();
//                     const reviewerId = reviewData.user;
//
//                     const userDocRef = doc(db, 'Users', reviewerId);
//                     const userDocSnap = await getDoc(userDocRef);
//
//                     if (userDocSnap.exists()) {
//                         const userData = userDocSnap.data();
//                         return {
//                             id: doc.id,
//                             ...reviewData,
//                             reviewerDetails: {
//                                 firstName: userData.name.firstName,
//                                 lastName: userData.name.lastName,
//                             }
//                         };
//                     }
//
//                 }));
//
//                 setReviewDetails(reviewsWithUserInfo);
//             }
//             setLoading(false);
//
//         };
//
//         fetchEventData();
//     }, [hostId]);
//
//     // const calculateAverageRating = (ratingsTotaled) => {
//     //     if (!ratingsTotaled) return 0;
//     //     const totalRating = ;
//     //     return totalRating / ratingsTotaled.length;
//     // };
//
//     const handleSubmit = async () => {
//         try {
//             if (!hostId) {
//                 console.error("User not authenticated.");
//                 return;
//             }
//             const newReviewRef = collection(db, 'Users', hostId, 'Ratings');
//             const newReviewData = {
//                 rating: value,
//                 review: review,
//                 user: userId,
//                 createdAt: Timestamp.now(),
//             };
//             await addDoc(newReviewRef, newReviewData);
//
//
//             const hostDocRef = doc(db, "Users", hostId);
//             const hostDocSnapshot = await getDoc(hostDocRef);
//             const hostData = hostDocSnapshot.data();
//
//             const updatedRatingsTotaled = hostData.ratings.ratingsTotaled + newReviewData.rating;
//             const updatedNumRatings = hostData.ratings.numRatings + 1;
//             const updatedOverall = updatedRatingsTotaled / updatedNumRatings;
//
//             await updateDoc(hostDocRef, {
//                 ratings: {
//                     ratingsTotaled: updatedRatingsTotaled,
//                     numRatings: updatedNumRatings,
//                     overall: updatedOverall
//                 }
//             });
//
//             setModalOpen(true);
//         } catch (error) {
//             setError(error.message);
//         }
//     }
//
//     const handleModalClose = () => {
//         setModalOpen(false);
//         window.location.reload();
//     };
//
//     if (loading) {
//         return <LoadingPage/>;
//     }
//
//     return (
//         <>
//             <div
//                 className="host-profile-page flex-col min-h-screen flex pt-2 px-4 bg-Dark-D2" >
//                 <HeaderComponent/>
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-24 pb-10">
//
//                     <div className="rounded-lg shadow-lg p-6 space-y-2 bg-primary-dark" >
//
//                         <div
//                             className="p-4 rounded-lg shadow-lg flex space-x-4 items-center justify-between bg-Dark-D2">
//                             <div className="flex flex-row justify-center items-center">
//                                 <Avatar alt={hostDetails.firstName} src={hostDetails.profilePic}
//                                         sx={{width: 100, height: 100}}/>
//                                 <Typography variant="span" component="div" className="text-h3 text-primary-light font-inter font-bold pl-3">
//                                     {`${hostDetails.firstName} ${hostDetails.lastName}`}
//                                 </Typography>
//                             </div>
//
//                             <Rating className="" name="read-only" value={hostDetails.ratings} readOnly emptyIcon={<StarBorderPurple500SharpIcon sx={{ color: colors["primary-light"], fontSize: 30 }}/>} size="large"
//                                     precision={0.1}/>
//                         </div>
//
//                         <div className="flex space-x-8 pb-36">
//                             <List className="text-primary-light space-y-12">
//                                 <ListItem>
//                                     <ListItemIcon><EmailTwoToneIcon sx={{fontSize: 40, color: colors["accent-blue"]}}/></ListItemIcon>
//                                     <ListItemText
//                                         primary={hostDetails.email}
//                                         primaryTypographyProps={{fontWeight: 'medium', fontSize: '1.75rem'}}
//                                     />
//                                 </ListItem>
//                                 <ListItem className="justify-center items-center">
//                                     <ListItemIcon><InfoTwoToneIcon  sx={{fontSize: 40, color: colors["accent-blue"]}}/></ListItemIcon>
//                                     <ListItemText
//                                         primary={hostDetails.bio}
//                                         primaryTypographyProps={{fontWeight: 'medium', fontSize: '1.75rem'}}
//                                     />
//                                 </ListItem>
//                             </List>
//                         </div>
//
//                         <div className="bg-opacity-30 border-4 rounded-lg p-6 space-y-6 bg-Dark-D1 border-Dark-D2" >
//                             <div className="flex flex-row justify-between">
//                                 <Typography variant="span" component="div" className="text-h4 font-inter text-primary-light">Add Review</Typography>
//                                 <Rating name="simple-controlled" value={value} precision={0.1}
//                                         onChange={(event, newValue) => setValue(newValue)} emptyIcon={<StarBorderPurple500SharpIcon sx={{ color: colors["primary-light"], fontSize: 30 }}/>} size="large"/>
//                             </div>
//
//                             <TextField
//                                 label="Enter Review"
//                                 onChange={(e) => setReview(e.target.value)}
//                                 fullWidth
//                                 multiline
//                                 slotProps={{input: {style: {color: colors["Light-L3"]}}}}
//                                 sx={{
//                                     label: {color: colors["primary-light"]},
//                                     bgcolor: colors["primary-dark"],
//                                     borderRadius: '.5rem',
//                                     '& .MuiOutlinedInput-root': {
//                                         '& fieldset': {
//                                             borderRadius: '.5rem',
//                                             input: {color: colors["primary-light"]},
//                                         },
//                                     },
//                                 }}
//                             />
//                             <button onClick={handleSubmit}
//                                     className="button btn btn-primary w-full">
//                                 <SendIcon className="mr-3"/>
//                                 <span className="text-button font-inter text-primary-light">Send</span>
//                             </button>
//                         </div>
//                     </div>
//
//                     <div className="rounded-lg shadow-lg p-6 space-y-8 bg-primary-dark">
//                         <div>
//                             <Typography variant="span" component="div" className="text-h4 font-inter text-primary-light mb-4"
//                                         sx={{
//                                             textAlign: 'center',
//                                             fontWeight: 'bold',
//                                         }}>Reviews</Typography>
//                             <div className="mb-4 border-b-2 pb-2 border-Light-L2" ></div>
//                         </div>
//
//                         <div style={{maxHeight: '625px', overflowY: 'hidden'}}>
//                             {reviewDetails.length > 0 ? (
//                                 reviewDetails.map((review, index) => (
//                                     <Card key={index}
//                                           sx={{
//                                               bgcolor: colors["Light-L1"],
//                                               borderRadius: '16px',
//                                               padding: '16px',
//                                               marginBottom: '20px',
//                                               boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
//                                           }}>
//                                         <CardContent>
//                                             <div className="flex items-center justify-between">
//                                                 <Typography variant="span" component="div" color="primary-light"
//                                                             className="font-inter text-h4 font-bold">
//                                                     {review.reviewerDetails ? `${review.reviewerDetails.firstName} ${review.reviewerDetails.lastName}` : 'Reviewer Not Found'}
//                                                 </Typography>
//                                                 <Rating value={review.rating} readOnly precision={0.1} emptyIcon={<StarBorderPurple500SharpIcon sx={{ color: colors["primary-dark"], fontSize: 30 }}/>} size="large"/>
//                                             </div>
//                                             <div>
//                                                 <Typography variant="span" component="div"
//                                                             color="Light-L1" className="font-inter text-body">
//                                                     {review.createdAt.toDate().toLocaleDateString()}
//                                                 </Typography>
//                                             </div>
//                                             <h5 className="mb-4 border-b-2 pb-2 border-Dark-D1"></h5>
//
//                                             <Typography variant="body2" color="Dark-D2"
//                                                         sx={{
//                                                             marginTop: '8px',
//                                                             fontSize: '20px',
//                                                             whiteSpace: 'pre-line',
//                                                             wordWrap: 'break-word',
//                                                             overflowWrap: 'break-word'
//                                                         }}>
//                                                 {review.review}
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>
//                                 ))
//                             ) : (
//                                 <Typography variant="span" component="div" className="font-inter text-h4 text-primary-light">No reviews
//                                     yet.</Typography>
//                             )}
//                         </div>
//
//
//                     </div>
//                 </div>
//             </div>
//             <Modal open={modalOpen} onClose={handleModalClose}>
//                 <div
//                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-primary-light rounded-lg shadow-lg p-8 text-center">
//                     <h3 className="text-h3 font-semibold text-primary-dark mb-4 text-center font-archivo">Review
//                         Sent</h3>
//                     <span className="text-body text-Dark-D2 text-center mb-6 font-inter">
//                         Your review has been submitted.
//                     </span>
//                     <Button
//                         onClick={handleModalClose}
//                         variant="contained"
//                         color="primary"
//                         className="mt-4 w-full btn btn-primary"
//                     >
//                         Close
//                     </Button>
//                 </div>
//             </Modal>
//             <FooterComponent/>
//         </>
//
//     );
//
// };
//
// export default HostProfilePage;