// import { collection, onSnapshot, orderBy, query, where, } from "firebase/firestore";
// import React, { useState, useEffect } from "react";
// import { auth, db } from "../firebase";
// import { useParams } from "react-router-dom";
// import LikeArticle from "./LikeArticle";
// // import DeleteArticle from "./DeleteArticle";
// import { useAuthState } from "react-firebase-hooks/auth";
// // import LikeArticle from "./LikeArticle";
// import { Link } from "react-router-dom";
// import AddRegalia from "./AddRegalia";
// import link from "../img/link.png"
// import userx from "../img/userx.png"

// export default function Regalias() {

//   const { id } = useParams();
//   const [articles, setArticles] = useState([]);
//   // const [guest, setGuest] = useState(null);
//   const [user] = useAuthState(auth);
//   useEffect(() => {
//     const articleRef = collection(db, "users", id, "regal");
//     const q = query(articleRef, 
//       // where("createdBy", "==", user.displayName)
//       );
//     onSnapshot(q, (snapshot) => {
//       const articles = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setArticles(articles);
//       console.log(articles);
      
//     });
//   }, []);

//   const handleClick = () => {
//     const url = `https://influencer-777.web.app/visitka/${id}`;
//     navigator.clipboard.writeText(url);
//     setCopied(true);
//   };
//   const [copied, setCopied] = useState(false);
  
//   return (
//     <div className="Visitka">
//       {/* <h1>визитка</h1> */}

//       {articles.length === 0 ? (
//         <p>Ты помалкиваешь о себе</p>
//       ) : (
//         articles.map(
//           ({
//             id,
//             title,
//             exp,
//             style,
//             price,
//             band,
//             actualband,
//             favband,
//             support,
//             message,
//             state,
//             description,
//             imageUrl,
//             createdAt,
//             createdBy,
//             userId,
//             likes,
//             comments,
//             // followers,
//           }) => (
//             <div className="Visitkacontent">
                

//               <div className="regalia" key={id}>
//               <div className="imgshell">
//                   <img className="vocimg" src={imageUrl} alt="title" />
//                   </div>
//                   {createdBy && (<span className="nick inset">
//                   {/* <h2>ник: </h2> */}
//                     {createdBy}</span>)}
//                   <div className="regaliatittle inset">
//                   <h2>специальность:</h2>
//                   {title}</div>
//                   <div className="regaliaexp inset">
//                   <h2>стаж:</h2>
//                   {exp}</div>
//                   <div className="regaliastyle inset">
//                   <h2>стиль:</h2>
//                   {style}
//                   </div>
//                   <div className="regaliaactualband inset">
//                   <h2>основной проект:</h2>
//                     {actualband}</div>
//                   <div className="regaliabands inset">
//                   <h2>проекты:</h2>
//                     {band}</div>
//                     <div className="regaliasupport inset">
//                   <h2>разогрев:</h2>
//                     {support}</div>
//                     <div className="regfavband inset">
//                     <h2>фавориты: </h2>
//                     {favband}</div>
//                     <div className="regmessage inset">
//                     <h2>доп. инфа: </h2>
//                     {message}</div>
//                     <div id="p_wrap" className="regtext inset">
//                     <h2>ссылка на тг:</h2>
//                     {description}</div>
//                     {/* <div className="regstate inset">
//                     <h2>статус: </h2>
//                     {state}</div> */}
//                   {/* <h5 className=></h5> */}
//                   {/* {comments && comments.length > 0 && (<div className="Comments"><p>{comments?.length} comments</p></div>)} */}
//                    {/* <p>{likes?.length} likes</p> */}
//                    {/* {user && <LikeArticle id={id} likes={likes} />}
//                     <div className="Likes">
//                       <p>{likes?.length} likes</p>
//                     </div> */}
//               </div>
              
//               <div className="visitkPannel">
                
                
//                 <button className="SHARE" onClick={handleClick}>
//                   {copied ? "готово" : "ссылка"}
//                   <img src={link} alt="" />
//                 </button>
//                 <button className="createvac">{copied ? "готово" : "пэйдж"}
//                 <Link style={{ textDecoration: 'none', color: 'white' }} to={`/guest/${userId}`}>
//                   <img src={userx} alt="" />
//                 </Link>
//                 </button>
//                 <Link to="/register">
//                   <div className="createprofile">
//                     <img src="https://cdn-icons-png.flaticon.com/512/711/711128.png" alt="" />
//                   </div>
//                 </Link>
//                 <button className="perhome "><Link style={{ textDecoration: 'none', color: 'white' }} to="/">
//                   <img src="https://i.pngimg.me/thumb/f/720/m2H7N4m2N4m2b1m2.jpg" alt="" />
//                 </Link></button>
//               </div>
             

//                 <Link to={`/vocancy/${id}`}>
//                 </Link>
                

//               {/* <div className="screen"></div> */}
//                       {/* {user && <LikeArticle id={id} likes={likes} />} */}
//                        {/* <div className="col-6 d-flex flex-row-reverse">
//                       {user && user.uid === userId && ( <DeleteArticle id={id} imageUrl={imageUrl} /> )}
//                           </div> */}
//             </div>
            
//           )
//         )
//       )}

//     </div>
//   );
// }