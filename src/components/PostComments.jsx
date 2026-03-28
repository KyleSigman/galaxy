// import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { Link } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { v4 as uuidv4 } from "uuid";
// import { auth } from "./../firebase";


// export default function PostComment({ id }) {
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState([]);
//   const [currentlyLoggedinUser] = useAuthState(auth);
//   const commentRef = doc(db, "Posts", id);
//   useEffect(() => {
//     const docRef = doc(db, "Posts", id);
//     onSnapshot(docRef, (snapshot) => {
//       setComments(snapshot.data().comments);
//     });
//   }, []);

//   const handleChangeComment = (e) => {
//     updateDoc(commentRef, {
//       comments: arrayUnion({
//         user: currentlyLoggedinUser.uid,
//         userName: currentlyLoggedinUser.displayName,
//         userPhoto: currentlyLoggedinUser.photoURL,
//         comment: comment,
//         createdAt: new Date(),
//         commentId: uuidv4(),
//       }),
//     }).then(() => {
//       setComment("");
//     });
//   };

//   // delete comment function
//   const handleDeleteComment = (comment) => {
//     console.log(comment);
//     updateDoc(commentRef, {
//         comments:arrayRemove(comment),
//     })
//     .then((e) => {
//         console.log(e);
//     })
//     .catch((error) => {
//         console.log(error);
//     })
//   };

//   const [isActivecom, setIsActiveCom] = useState(false);
//     const handlecomentClick = () => {setIsActiveCom(!isActivecom); }
//     const commentClass = `comfield ${isActivecom ? 'active' : ''}`;

//   return (
//     <div className="comments" >
//         {comments !== null &&
//           comments.map(({commentId, user, comment, userName , createdAt, userPhoto}) => (
//             <div className="commentshell" key={commentId}>
//               <div className="borderR">
//                 <div className="userphoto">
//                 <Link to={`/guest/${user}`}>
//                 <img src={userPhoto} alt="" /> 
//                 </Link>

//                 </div>
//                 <div className="col-11">
//                   <span
//                     className={`Bbadge ${
//                       user === currentlyLoggedinUser.uid
//                         ? "bbg-success"
//                         : "bbg-primary"
//                     }`}
//                   >
//                     {userName}
//                   </span>
//                   <div className="text">{comment}</div>
//                 </div>
//                 <div className="col-1">
//                   {user === currentlyLoggedinUser.uid && (
//                     <i
//                       className="fa fa-times"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => handleDeleteComment({ commentId, user, comment, userName , createdAt, userPhoto})}
//                     ></i>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         {currentlyLoggedinUser && (
//           <input
//             type="text"
//             className="commentinput"
//             value={comment}
//             onChange={(e) => {
//               setComment(e.target.value);
//             }}
//             placeholder="добавить коммент"
//             // onKeyUp={(e) => {
//             //   handleChangeComment(e);
//             // }}
//           />
//         )}
//                 {currentlyLoggedinUser && (
//           <div className="addcomment"
//           // placeholder="Add a comment"
//           onClick={(e) => {
//             handleChangeComment(e);
//             }}
//             >
//               <span>+</span>
//               {/* <h1>+</h1> */}
//             </div>
//         )}
//       </div>
//   );
// }
