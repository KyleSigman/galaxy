import React from 'react'
import { useState } from 'react'
import {Pannellum} from 'pannellum-react'

// import zeppelin from "../img/zeppelin.png"
import zeppelin from "../img/Pazzle2.jpg"
const SkyBoxG = () => {

    const [currentScene, setCurrentScene] = useState(zeppelin)

  return (
    <div className='SkyBoxGame' >
 
        <Pannellum
        width="100%"
        height="100%"
        image={currentScene}
        yaw={-600}
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

export default SkyBoxG