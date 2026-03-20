  import React from "react";
  import Profile from '../components/Profile'
  // import List from '../components/List'
  import SkyBox from "../components/SkyBox";
  import Posts from '../components/Posts'
  import { signOut } from "firebase/auth"
  import { auth } from '../firebase'
  import { storage } from "../firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import visa from "../img/visa.png"
  import pazzle from "../img/circpazz.png"
  import mstar from "../img/mstatrr.png"
  import cat from "../img/cat.png"
  import con from "../img/conn.jpg"
  import wall from "../img/smartwall.jpg"
  import { db } from "../firebase";
  import { Helmet } from 'react-helmet';

const Home = () => {

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const container = React.useRef(null);

  const [isActive, setIsActive] = React.useState(false);

  const onSky = (e) => {
    setIsActive(!isActive);  // Изменяем состояние isActive при каждом клике
  };
  const onRemoveClickWall = (e) => {
    container.current.classList.remove("active3");
  };
  const onToggleClickWall = () => {
    // setIsPostsLoaded(false); // Сбрасываем состояние перед загрузкой новых постов
    container.current.classList.toggle("active3"); // Тогглим стиль контейнера
  };
  const onRemoveClickpost = (e) => {
    container.current.classList.remove("active");
  };
  const onToggleClickpost = (e) => {
    container.current.classList.add("active");
  };
  const onRemoveClickusers = (e) => {
    container.current.classList.remove("active2");
  };
  const onToggleClickusers = (e) => {
    container.current.classList.toggle("active2");
  };
  const onAddStar = (e) => {
    container.current.classList.add("active2");
  };
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  };
  const handleSubmit = (e) => {
    const imageRef = ref(storage, "image")
    uploadBytes(imageRef, image).then(() => {
      getDownloadURL(imageRef).then((url) => {
        setUrl(url);
      }).catch(console.log.error())
    })
  };


  const [isListVisible, setIsListVisible] = useState(false);

  const onToggleClickUsers = () => {
    setIsListVisible(true);
  };
  const onRemoveClickUsers = () => {
    setIsListVisible(false);
  };

  return (
    <div className='home'>

      <SkyBox isActive={isActive} />

      <div className="footer">
        <div className="footersector">
          {/* <h1>StarPage</h1> */}

          {/* <h1>stinkylink</h1> */}
          {/* <h1>FirePerson</h1> */}

          {/* <h1>NextPage</h1> */}
          {/* <h1>Grandiose</h1> */}
          {/* <h1>DreamPage</h1> */}

          {/* <h1>Perfomatrix</h1> */}
          {/* <h1>Solidarity</h1> */}
          {/* <h1>Epicentric</h1> */}
          {/* <h1>Resonanser</h1> */}
          {/* <h1>excentriq</h1> */}
          {/* <h1>streammate</h1> */}

          {/* <h1>IndigoFlow</h1> */}
          {/* <h1>Performer</h1> */}
          {/* <h1>lookingood</h1> */}

          {/* <h1>Crazeflow</h1> */}
          {/* <h1>Perfomancer</h1> */}
          {/* <h1>Infludance</h1> */}

          {/* <h1>Vernisage</h1> */}
          {/* <h1>Fatonus</h1> */}
          {/* <h1>fatonika</h1> */}

        </div>
        <div className="ProfileControls">

          {/* <div id="c2" className="cont"
            onClick={() => {
              onRemoveClickusers()
              onRemoveClickpost()
              onRemoveClickWall()
            }}
          >
            <img src={mstar} alt="" />
           
          </div> */}
          <div id="c1" className="cont"
                      onClick={() => {
                        onAddStar()
                        
                        onRemoveClickpost()
                        onRemoveClickWall()
                      }}
          >
          <img src="https://www.transparentpng.com/thumb/user/blak-frame-user-profile-png-icon--cupR3D.png" alt="" />
          </div>
          <div id="c1" className="cont"
            onClick={() => {
              onToggleClickpost()
              onRemoveClickusers()
              onToggleClickUsers();
              onRemoveClickWall()

            }}
          >
            <img src={con} alt=""
            style={{rotate:"90deg"}}
            />
            {/* <img src="https://static.thenounproject.com/png/3628057-200.png" alt="" /> */}

          </div>
          <div id="c7" className="cont">
            <Link to={`/finder/`}>
              <div className="wisplink">
                <img src={pazzle} alt="" />

                {/* https://cdn-icons-png.freepik.com/512/2502/2502342.png
                https://cdn-icons-png.freepik.com/512/478/478885.png
                https://cdn-icons-png.freepik.com/512/2755/2755577.png */}
              </div>
            </Link>
          </div>
          {/* <div id="c6" className="cont">
            <Link to={`/news/`}>
              <div className="newslink">
                <img src="https://cdn-icons-png.freepik.com/512/1042/1042782.png" alt="" />
              </div>
            </Link>
          </div> */}

        </div>
      </div>

      <div className="homecontainer" ref={container}
      >
        <Profile />
        <div>
        </div>

        {/* {isListVisible && <List shouldLoad={isListVisible} />} */}
        {/* <Performers /> */}

        <Helmet>

          <title>StarField</title>
          <meta name="description" content='межгалактическая сеть' />
          <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/influencer-777.appspot.com/o/images%2F1714022365029sp.png?alt=media&token=a96a5c17-e3ff-4c07-a00a-7e245ab4b17a" />
          {/* <meta property="og:image" content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRanwb1wg8-gdG9VZT8SgXyxOb5Diwzakfrjs_JCwlvt4RqGcZL8md-KK_AOtUZKRwvw3I&usqp=CAU" /> */}
          <meta property="og:image:width" content="630" />
          <meta property="og:image:height" content="630" />
        </Helmet>

      </div>

      <div className="showwall" onClick={() => {
        onToggleClickWall();
        onRemoveClickpost();
        onRemoveClickusers();
        // onToggleClickUsers();
      }}>
        {/* <img src="https://cdn-icons-png.flaticon.com/512/103/103410.png" alt="" /> */}
        {/* <img src={wall} alt="" /> */}
      </div>
      
      <div className="mainmenue">

        <div className="skybtn" onClick={onSky}>dope</div>
        <Link to={`/login/`}>
          <div className="logout" onClick={() => signOut(auth)}
          style={{textDecoration: 'none'}}
          >
            logout
            {/* <img src="https://cdn.icon-icons.com/icons2/2518/PNG/512/logout_icon_151219.png" alt="" /> */}
          </div>
        </Link>
      </div>

    </div>
  )
}

export default Home;

