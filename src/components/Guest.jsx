
// import React, { useState, useEffect,   useContext, } from "react";
// import { Link } from "react-router-dom";
// import Photo from "../components/Photo";
// import { collection, query,  getDocs,  onSnapshot, doc ,deleteDoc,setDoc , orderBy, addDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import { useParams } from "react-router-dom";
// import TodoGuest from "../components/TodoGuest";
// import RunOne from "./RunOne";
// import RunTwo from "./RunTwo";
// import GuestPost from "./GuestPost"
// import "../pages/Todo.css";
// import Indorse from "./Indorse";
// import Creative from "./Creative";
// import AV from "./AV";
// import Regalias from "./Regalias";
// import GuestClass from "./GuestClass";
// import { AuthContext } from "../context/AuthContext";
// import medal from "../img/medal.png"
// import vocancy from "../img/vocan.png"
// import wall from "../img/wall.jpg"

// export default function Guest() {

//   const pf = event => {

//     event.currentTarget.classList.toggle('active');
//   };

//   // const [posts, setPosts] = useState([]);
//   const [err, setErr] = useState(false);
//   const [guest, setGuest] = useState(null);
//   const { id } = useParams();
//   const [todos, setTodos] = React.useState([]);
//   const [runs, setRuns] = React.useState([]);
//   const [followers, setFollowers] = useState([]);
//   // const [username, setUsername] = useState("");
//   // const [user, setUser] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const dope = React.useRef(null);
//   const vocan = React.useRef(null);
//   const regal = React.useRef(null);
//   const market = React.useRef(null);
//   const nice = React.useRef(null);
//   const indorse = React.useRef(null);
//   const creative = React.useRef(null);
//   const post = React.useRef(null);
//   const photo = React.useRef(null);
//   const profile = React.useRef(null);
//   const container = React.useRef(null);
  
  
//   const [name, setName] = useState('');
// const [avatar, setAvatar] = useState('');

// const [isFollowing, setIsFollowing] = useState(false);

//   const ClickDOPE = (e) => {
//     dope.current.classList.toggle("active");
//   };
  
//   const onRemoveClickvocancy = (e) => {
//     vocan.current.classList.remove("active");
//   };
//   const onToggleClickvocancy = (e) => {
//     vocan.current.classList.toggle("active");
//   };
//   const onRemoveClickregalia = (e) => {
//     regal.current.classList.remove("active");
//   };
//   const onToggleClickregalia = (e) => {
//     regal.current.classList.toggle("active");
//   };

//   const onRemoveClickmarket = (e) => {
//     market.current.classList.remove("active");
//   };


//   const onRemoveClickindorse = (e) => {
//     indorse.current.classList.remove("active");
//   };
//   const onToggleClickindorse = (e) => {
//     indorse.current.classList.toggle("active");
//   };
//   const onToggleClickcreative = (e) => {
//     creative.current.classList.toggle("active");
//     const otherElement = document.querySelector('.pf');
//     if (otherElement) {
//       otherElement.classList.remove('active');
//     }
//   };

//   const onRemoveClickcreative = (e) => {
//     creative.current.classList.remove("active");
//   };
//   const onToggleClickpost = (e) => {
//     post.current.classList.toggle("active");
//   };
//   const onRemoveClickpost = (e) => {
//     post.current.classList.remove("active");
//   };

//   const onToggleClickphoto = (e) => {
//     photo.current.classList.toggle("active");
//   };
//   const onRemoveClickphoto = (e) => {
//     photo.current.classList.remove("active");
//   };

//   const onToggleClickprofile = (e) => {
//     profile.current.classList.toggle("active");
//   };
//   const onRemoveClickprofile = (e) => {
//     profile.current.classList.remove("active");
//   };

//   const onToggleClickcontainer = (e) => {
//     container.current.classList.toggle("active");
//   };
//   const onRemoveClickcontainer = (e) => {
//     container.current.classList.remove("active");
//   };


//     useEffect(() => {
//       const gesRef = doc(db, "users", id);
//       const unsubscribe = onSnapshot(gesRef, (snapshot) => {
//       setGuest({ ...snapshot.data(), id: snapshot.id });
//       const displayName = snapshot.data().displayName;
      
//       if (displayName) {
//         const baseUrl = "https://influencer-777.web.app";
//       // const baseUrl = "http://localhost:3000"; // Замените это на ваш базовый URL-адрес локального сервера
//       const profileUrl = `${baseUrl}/guest/${displayName}`;
//       const currentState = { url: profileUrl };
//       const pageTitle = ""; // Укажите здесь название страницы пользователя, которое вы хотите отобразить
      
//       if (window.history && window.history.replaceState) {
//       window.history.replaceState(currentState, 
//         // pageTitle, 
//         profileUrl);
//       }
//       }
//       });
      
//       return () => {
//       unsubscribe();
//       };
//       }, [id]);

//   React.useEffect(() => {
//     // const q = query(collection(db, "users", id, "todos"));
//     const q = query(collection(db, "users", id, "todos"), orderBy("createdAt", "desc")); // Сортировка по полю "createdAt" в порядке убывания
//     const unsub = onSnapshot(q, (querySnapshot) => {
//       let todosArray = [];
//       querySnapshot.forEach((doc) => {
//         todosArray.push({ ...doc.data(), id: doc.id });
//       });
//       setTodos(todosArray);
//       setRuns(todosArray);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const fetchFollowers = async () => {
//     const followersCollection = collection(db, "users", id, "followers");
//     const q = query(followersCollection);
//     const followersSnapshot = await getDocs(q);
//     const followersData = followersSnapshot.docs.map(doc => doc.data());
//     setFollowers(followersData);
//     };
    
//     fetchFollowers();
//     }, [id]);

//     useEffect(() => {
//       const fetchUserData = async () => {
//       try {
//       if (guest) {
//       const userQuery = query(collection(db, 'users', guest.id, 'userinfo'));
//       const userSnapshot = await getDocs(userQuery);
      
//       if (!userSnapshot.empty) {
//       const userData = userSnapshot.docs[0].data();
//       setName(userData?.NAME || "");
//       setAvatar(userData?.AVATAR || "");
//       setStyle(userData?.style || ""); // Добавляем получение стиля
//       setPress(userData?.press || ""); 
//       }
//       }
//       } catch (error) {
//       console.error('Ошибка при получении данных пользователя:', error);
//       }
//       };
      
//       fetchUserData();
//       }, [guest]);

// const [style, setStyle] = useState(""); // Добавьте эту строчку в ваш компонент
// const [press, setPress] = useState(""); 


// const [activity, setActivity] = useState(""); // Это значение из базы

// useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       if (guest) {
//         const userQuery = query(collection(db, 'users', guest.id, 'userinfo'));
//         const userSnapshot = await getDocs(userQuery);

//         if (!userSnapshot.empty) {
//           const userData = userSnapshot.docs[0].data();
//           setActivity(userData?.activity || ""); // Получаем значение activity
//         }
//       }
//     } catch (error) {
//       console.error('Ошибка при получении данных пользователя:', error);
//     }
//   };

//   fetchUserData();
// }, [guest]);

//       const handleFollowClick = async () => {
//         if (isFollowing) {
//         await deleteDoc(doc(collection(db, "users", id, "followers"), currentUser.uid));
//         await deleteDoc(doc(collection(db, "users", currentUser.uid, "following"), id));
//         } else {
//           await setDoc(doc(collection(db, "users", id, "followers"), currentUser.uid), {
//             uid: currentUser.uid,
//             photoURL: currentUser.photoURL,
//             // name: currentUser.name
//             });
//             await setDoc(doc(collection(db, "users", currentUser.uid, "following"),  id), {
//               uid: guest.uid,
//               avatar: guest.photoURL,
//               // name: post.userName
//               });
//               }
        
//         setIsFollowing(!isFollowing);
//         };
        
//         const [selectedReaction, setSelectedReaction] = useState(null);

       
//         const randomNames = ['котяра', 'заблудший', 'смерд', 'призрак', 'олень', 'челядь'];

//         useEffect(() => {
//           const handleUserVisitAndReaction = async () => {
//               if (currentUser) {
//                   const userId = currentUser.uid;
//                   const createdAt = new Date();
//                   const interactiveRef = doc(db, 'INTERACTIVE', id);
  
//                   try {
//                       const docSnap = await getDoc(interactiveRef);
  
//                       if (docSnap.exists()) {
//                           // Документ существует, добавляем пользователя в visitors
//                           await updateDoc(interactiveRef, {
//                               visitors: arrayUnion({ userId, createdAt }),
//                           });
  
//                           console.log("Посетитель успешно добавлен.");
//                       } else {
//                           // Документ не существует, создаем новый документ
//                           await setDoc(interactiveRef, {
//                               visitors: [{ userId, createdAt }],
//                               reactions: [], // Инициализируем пустой массив для реакций
//                               gifts: [], // Инициализируем пустой массив для подарков
//                               createdAt: serverTimestamp(),
//                           });
  
//                           console.log("Пользователь успешно добавлен в интерактив.");
//                       }
//                   } catch (error) {
//                       console.error("Ошибка добавления пользователю интерактив: ", error);
//                   }
//               }
//           };
  
//           handleUserVisitAndReaction();
//       }, [currentUser, id]);
  
//       const handleReaction = async (reaction) => {
//           if (currentUser) {
//               const userId = currentUser.uid;
//               const reactionData = {
//                   userId: userId,
//                   reaction: reaction,
//               };
//               const interactiveRef = doc(db, 'INTERACTIVE', id);
  
//               try {
//                   // Добавляем реакцию в reactions
//                   await updateDoc(interactiveRef, {
//                       reactions: arrayUnion(reactionData),
//                   });
//                   console.log("Реакция успешно добавлена.");
//               } catch (error) {
//                   console.error("Ошибка добавления реакции: ", error);
//               }
//           } else {
//               alert("Пожалуйста, войдите в систему, чтобы оставить реакцию.");
//           }
//       };
//       const handleGift = async (gift) => {
//         if (currentUser) {
//             const userId = currentUser.uid;
//             const giftData = {
//                 userId: userId,
//                 gift: gift,
//             };
//             const interactiveRef = doc(db, 'INTERACTIVE', id);

//             try {
//                 // Добавляем реакцию в gifts
//                 await updateDoc(interactiveRef, {
//                     gifts: arrayUnion(giftData),
//                 });
//                 console.log("Реакция успешно добавлена.");
//             } catch (error) {
//                 console.error("Ошибка добавления реакции: ", error);
//             }
//         } else {
//             alert("Пожалуйста, войдите в систему, чтобы оставить реакцию.");
//         }
//     };
//     const [gifts, setGifts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     useEffect(() => {
//       const giftsRef = doc(db, 'INTERACTIVE', id);

//       const unsubscribe = onSnapshot(giftsRef, (docSnap) => {
//           if (docSnap.exists()) {
//               const data = docSnap.data();
//               const giftsArray = data.gifts || [];
//               setGifts(giftsArray); // Устанавливаем массив подарков
//           } else {
//               setGifts([]); // Если документа нет, очищаем массив подарков
//           }
//           setLoading(false);
//       }, (error) => {
//           console.error("Ошибка получения данных:", error);
//           setError("Ошибка получения данных.");
//           setLoading(false);
//       });

//       return () => unsubscribe();
//   }, [id]);

//   // Группировка подарков по значению
//   const groupedGifts = gifts.reduce((acc, gift) => {
//       const giftDescription = gift.gift || 'wtf'; // или ваше значение по умолчанию
//       acc[giftDescription] = (acc[giftDescription] || 0) + 1;
//       return acc;
//   }, {});

//   const iconMap = {
//     'LIKE': '💜',
//     'WOW': '🌸',
//     'NOM': '🏆',
//     'AOE': '👑',
//     'STN': '💎',
//     'MUSE': '🎼',
// };

// const guestBodyClass = `guestbody ${style === 'vip' ? 'VIP' : ''}`.trim();
// const coverSrc = style === 'vip' ? avatar : wall;

//   return (
//     <div className={guestBodyClass} ref={dope}>

//     <img className='guestcover' src={coverSrc} alt="" /> 


//       <div className="GLOBAL">

//           <div className={`guestcontainer ${activity === 'post' ? 'active' : ''}`} ref={container}>

//           <div className='Guest' ref={profile}>

//             <div onDoubleClick={pf} className="pf">

//               <div className="artistinfo"
//               >
//                 {/* <div className="titleshell">
//         <Title />
//       </div> */}

//                 <div className='todo_container'>

//                   {todos.map((todo) => (
//                     <TodoGuest
//                       key={todo.id}
//                       todo={todo}
//                     />
//                   ))}
//                 </div>
//                 {/* <div className="Admin"></div> */}
//               </div>

//               {guest && (
//                 <div className="profilecover">
//                   <img className='profileimg' src={avatar} alt="" />
//                 </div>
//               )}

//             </div>

//             <div className="GuestControls">

//               <div id="c7" className="cont"
//                 onClick={() => {
//                   onToggleClickregalia();
//                   onRemoveClickphoto();
//                   // onRemoveClicknice();
//                   onRemoveClickindorse();
//                   onRemoveClickcreative();
//                   onRemoveClickmarket();
//                   onRemoveClickvocancy();
//                 }}
//               >
//                 <img src={medal} alt="" />
//               </div>
//               <div id="c4" className="cont"
//                 onClick={() => {
//                   onToggleClickcreative();
//                   onRemoveClickpost();
//                   // onRemoveClicknice();
//                   onRemoveClickindorse();
//                   onRemoveClickmarket();
//                   onRemoveClickphoto();
//                   onRemoveClickregalia();
//                   onRemoveClickvocancy();
//                 }}
//               >
//                 <img src="https://cdn-icons-png.flaticon.com/512/26/26834.png" alt="" />
//                 {/* <img src="https://cdn.iconscout.com/icon/free/png-256/free-new-releases-1781713-1518390.png" alt="" /> */}
//               </div>
//               <div id="c5" className="cont"
//                 onClick={() => {
//                   onToggleClickphoto();
//                   // onRemoveClicknice();
//                   onRemoveClickindorse();
//                   onRemoveClickcreative();
//                   onRemoveClickmarket();
//                   onRemoveClickregalia();
//                   onRemoveClickvocancy();
//                 }}
//               >
//                 <img src="https://cdn0.iconfinder.com/data/icons/multimedia-line-30px/30/image_photo-512.png" alt="" />
//               </div>
//               <div id="c3" className="cont"
//                 onClick={() => {
//                   onToggleClickindorse();
//                   onRemoveClickmarket();
//                   // onRemoveClicknice();
//                   onRemoveClickcreative();
//                   onRemoveClickphoto();
//                   onRemoveClickregalia();
//                   onRemoveClickvocancy();
//                 }}
//               >
//                 <img src="https://static.thenounproject.com/png/426771-200.png" alt="" />
//               </div>
//               <div id="c8" className="cont"
//                 onClick={() => {
//                   onToggleClickvocancy();
//                   onRemoveClickregalia();
//                   onRemoveClickphoto();
//                   // onRemoveClicknice();
//                   onRemoveClickindorse();
//                   onRemoveClickcreative();
//                   onRemoveClickmarket();
//                 }}
//               >
//                 <img src={vocancy} alt="" />
//               </div>
//               <div id="c4" className="cont"

//                 onClick={() => {
//                   onToggleClickpost();
//                   onToggleClickcontainer();
//                   // onRemoveClicknice();
//                   onRemoveClickindorse();
//                   onRemoveClickmarket();
//                   onRemoveClickprofile();
//                   onRemoveClickphoto();
//                   onRemoveClickcreative();
//                   onRemoveClickvocancy();
//                   onRemoveClickregalia();
//                 }}
//               >
//                 <img src="https://static.thenounproject.com/png/1729664-200.png" alt="" />

//               </div>

//             </div>

//             {guest && (
//               <span className={`ProfileName ${style === 'vip' ? 'VIP' : ''}`}>
//                 {name}
//               </span>
//             )}

//             <div className="artistclass">
//               <GuestClass />
//             </div>

//             <botton onClick={handleFollowClick}
//               className="FOLLOW"
//               style={{ cursor: "pointer" }}
//             >{isFollowing ? "Unfollow" : "Follow"}</botton>

//             <div className="preview">

//               <div className="runone">
//                 {runs.map((todo) => (
//                   <RunOne
//                     key={todo.id}
//                     todo={todo}
//                   />
//                 ))}
//               </div>

//               <div className="runtwo">
//                 {runs.map((todo) => (
//                   <RunTwo
//                     key={todo.id}
//                     todo={todo}
//                   />
//                 ))}
//               </div>

//             </div>

//             <div className="Followers">followers: {followers.length}
//               {followers.map(({ uid, avatar, photoURL }) => (
//                 <div>

//                   <img src={photoURL} alt="" />

//                 </div>
//               ))}
//             </div>


//             <div className="GGifts">
//               {loading && <p>Загрузка...</p>}
//               {error && <p>{error}</p>}
//               {!loading && Object.keys(groupedGifts).length === 0 && <p>Нет подарков</p>}
//               {!loading && Object.keys(groupedGifts).map((giftName) => (
//                 <div key={giftName} className="gift-item">
//                                     {iconMap[giftName] && <span style={{ fontSize: '24px' }}>{iconMap[giftName]}</span>}
//                 </div>
//               ))}
//             </div>

//           </div>
          
//           <div className={`PhotoShell ${activity === 'gallery' ? 'active' : ''}`} ref={photo}>
//           <div className="photocontent">
//               <Photo />
//             </div>
//           </div>

//         </div>

//     <div className={`GstPost ${activity === 'post' ? 'active' : ''}`} ref={post}>
//       <GuestPost />
//     </div>

//     <div className={`Indorse ${activity === 'indorse' ? 'active' : ''}`} ref={indorse}>
//       <Indorse />
//     </div>

//         <div className="Creative" ref={creative} >
//           <Creative />
//         </div>

//         <div className="GuestRegal" ref={regal}>
//           <Regalias />
//         </div>
        

//       </div>

//       <div className="gifts">
//         <div
//           className={`gift-button LIKE${selectedReaction === 'LIKE' ? ' selected' : ''}`}
//           onClick={() => handleGift('LIKE')}
//         >
//           лойс
//         </div>
//         <div
//           className={`gift-button MUSE${selectedReaction === 'MUSE' ? ' selected' : ''}`}
//           onClick={() => handleGift('MUSE')}
//         >
//           восхищаюсь
//         </div>

//         <div
//           className={`gift-button WOW${selectedReaction === 'WOW' ? ' selected' : ''}`}
//           onClick={() => handleGift('WOW')}
//         >
//           вау

//         </div>
//         <div
//           className={`gift-button NOM${selectedReaction === 'NOM' ? ' selected' : ''}`}
//           onClick={() => handleGift('NOM')}
//         >
//           номинант
//         </div>
//         <div
//           className={`gift-button AOE${selectedReaction === 'AOE' ? ' selected' : ''}`}
//           onClick={() => handleGift('AOE')}
//         >
//           аоэ
//         </div>
//         <div
//           className={`gift-button STN${selectedReaction === 'STN' ? ' selected' : ''}`}
//           onClick={() => handleGift('STN')}
//         >
//           стн
//         </div>
//       </div>

//       <div className="press">
//         <span>{press}</span>
//       </div>

//       <div className="STATS">
//         <span>wievs: 33</span>  
//         {/* <span>likes: 44</span>  */}
//         <span>posts: 55</span> 
//         <span>fans: 66</span> 
//         <span>stalk: 77</span>
//         {/* <span>position: 77</span> */}
//       </div>

//       <div className="small">

//         <div id="c5" className="cont"

//           onClick={() => {
//             onToggleClickphoto();
//             onToggleClickprofile();
//             // onRemoveClicknice();
//             onRemoveClickindorse();
//             onRemoveClickcontainer();
//             onRemoveClickmarket();
//             onRemoveClickcreative();
//             onRemoveClickvocancy();
//             onRemoveClickregalia();
//             onRemoveClickpost();
//           }}
//         >
//           <img src="https://cdn0.iconfinder.com/data/icons/multimedia-line-30px/30/image_photo-512.png" alt="" />

//         </div>

//         <div id="c3" className="cont"
//           onClick={() => {
//             onToggleClickindorse();
//             onRemoveClickmarket();
//             // onRemoveClicknice();
//             onRemoveClickprofile();
//             onRemoveClickcontainer();
//             onRemoveClickphoto();
//             onRemoveClickcreative();
//             onRemoveClickvocancy();
//             onRemoveClickregalia();
//             onRemoveClickpost();
//           }}
//         >
//           <img src="https://static.thenounproject.com/png/426771-200.png" alt="" />
//         </div>
//         <div id="c4" className="cont"

//           onClick={() => {
//             onToggleClickpost();
//             onToggleClickcontainer();
//             // onRemoveClicknice();
//             onRemoveClickindorse();
//             onRemoveClickmarket();
//             onRemoveClickprofile();
//             onRemoveClickphoto();
//             onRemoveClickcreative();
//             onRemoveClickvocancy();
//             onRemoveClickregalia();
//           }}
//         >
//           <img src="https://static.thenounproject.com/png/1729664-200.png" alt="" />

//         </div>

//       </div>

//       <button className="guesthome"><Link style={{ textDecoration: 'none', color: 'white' }} to="/home">
//         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrfVvIlLb0jOKGcmfqMWVziY0PVoPAChCHyA&s" alt="" />
//       </Link></button>

//       <div onClick={() => {
//         ClickDOPE();
//       }} className="dopebtn">DOPE MODE
//       </div>

//       </div>
    
//   );
// }
