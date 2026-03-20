
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { collection, query, where, getDocs, onSnapshot, doc } from "firebase/firestore";
// import { db } from "../firebase";
// import { useParams } from "react-router-dom";


// export default function GPost() {

//   const pf = event => {

//     event.currentTarget.classList.toggle('active');
//   };

//   const [posts, setPosts] = useState([]);
//   const [err, setErr] = useState(false);
//   const [guest, setGuest] = useState([]);
//   const { id } = useParams();


//   useEffect(() => {
//     const guestRef = doc(db, "users", id);
//     onSnapshot(guestRef, (snapshot) => {
//       setGuest({ ...snapshot.data(), id: snapshot.id });
//     });
//   }, [id]);

//   const GuestPost = async () => {
//     if (guest && guest.id) {
//       const guestId = guest.id; // сохраняем guest.id в отдельной переменной
//       const postQuery = query(collection(db, "Posts"), where("userId", "==", guestId));
//       const postSnapshot = await getDocs(postQuery);
//       const postsData = [];
//       postSnapshot.forEach((doc) => {
//         // Получаем id документа
//         const postWithId = {
//           id: doc.id,
//           ...doc.data()
//         };
//         postsData.push(postWithId);
//       });
//       setPosts(postsData);
//     }
//   };
//   // const GuestPost = async () => {
//   //   if (guest && guest.id) {
//   //     const guestId = guest.id; // сохраняем guest.id в отдельной переменной
//   //     const postQuery = query(collection(db, "Posts"), where("userId", "==", guestId));
//   //     const postSnapshot = await getDocs(postQuery);
//   //     const postsData = [];
//   //     postSnapshot.forEach((doc) => {
//   //       postsData.push(doc.data());
//   //     });
//   //     setPosts(postsData);
//   //   }
//   // };

//   useEffect(() => {
//     GuestPost();
//   }, [guest]);


//   return (
//     <div className="GtPost">

//       <div className="gpheader">
//         <h2>Post</h2>
//       </div>

//       <div className="gpostscontent">
        
//         {posts.length === 0 ? (
//           <p>чё молчим..?</p>
//         ) : (
//           posts.map(
//             ({
//               id,
//               userId,
//               title,
//               description,
//               imageUrl,
//               createdAt,

//             }) => (
//               <div className="guestpostcontent" 
//               key={id}
//               >

//                 <div className="posttitle">
//                 <Link to={`/post/${id}`} style={{ textDecoration: 'none', color: 'white' }}>
//                 <h3>{title}</h3>
//                 </Link>
                  
//                 </div>
//                 {/* <span>/post/{userId}</span> */}
//                 <div className="layout">
//               {/* <div ></div> */}
//               <div className="postimg">
//               <img src={imageUrl}/>
//               </div>
//               <h5 className="description">{description}</h5>
//                 </div>
//                 <div className="Date"><p>{createdAt.toDate().toDateString()}</p></div>
//               </div>
//             )
//           )
//         )}
//       </div>

//     </div>
//   );
// }

