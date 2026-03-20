import React from 'react'
import { useState } from 'react'
import {Pannellum} from 'pannellum-react'

// import zeppelin from "../img/zeppelin.png"
import zeppelin from "../img/nice.jpg"
const SkyBoxN = () => {

    const [currentScene, setCurrentScene] = useState(zeppelin)

  return (
    <div className='SkyBoxE' >
 
        <Pannellum
        width="100%"
        height="100%"
        image={currentScene}
        yaw={300}
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

export default SkyBoxN