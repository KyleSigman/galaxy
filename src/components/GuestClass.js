// import {   collection,   query,   onSnapshot,  } from "firebase/firestore";
// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { db, auth } from "../firebase";
// import "../pages/Todo.css";
// import Gclass from "../components/gclass"
// import { useParams } from "react-router-dom";

// const UserClass = () => {


//     const { id } = useParams();
//   const [classes, setClasses] = React.useState([]);
//   const {currentUser} = useContext(AuthContext)

//   React.useEffect(() => {
//     if(auth.currentUser) {
//       let uid = auth.currentUser.uid;
//       const q = query(collection(db, "users", id, "Class"));
//       const unsub = onSnapshot(q, (querySnapshot) => {
//         let todosArray = [];
//         querySnapshot.forEach((doc) => {
//           todosArray.push({ ...doc.data(), id: doc.id });
//         });
//         setClasses(todosArray);

//       });
//       return () => unsub();
//     }
   
//   }, [currentUser]);


//   return (
    
//     <div className='UserClass'>

//         {classes && classes.map((clazz) =>(
          
//           <Gclass
//           key={clazz.id}
//           clazz={clazz}
//         //   handleDelete={handleDelete}
//         //   handleEdit={handleEdit}
//           />
//         ))}
//       </div>
    
//   );
// };

// export default UserClass;