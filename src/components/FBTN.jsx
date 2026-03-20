import { useState, useEffect, useContext } from 'react';
import { doc, collection, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";

const SubscriptionButton = ({ postId }) => {
const [isFollowing, setIsFollowing] = useState(false);

useEffect(() => {
const loadDataFromDatabase = async () => {
const followingRef = doc(collection(db, "users", auth.currentUser.uid, "following"));
const followingSnapshot = await getDoc(followingRef);

setIsFollowing(followingSnapshot.exists());
};

loadDataFromDatabase();
}, []);

const handleSubscription = async () => {
const followingRef = doc(collection(db, "users", auth.currentUser.uid, "following"));

if (isFollowing) {
await deleteDoc(followingRef);
} else {
await setDoc(followingRef, {});
}

setIsFollowing(!isFollowing);
};

    return (
        <div className="FBTN" >
<botton onClick={handleSubscription}
        className="FOLLOW"
        style={{ width: 100, 
          padding: 10, 
          cursor: "pointer" }}
            >{isFollowing ? "Unfollow" : "+Follow"}</botton>
        </div>
      );
};

export default SubscriptionButton;