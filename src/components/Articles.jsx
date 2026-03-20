import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";
import LikeArticle from "../components/LikeArticle";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
export default function Articles() {

  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const q = query(articleRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articles);
      console.log(articles);
    });
  }, []);
  return (
    <div className="Lenta">
      <div className="news">NEWS</div>

      <div className="newscontent">

      {articles.length === 0 ? (
        <p>No articles found!</p>
      ) : (
        articles.map(
          ({
            id,
            title,
            description,
            imageUrl,
            createdAt,
            createdBy,
            userId,
            likes,
            comments,
            // followers,
          }) => (
            <div className="artcontent lsc">
              
              <div className="article" key={id}>
                  <Link to={`/article/${id}`}>
                  <img className="artimg" src={imageUrl} alt="title" />
                  </Link>
                  {createdBy && (<span className="badge bg-primary">{createdBy}</span>)}
                  <h3 className="arttittle">{title}</h3>
                  <p>{createdAt.toDate().toDateString()}</p>
                  <div className="arttext">{description}</div>
                  {/* <h5 className=></h5> */}
                  {comments && comments.length > 0 && (<div className="Comments"><p>{comments?.length} comments</p></div>)}
                   {/* <p>{likes?.length} likes</p> */}

                   {user && <LikeArticle id={id} likes={likes} />}
                    <div className="Likes">
                      <p>{likes?.length} likes</p>
                    </div>
                  
                  

              </div>
              <div className="screen"></div>

              
              
  
                   
                  
                      {/* {user && <LikeArticle id={id} likes={likes} />} */}
                       {/* <div className="col-6 d-flex flex-row-reverse">
                      {user && user.uid === userId && ( <DeleteArticle id={id} imageUrl={imageUrl} /> )}
                          </div> */}
            </div>
            
          )
        )
      )}


      </div>

      {/* <Comments/> */}
      
      
    </div>
  );
}