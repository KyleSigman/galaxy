// import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from '../context/AuthContext'
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase";
// import {   collection,   query,   onSnapshot, doc, getDoc,  getDocs, orderBy , where} from "firebase/firestore";
// import CommandTerminal from './CommandTerminal';
// import GalaxyMessages from './GalaxyMessages';

// const Profile = () => {
  

//   const pf = (event) => {
//     // Находим элемент с классом 'nerualBlock' вне зависимости от того, где был клик
//     const neuralBlock = document.querySelector('.nerualBlock');
//     if (neuralBlock) {
//       neuralBlock.classList.toggle('active');
//     }
//   };

//   const [isPostsLoaded, setIsPostsLoaded] = useState(false);

//   // Добавить useState в начало компонента
// const [showMessages, setShowMessages] = useState(false);

//   // const loadPosts = () => setIsPostsLoaded(true); // Функция для уведомления SmartWall о том, что посты загружены
  
//   const loadPosts = () => {
//     setIsPostsLoaded(true); // Отмечаем, что посты загружены
//   };

//   const [isPostActive, setIsPostActive] = useState(false);
//   const [isMagicActive, setIsMagicActive] = useState(false);

//   const handlePositionClick = () => {
//     setIsPostActive(true);
//   };

//   const handleMagicClick = () => {
//     setIsMagicActive(true);
//   };

//   const handleCloseAddPost = () => {
//     setIsPostActive(false);
//   };
//   const handleCloseAddMagic = () => {
//     setIsMagicActive(false);
//   };

//   const [todos, setTodos] = useState([]);
//   const [runs, setRuns] = useState([]);
//   const [toggleon, setToggle] = useState(false);
//   const { currentUser } = useContext(AuthContext)
//   const [followers, setFollowers] = useState([]);
// const [name, setName] = useState('');
// const [avatar, setAvatar] = useState('');
// const [press, setPress] = useState('');
// const [style, setStyle] = useState(""); // Добавьте эту строчку в ваш компонент
// const [force, setForce] = useState(0); // Состояние для силы
// const [tickets, setTickets] = useState([]);
//   const toggle = event => {
//     // 👇️ toggle isActive state variable
//     setToggle(current => !current);
//   };


//   React.useEffect(() => {
//     if(auth.currentUser) {
//       let uid = auth.currentUser.uid;
//       // const q = query(collection(db, "users", uid, "todos"));
//       const q = query(collection(db, "users", uid, "todos"), orderBy("createdAt", "desc")); // Сортировка по полю "createdAt" в порядке убывания
//       const unsub = onSnapshot(q, (querySnapshot) => {
//         let todosArray = [];
//         querySnapshot.forEach((doc) => {
//           todosArray.push({ ...doc.data(), id: doc.id });
//         });
//         setTodos(todosArray);
//         setRuns(todosArray);
//       });
//       return () => unsub();
//     }
   
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (currentUser && currentUser.uid) {
//         try {
//           // Получаем коллекцию userinfo для конкретного пользователя
//           const userQuery = query(collection(db, 'users', currentUser.uid, 'userinfo'));
//           const userSnapshot = await getDocs(userQuery);

//           if (!userSnapshot.empty) {
//             // Получаем существующий документ из userinfo
//             const userDoc = userSnapshot.docs[0];
//             const userDocRef = doc(db, 'users', currentUser.uid, 'userinfo', userDoc.id);

//             // Получаем тикеты из поля "tickets" внутри userDocRef
//             const ticketsData = userDoc.data().tickets || []; // Получаем тикеты (или пустой массив, если их нет)
//             setTickets(ticketsData);
//           }
//         } catch (error) {
//           console.error('Ошибка при получении тикетов:', error);
//         }
//       }
//     };

//     fetchTickets();
//   }, [currentUser]);


//   useEffect(() => {
//     const fetchUserData = async () => {
//     try {
//     if (currentUser) {
//     const userQuery = query(collection(db, 'users', currentUser.uid, 'userinfo'));
//     // const userQuery = query(collection(db, 'users', currentUser.uid, 'userinfo'), orderBy("createdAt", "desc"));
//     const userSnapshot = await getDocs(userQuery);

//     if (!userSnapshot.empty) {
//     const userData = userSnapshot.docs[0].data();
//     setName(userData?.NAME || "");
//     setAvatar(userData?.AVATAR || "");
//     setPress(userData?.press || "");
//     setStyle(userData?.style || ""); // Добавляем получение стиля
//     setForce(userData?.FORCE || 0); // Получаем значение силы
//     }
//     }
//     } catch (error) {
//     console.error('Ошибка при получении данных пользователя:', error);
//     }
//     };
    
//     fetchUserData();
//     }, [currentUser]);

//     useEffect(() => {
//       const fetchFollowers = async () => {
//       const followersCollection = collection(db, "users", currentUser.uid, "followers");
//       const q = query(followersCollection);
//       const followersSnapshot = await getDocs(q);
//       const followersData = followersSnapshot.docs.map(doc => doc.data());
//       setFollowers(followersData);
//       };
      
//       fetchFollowers();
//       }, [currentUser]);

  
//   const [isActive, setIsActive] = useState(false);
//   const handleProfile = () => {
//     setIsActive(!isActive);
//   }
//   const Human = `Human ${isActive ? 'active' : ''}`;

//   const [totalArtistic, setTotalArtistic] = useState(0);
//   const [totalInformatic, setTotalInformatic] = useState(0);
//   const [totalInspiric, setTotalInspiric] = useState(0);

//   const fetchTalentData = async () => {
//     const performerCollectionRef = collection(db, "users", currentUser.uid, "Talent");
//     const querySnapshot = await getDocs(performerCollectionRef);
//     let artisticSum = 0;
//     let informaticSum = 0;
//     let inspiricSum = 0;

//     querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         artisticSum += data.artistic;
//         informaticSum += data.informatic;
//         inspiricSum += data.inspiric;
//     });

//     setTotalArtistic(artisticSum);
//     setTotalInformatic(informaticSum);
//     setTotalInspiric(inspiricSum);
// };

// useEffect(() => {
//     fetchTalentData();
// }, []);

// const [reactions, setReactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [visitors, setVisitors] = useState([]); 
//   const [gifts, setGifts] = useState([]); 

// useEffect(() => {
//     if (!currentUser) {
//         setLoading(false);
//         return;
//     }

//     const reactionsRef = doc(db, 'INTERACTIVE', currentUser.uid);

//     const unsubscribe = onSnapshot(reactionsRef, async (docSnap) => {
//         if (docSnap.exists()) {
//             const reactionData = docSnap.data();
//             const reactionsArray = reactionData.reactions || [];
//             const visitorsArray = reactionData.visitors || [];
//             const giftsArray = reactionData.gifts || []; // Получаем данных о подарках

//             // Обработка реакций
//             const reactionsData = await Promise.all(reactionsArray.map(async (reaction) => {
//                 const userId = reaction.userId;

//                 const userQuery = query(collection(db, 'users', userId, 'userinfo'));
//                 const userSnapshot = await getDocs(userQuery);

//                 let userInfo = {};
//                 if (userSnapshot.docs.length > 0) {
//                     userInfo = userSnapshot.docs[0].data();
//                 }

//                 return {
//                     ...reaction,
//                     nickname: userInfo.NAME || 'Unknown',
//                     avatar: userInfo.AVATAR || '',
//                 };
//             }));

//             setReactions(reactionsData);

//             // Обработка визитеров
//             const visitorsData = await Promise.all(visitorsArray.map(async (visitor) => {
//                 const userId = visitor.userId;

//                 const userQuery = query(collection(db, 'users', userId, 'userinfo'));
//                 const userSnapshot = await getDocs(userQuery);

//                 let userInfo = {};
//                 if (userSnapshot.docs.length > 0) {
//                     userInfo = userSnapshot.docs[0].data();
//                 }

//                 return {
//                     userId,
//                     nickname: userInfo.NAME || 'Unknown',
//                     avatar: userInfo.AVATAR || '',
//                 };
//             }));

//             setVisitors(visitorsData);

//             // Обработка подарков
//             const giftsData = await Promise.all(giftsArray.map(async (gift) => {
//                 const userId = gift.userId;

//                 const userQuery = query(collection(db, 'users', userId, 'userinfo'));
//                 const userSnapshot = await getDocs(userQuery);

//                 let userInfo = {};
//                 if (userSnapshot.docs.length > 0) {
//                     userInfo = userSnapshot.docs[0].data();
//                 }

//                 return {
//                     ...gift,
//                     nickname: userInfo.NAME || 'Unknown',
//                     avatar: userInfo.AVATAR || '',
//                 };
//             }));

//             setGifts(giftsData);
//         } else {
//             setReactions([]);
//             setVisitors([]);
//             setGifts([]); // Очистка массива подарков
//         }

//         setLoading(false);
//     }, (error) => {
//         console.error("Ошибка получения данных:", error);
//         setError("Ошибка получения данных.");
//         setLoading(false);
//     });

//     return () => unsubscribe();
// }, [currentUser]);

// const [isMini, setIsMini] = useState(false);
// const handleMiniToggle = (event) => {
//   setIsMini(event.target.checked); // Устанавливаем MINI на основе состояния чекбокса
// };

// const reactionTextMap = {
//   JAM: 'го',
//   FEAT: 'го',
//   TALK: 'го',
//   WORK: 'го',
//   BAND: 'го',
//   FIVE: 'лови',
// };

// const [isMINI, setIsMINI] = useState(true); 
// const handleWALLMINI = () => {
//   setIsMINI(!isMINI); // Переключение состояния при изменении чекбокса
// };

// const [isAbsolute, setIsAbsolute] = useState(false);

// const toggleAbsolute = () => {
//     setIsAbsolute(!isAbsolute);
// };

// const toggleWALLMINI = () => {
//   setIsMINI((prevState) => !prevState); // Переключаем состояние между MINI и обычной
// };

//   return (

//     <div className={Human}>

//       <label onClick={pf} id="prflbl" style={{marginLeft: "20px"}}>StarField</label>
      
//       <div  className="nerualBlock"> 

//         <div className="horizontal">
//           <div className="profilecover">
//             <img className='profileimg' src={avatar} alt="" />
//           </div>

//           <div className="rightblock">
//             <span className={`ProfileName ${style === 'vip' ? 'VIP' : ''}`} onClick={handleProfile}>
//               {name}
//             </span>

//             <div className="artistclass">
//               {/* <UserClass /> */}
//             </div>
//           </div>
//         </div>

//         <span style={{marginLeft: "20px", marginTop:"10px"}} id="lbl">о себе:</span>

//         <div className="nerualData">
          
//           {/* <div className="Admin">
//             <div className='todo_container'>
//               {todos && todos.map((todo) => (
//                 <Todo
//                   key={todo.id}
//                   todo={todo}
//                 />
//               ))}
//             </div>

//           </div> */}

//         </div>

//       </div>

//       <div 
//           className="message-icon"
//           onClick={() => setShowMessages(!showMessages)}
//         >
//           📩
//         </div>

//         {showMessages && (
//           <GalaxyMessages 
//             currentUser={currentUser}
//             onClose={() => setShowMessages(false)}
//           />
//         )}

//             <CommandTerminal />
            
//     </div>

//   )
// }

// export default Profile





