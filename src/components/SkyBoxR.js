import React from 'react'
import { useState, useRef, useEffect } from 'react'
import {Pannellum} from 'pannellum-react'

// import zeppelin from "../img/zeppelin.png"
import zeppelin from "../img/register.jpg"
const SkyBoxR = ({ isActive }) => {

  const pannellumRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      pannellumRef.current?.getViewer()?.resize();
    }
  }, [isActive]);

    const [currentScene, setCurrentScene] = useState(zeppelin)

  return (
    <div className={`SkyBox ${isActive ? "active3" : ""}`} >
 
        <Pannellum
        ref={pannellumRef}
        width="100%"
        height="100%"
        image={currentScene}
        yaw={180}
        hfow={110}
        autoLoad
        autoRotate={-3}
        compass={true}
        showZoomCtrl={false}
        mouseZoom={false}
        onMouseUp={() => {
        // Включение автоповорота после отпускания мыши
        setCurrentScene(zeppelin);
        }}
        >
        </Pannellum>

    </div>
  )
}

export default SkyBoxR