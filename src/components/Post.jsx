// import { doc, onSnapshot, updateDoc, getDoc, collection, setDoc, deleteDoc} from "firebase/firestore";
// import React, { useEffect, useState, useContext } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useParams } from "react-router-dom";
// import { auth, db } from "../firebase";
// import { Link } from "react-router-dom";
// import PostComments from "../components/PostComments"
// import { getFirestore } from "firebase/firestore";
// import LikePost from "../components/LikePost";
// import { AuthContext } from "../context/AuthContext";
// import SkyBox from "../components/SkyBox";

// export default function Post(userId) {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   // const [user] = useAuthState(auth);
//   const [inputText, setInputText] = useState('');
//   const [inputTitle, setInputTitle] = useState('');
//   const [isFollowing, setIsFollowing] = useState(false);
  
//   useEffect(() => {
//     const getPostData = async () => {
//     try {
//     const docRef = doc(db, "Posts", id);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//     const postData = docSnap.data();
//     setPost({ id: docSnap.id, ...postData });
//     } else {
//     // Документ с указанным ID не найден
//     }
//     } catch (error) {
//     console.error("Ошибка при получении данных поста:", error);
//     }
//     };
    
//     getPostData();
//     }, [id]);

//   const handleEditPost = async (id) => 
//   {
//     {
//         const docRef = doc(db, "Posts", id);
//         onSnapshot(docRef, (snapshot) => {
//           setPost({ ...snapshot.data(), id: snapshot.id });
//           setInputText(post.description);
//         setInputTitle(post.title);
//         });
//       }
//   };
//   // Обработчик события при сохранении изменений поста
//   const handleSaveChanges = async (id) => {
//     try {
//       const postDocRef = doc(getFirestore(), "Posts", id);
//       // Обновляем текст и заголовок поста
//       await updateDoc(postDocRef, {
//         description: inputText,
//         title: inputTitle,
//       });
//       // Очищаем поле ввода после сохранения изменений
//       setInputText("");
//       setInputTitle("");
//     } catch (error) {
//       console.error("Ошибка при сохранении изменений: ", error);
//     }
//   };

//   useEffect(() => {
//     const loadDataFromDatabase = async () => {
//     // Получаем доступ к коллекции "following" для текущего пользователя
//     const followingRef = doc(collection(db, "users", auth.currentUser.uid, "following"));
//     const followingSnapshot = await getDoc(followingRef);
    
//     // Проверяем, существует ли документ для пользователя, на которого мы подписаны
//     setIsFollowing(followingSnapshot.exists());
//     };
    
//     loadDataFromDatabase();
//     }, []); // Пустой массив второго аргумента гарантирует выполнение эффекта только при монтировании компонента
    
//     const handleFollowClick = async () => {
//     if (isFollowing) {
//     await deleteDoc(doc(collection(db, "users", post.userId, "followers"), currentUser.uid));
//     await deleteDoc(doc(collection(db, "users", currentUser.uid, "following"), post.userId));
//     } else {
//       await setDoc(doc(collection(db, "users", post.userId, "followers"), currentUser.uid), {
//         uid: currentUser.uid,
//         photoURL: currentUser.photoURL,
//         // name: currentUser.name
//         });
//         await setDoc(doc(collection(db, "users", currentUser.uid, "following"), post.userId), {
//           uid: post.userId,
//           avatar: post.avatar,
//           // name: post.userName
//           });
//           }
    
//     setIsFollowing(!isFollowing);
//     };

//   return (
//     <div className="POST" >
// <SkyBox/>
//       {post && (
        
//         <div className="SinglePost">
        
//             <span className="title">
//               <h1>{post.title}</h1>
//               <div className="date">{post.createdAt.toDate().toDateString()}</div>
//             </span>

//           <div className="singlepostcontent">
//           <img src={post.imageUrl} 
//           />
//           <span>{post.description}</span>

//           </div>
          

//           <div className="author">
//           <div className="avatar">
//             <img src={post.avatar} />
//             </div>
//             <p>{post.createdBy}</p>
//             <Link to={`/guest/${post.userId}`}>

//                 </Link>

//             <botton onClick={handleFollowClick}
//               className="FOLLOW"
//               style={{ cursor: "pointer" }}
//             >{isFollowing ? "Unfollow" : "Follow"}</botton>
//           </div>


//           </div>
//       )}

//       <button className="singleposthome "><Link style={{ textDecoration: 'none', color: 'white' }} to="/">
//         <img src="https://cdn.icon-icons.com/icons2/2518/PNG/512/arrow_back_icon_151627.png" alt="" />
//       </Link></button>
//     </div>
//   );
// }
