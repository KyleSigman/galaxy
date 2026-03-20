import React, { useState, useRef, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';

import day from "../img/mount.jpg";
import night from "../img/night.jpg";
import night2 from "../img/--market.jpg";
import night3 from "../img/g17.png";


const SkyBox = ({ isActive }) => {
  const [currentScene, setCurrentScene] = useState(night);
  const [brightness, setBrightness] = useState(0.5); // Начальная яркость
  const pannellumRef = useRef(null);

  useEffect(() => {
      if (isActive) {
          pannellumRef.current?.getViewer()?.resize();
      }
  }, [isActive]);

  const handleSceneChange = (event) => {
      const selectedScene = event.target.value === 'day' ? day :
          event.target.value === 'night' ? night :
          event.target.value === 'night2' ? night2 : night3;
      setCurrentScene(selectedScene);
  };

  const handleSliderChange = (event) => {
      const value = event.target.value;
      setBrightness(value); // Обновляем состояние яркости
  };

  return (
      <div className={`SkyBox ${isActive ? "active3" : ""}`} style={{ filter: `brightness(${brightness})` }}>
          <Pannellum
              ref={pannellumRef}
              width="100%"
              height="100%"
              image={currentScene}
              yaw={260}
              hfov={110}
              autoLoad
              autoRotate={-1}
              compass={false}
              showZoomCtrl={false}
              mouseZoom={false}
              onMouseUp={() => {
                  // Включение автоповорота после отпускания мыши
                  setCurrentScene(day);
              }}
          />

          <div className="controls" style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0)', width: '150px', height: '50px', bottom: '100px', left: '59%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <div className="radio-container" style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
                  <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                      <input
                          type="radio"
                          value="day"
                          checked={currentScene === day}
                          onChange={handleSceneChange}
                          style={{ display: 'none' }}
                      />
                      <span style={{
                          position: 'absolute', left: 0, top: '50%',
                          transform: 'translateY(-50%)', width: '20px', height: '20px',
                          borderRadius: '50%', backgroundColor: currentScene === day ? 'cyan' : 'white',
                          border: '2px solid #007bff', transition: 'background-color 0.3s'
                      }} />
                      
                  </label>
                  <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                      <input
                          type="radio"
                          value="night"
                          checked={currentScene === night}
                          onChange={handleSceneChange}
                          style={{ display: 'none' }}
                      />
                      <span style={{
                          position: 'absolute', left: 0, top: '50%',
                          transform: 'translateY(-50%)', width: '20px', height: '20px',
                          borderRadius: '50%', backgroundColor: currentScene === night ? 'cyan' : 'white',
                          border: '2px solid #007bff', transition: 'background-color 0.3s'
                      }} />
                      
                  </label>
                  <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                      <input
                          type="radio"
                          value="night2"
                          checked={currentScene === night2}
                          onChange={handleSceneChange}
                          style={{ display: 'none' }}
                      />
                      <span style={{
                          position: 'absolute', left: 0, top: '50%',
                          transform: 'translateY(-50%)', width: '20px', height: '20px',
                          borderRadius: '50%', backgroundColor: currentScene === night2 ? 'cyan' : 'white',
                          border: '2px solid #007bff', transition: 'background-color 0.3s'
                      }} />
                      
                  </label>
                  <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                      <input
                          type="radio"
                          value="night3"
                          checked={currentScene === night3}
                          onChange={handleSceneChange}
                          style={{ display: 'none' }}
                      />
                      <span style={{
                          position: 'absolute', left: 0, top: '50%',
                          transform: 'translateY(-50%)', width: '20px', height: '20px',
                          borderRadius: '50%', backgroundColor: currentScene === night3 ? 'cyan' : 'white',
                          border: '2px solid #007bff', transition: 'background-color 0.3s'
                      }} />
                      
                  </label>
              </div>

              <input
                className="custom-range" // добавьте класс для стилей
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={brightness}
                  onChange={handleSliderChange}
                  style={{
                      width: '120px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      transform: 'rotate(0deg)' // Вертикальное размещение
                  }}
              />
          </div>
      </div>
  );
};

export default SkyBox;

// import React from 'react'
// import { useState, useRef, useEffect } from 'react'
// import {Pannellum} from 'pannellum-react'

// import day from "../img/g17.png"
// import night from "../img/night.jpg"
// import night2 from "../img/night2.jpg"
// import night3 from "../img/night3.jpg"

// const SkyBox = ({ isActive }) => {

//     const [currentScene, setCurrentScene] = useState(day)
// const pannellumRef = useRef(null);

// useEffect(() => {
// if (isActive) {
// pannellumRef.current?.getViewer()?.resize();
// }
// }, [isActive]);

//   return (
//     <div className={`SkyBox ${isActive ? "active3" : ""}`}>
//         <Pannellum
//         ref={pannellumRef}
//         width="100%"
//         height="100%"
//         image={currentScene}
//         yaw={260}
//         hfow={110}
//         autoLoad
//         autoRotate={-1}
//         compass={false}
//         showZoomCtrl={false}
//         mouseZoom={false}
//         onMouseUp={() => {
//         setCurrentScene(day);
//         }}
//         >

//         </Pannellum>

//     </div>
//   )
// }


// export default SkyBox

