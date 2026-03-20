import React from "react";
import { useAuthState} from "react-firebase-hooks/auth";
import { auth, db,  } from "../firebase";
import { useContext, } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function LikePower({ id, likes }) 
{
  
  const {currentUser} = useContext(AuthContext)
  const [user] = useAuthState(auth);

    const likesRef = doc(db, "Posts", id);
    const goodsRef = doc(db, "users", currentUser.uid, "goods", "rewards");

    const handleLike = async () => {
        const rewardsDoc = await getDoc(goodsRef);
        const currentLikes = rewardsDoc.data().likes || 0;
        
        if (currentLikes <= 0) {
        console.log("У вас нет очков, чтобы ставить лайк");
        return;
        }
        
        if (likes.includes(user.uid)) {
        updateDoc(likesRef, { likes: arrayRemove(user.uid) });
        updateDoc(goodsRef, { likes: currentLikes +1 });
        console.log("unliked");
        } else {
        updateDoc(likesRef, { likes: arrayUnion(user.uid) });
        updateDoc(goodsRef, { likes: currentLikes - 1 });
        console.log("liked");
        }
        };

  return (
    <div className="LikePost">
      <p>{likes.length}</p>
      <i
        className={`fa fa-heart${!likes?.includes(user.uid) ? "-o" : ""} fa-lg`}
        style={{
          cursor: "pointer",
          color: likes?.includes(user.uid) ? "#ff0808" : null,
        }}
        onClick={handleLike}
      />

    </div>
  );
}

