import React from 'react'
import { useState } from 'react'
import {Pannellum} from 'pannellum-react'

// import zeppelin from "../img/zeppelin.png"
import zeppelin from "../img/register.jpg"
const SkyBoxP = () => {

    const [currentScene, setCurrentScene] = useState(zeppelin)

  return (
    <div className='SkyBoxP' >
 
        <Pannellum
        width="100%"
        height="100%"
        image={currentScene}
        yaw={300}
        hfow={110}
        autoLoad
        autoRotate={-2}
        compass={false}
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

export default SkyBoxP