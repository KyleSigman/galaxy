import React, { useState } from 'react';
import { Pannellum } from 'pannellum-react';

// Импортируем картинки для дня и ночи
import muzaDay from "../img/muza.jpg"; // День
import muzaNight from "../img/night.jpg"; // Ночь

const SkyBoxMuza = () => {
    const [currentScene, setCurrentScene] = useState(muzaDay); // Устанавливаем сцену по умолчанию - день

    const handleSceneChange = (event) => {
        const selectedScene = event.target.value === 'day' ? muzaDay : muzaNight;
        setCurrentScene(selectedScene);
    };

    return (
        <div className='SkyBoxMuza'>
            <Pannellum
                width="100%"
                height="100%"
                image={currentScene}
                yaw={300}
                hfov={110}
                autoLoad
                autoRotate={-3}
                compass={false}  // Устанавливаем компас в false, чтобы убрать его
                showZoomCtrl={false}
                mouseZoom={false}
                onMouseUp={() => {
                    // Включение автоповорота после отпускания мыши
                    setCurrentScene(currentScene); // При необходимости обновите логику
                }}
            />

            <div
                className="radio-container"
                style={{
                    position: 'absolute',
                    bottom: '20px', // Отвечает за расстояние от нижней части экрана
                    left: '50%',
                    transform: 'translateX(-50%)', // Центрирует контейнер
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Полупрозрачный белый фон
                    padding: '10px',
                    borderRadius: '5px', // Скругленные углы
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Тень для выделения
                }}
            >
                <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        value="day"
                        checked={currentScene === muzaDay}
                        onChange={handleSceneChange}
                        style={{ display: 'none' }} // Скрыть стандартную радиокнопку
                    />
                    <span
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: currentScene === muzaDay ? 'cyan' : 'white', // Цвет радиокнопки зависит от состояния выбора
                            border: '2px solid #007bff', // Цвет ободка
                            transition: 'background-color 0.3s',
                        }}
                    />
                    День
                </label>
                <label style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        value="night"
                        checked={currentScene === muzaNight}
                        onChange={handleSceneChange}
                        style={{ display: 'none' }} // Скрыть стандартную радиокнопку
                    />
                    <span
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: currentScene === muzaNight ? 'cyan' : 'white', // Цвет радиокнопки зависит от состояния выбора
                            border: '2px solid #007bff', // Цвет ободка
                            transition: 'background-color 0.3s',
                        }}
                    />
                    Ночь
                </label>
            </div>
        </div>
    );
};

export default SkyBoxMuza;

// import React from 'react'
// import { useState } from 'react'
// import {Pannellum} from 'pannellum-react'
// import zeppelin from "../img/muza.jpg"
// const SkyBoxMuza = () => {

//     const [currentScene, setCurrentScene] = useState(zeppelin)

//   return (
//     <div className='SkyBoxMuza' >
 
//         <Pannellum
//         width="100%"
//         height="100%"
//         image={currentScene}
//         yaw={300}
//         hfow={110}
//         autoLoad
//         autoRotate={-3}
//         compass={true}
//         showZoomCtrl={false}
//         mouseZoom={false}
//         onMouseUp={() => {
//         setCurrentScene(zeppelin);
//         }}
//         >
//         </Pannellum>

//     </div>
//   )
// }

// export default SkyBoxMuza