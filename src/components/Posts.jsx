import { collection, onSnapshot, orderBy, query, doc, getDoc, getDocs, where, updateDoc, setDoc, limit } from "firebase/firestore";
import React, { useState, useEffect, useRef, useContext, } from "react";
import { auth, db } from "../firebase";
// import PostComments from "../components/PostComments"
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import LikePost from "../components/LikePost";
import repost from "../img/repos.png"

export default function Posts(
  {

  }

) {
  // const [comment, setComment] = useState("");
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  // const [inputText, setInputText] = useState('');
  // const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  const [filter, setFilter] = useState('picture'); // Состояние для хранения выбранного фильтра (по умолчанию 'picture')


  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userInfoRef = collection(db, "users", currentUser.uid, "userinfo");
  //       const querySnapshot = await getDocs(userInfoRef);
  
  //       if (!querySnapshot.empty) {
  //         const userData = querySnapshot.docs[0].data(); // Берем первый документ
  //         const newName = userData?.NAME || ""; // Замените 'NAME' на правильное поле
  //         setNewName(newName);
  //       } else {
  //         console.warn("No user info found for this user.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  
  //   fetchUserData();
  // }, [currentUser]);
  

  // Обновляем запрос при изменении фильтра
  
  useEffect(() => {
    const postsRef = collection(db, "Posts");

    // Запрос к Firestore с фильтром по выбранному типу
    const q = query(postsRef, where("style", "==", filter), orderBy("createdAt", "desc"), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setPosts(updatedPosts);
    });

    return () => unsubscribe(); // Отписка от обновлений при размонтировании компонента
  }, [filter]); // useEffect теперь зависит от filter


  // const handleRepost = async (postId) => {
  //   if (!postId) {
  //     console.error("Invalid postId");
  //     return;
  //   }
    
  //   try {
  //     // Ссылка на коллекцию userinfo
  //     const userCollectionRef = collection(db, "users", currentUser.uid, "userinfo");
  //     const userSnapshot = await getDocs(userCollectionRef);
    
  //     let userDocRef;
    
  //     if (!userSnapshot.empty) {
  //       // Берем первый документ (если есть)
  //       const userDoc = userSnapshot.docs[0];
  //       userDocRef = userDoc.ref;
  //     } else {
  //       // Создаем новый документ, если его нет
  //       userDocRef = doc(userCollectionRef);
  //       await setDoc(userDocRef, { reposts: [] });
  //     }
    
  //     const userData = (await getDoc(userDocRef)).data();
  //     const reposts = userData.reposts || [];
    
  //     if (!reposts.includes(postId)) {
  //       reposts.push(postId);
  //       await updateDoc(userDocRef, { reposts: reposts });
  //     }
  
  //     // Теперь добавляем id пользователя в пост
  //     const postRef = doc(db, "Posts", postId);
  //     const postSnapshot = await getDoc(postRef);
  //     const postData = postSnapshot.data();
  //     const postReposts = postData.reposts || [];
  
  //     if (!postReposts.includes(currentUser.uid)) {
  //       postReposts.push(currentUser.uid);
  //       await updateDoc(postRef, { reposts: postReposts });
  //     }
  //   } catch (error) {
  //     console.error("Error reposting:", error);
  //   }
  // };
  

  

  const [isActive, setIsActive] = useState(false);
  const handleAddPostClick = () => { setIsActive(!isActive); }
  const addpostClass = `postcreator ${isActive ? 'active' : ''}`;

  const [squares, setSquares] = useState([]);
  const [animationRunning, setAnimationRunning] = useState(false);

  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const colors = ['#00ffea', '#a787ff', '#ff5100', '#432eff', '#9245ff', '#dbbd88', '#c300ff', '#ff3300'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Функция для генерации случайного числа
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  // Функция для запуска анимации
  const startAnimation = () => {
    setSquares([]);
    const squareCount = 30; // Количество квадратов
    const newSquares = Array.from({ length: squareCount }, (_, index) => ({
      left: index * (window.innerWidth / squareCount), // Расположение квадратов по ширине
      top: getRandomInt(0, 50), // Случайная вертикальная позиция
      backgroundColor: getRandomColor(),
      index: index,
    }));

    setSquares(newSquares);
    setAnimationRunning(true);

    setTimeout(() => {
      setSquares([]);
      setAnimationRunning(false);
    }, 2500); // Продолжительность цикла анимации
  };

  // Запускаем анимацию с паузой в 1 секунду
  useEffect(() => {
    if (!animationRunning) {
      const interval = setInterval(() => {
        startAnimation();
      }, 2000); // Пауза между циклами
      return () => clearInterval(interval);
    }
  }, [animationRunning]);



  return (
    <div className="PostWall">
      <div className="postsbg">
        
      </div>
      <div className="Posts"

      >

        <div className="postheader">

        <div className="TypeOfPost">
            <label>
              <input
                type="radio"
                name="postType"
                value="picture"
                checked={filter === 'picture'}
                onChange={(e) => setFilter(e.target.value)}
              />
              фотки
            </label>
            <label>
              <input
                type="radio"
                name="postType"
                value="text"
                checked={filter === 'text'}
                onChange={(e) => setFilter(e.target.value)}
              />
              посты
            </label>
            {/* <label>
        <input
          type="radio"
          name="postType"
          value="journal"
          checked={filter === 'journal'}
          onChange={(e) => setFilter(e.target.value)}
        />
        Journal
      </label> */}
          </div>
          {/* <h1>лента</h1> */}
          <Link to={`/`} style={{ textDecoration: 'none' }}>
            <div className="newshome">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrfVvIlLb0jOKGcmfqMWVziY0PVoPAChCHyA&s" alt="" />
            </div>
          </Link>

        </div>
        

        <div className="postscontent">

          {posts.length === 0 ? (
            <p>No posts found for {filter}!</p>
          ) : (
            posts.map(({ id, title, description, imageUrl, createdAt, createdBy, userId, avatar, likes, comments, style, links, reposts }) => (
              <div
                key={id}
                className={`postcontent ${style === 'picture' ? 'picture' : style === 'text' ? 'text' : style === 'journal' ? 'journal' : ''}`}
              >

                {createdBy && (
                  <span className="author">
                    {/* <img className="avatar" src={avatar} alt="" /> */}
                    {createdBy}
                    <Link to={`/guest/${userId}`} style={{ textDecoration: 'none' }}>
                    </Link>
                  </span>
                )}

                <div className="postauthor">

                  <div to={`/post/${id}`} className="postimg">
                    <img
                      src={imageUrl}
                      alt=""
                    />
                  </div>

                  <div className="filtershell">

                    <div className="posttitle">
                      
                    <div className="titlebg">
                     {squares.map((square, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '30px', // Размер квадрата
              height: '30px',
              left: `${square.left}px`,
              top: `${square.top}px`,
              opacity: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)', // Сетка из 6x6 кружков
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: '1px', // Отступы между кружками
              animation: `fadeInOut 0.5s ease ${index * 50}ms forwards`, // Задержка для анимации
            }}
          >
            {Array.from({ length: 36 }).map((_, dotIndex) => (
              <div
                key={dotIndex}
                style={{
                  width: '3px',  // Размер кружка
                  height: '3px',
                  borderRadius: '50%',  // Круглая форма
                  backgroundColor: square.backgroundColor,  // Цвет кружка
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeInOut {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>


                      <h3>{title}</h3>

                      <div className="postlink">
                        <Link to={`/post/${id}`} style={{ textDecoration: 'none' }}>
                          <p>▷</p>
                        </Link>
                      </div>

                      {createdBy && (
                        <span className="textauthor">
                          {/* <img className="avatar" src={avatar} alt="" /> */}

                          <Link className="linkto" to={`/guest/${userId}`} style={{ textDecoration: 'none'}}>
                         {createdBy}
                          </Link>
                        </span>
                      )}

                      <style>
                        {`
          @keyframes fadeInOut {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
                      </style>
                    </div>

                    <div className="description">
                      {/* <img src="https://icons.veryicon.com/png/o/miscellaneous/field-view-cloud/my-post-1.png" alt="" /> */}
                      <img src={imageUrl} alt="" />
                      <h5>{description}</h5>
                      
                      {/* <a href={links} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div className="links">{links}</div>
                      </a> */}
                      {links && links.map(({ text, url }, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          <div className="links">{text}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="postdate">{createdAt.toDate().toDateString()}</div>
                </div>

                {/* <PostComments className='PostComments' id={id} comments={comments} /> */}
                {comments && comments.length > 0 &&
                  (<div className="commentslenght" ><p>{comments?.length} комментов</p></div>)}
                {user && <LikePost id={id} likes={likes} />}

                {/* <div
                  className="repostbutton"
                  onClick={() => handleRepost(id)} 
                >
                  <img src={repost} alt="" />
                </div> */}

                {reposts && reposts.length > 0 && (
  <div className="repostslenght">
    <p>{reposts.length}</p>
  </div>
)}

              </div>
            ))
          )}
          
        </div>


      </div>
    </div>
  );
}
