// import React, { useEffect, useRef } from 'react';

// const StarField = () => {
//   const canvasRef = useRef(null);
//   const glRef = useRef(null);
//   const programRef = useRef(null);
//   const timeRef = useRef(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const gl = canvas.getContext('webgl');
//     glRef.current = gl;

//     // Вершинный шейдер
//     const vsSource = `
//       attribute vec3 position;
//       attribute vec3 color;
//       attribute float size; // Индивидуальный размер звезды
      
//       uniform float uTime;
//       uniform mat4 uProjection;
//       uniform mat4 uView;
      
//       varying vec3 vColor;
//       varying float vDistance; // Для передачи расстояния в фрагментный шейдер
      
//       void main() {
//         // Медленное вращение вокруг Y
//         float angle = uTime * 0.02;
//         float c = cos(angle);
//         float s = sin(angle);
        
//         vec3 rotatedPos;
//         rotatedPos.x = position.x * c - position.z * s;
//         rotatedPos.y = position.y;
//         rotatedPos.z = position.x * s + position.z * c;
        
//         // Вычисляем расстояние от камеры (z в видовых координатах)
//         vec4 viewPos = uView * vec4(rotatedPos, 1.0);
//         vDistance = abs(viewPos.z); // Расстояние до камеры
        
//         // Размер зависит от расстояния (дальше - меньше)
//         // и от базового размера звезды
//         float pointSize = size * (2.5 / (1.0 + vDistance * 0.8));
        
//         // Легкое мерцание для дальних звезд
//         float twinkle = 0.8 + 0.2 * sin(uTime * 2.0 + position.x * 10.0);
//         if (vDistance > 1.5) {
//           pointSize *= twinkle;
//         }
        
//         gl_PointSize = pointSize;
//         gl_Position = uProjection * viewPos;
//         vColor = color;
//       }
//     `;

//     // Фрагментный шейдер
//     const fsSource = `
//       precision mediump float;
//       varying vec3 vColor;
//       varying float vDistance;
      
//       void main() {
//         vec2 cxy = 2.0 * gl_PointCoord - 1.0;
//         float r = dot(cxy, cxy);
//         if (r > 1.0) discard; // Круглая точка
        
//         // Мягкое падение яркости к краям
//         float brightness = (1.0 - r * 0.7);
        
//         // Цвет зависит от расстояния
//         vec3 finalColor;
        
//         if (vDistance < 1.0) {
//           // Близкие звезды - с оттенком
//           finalColor = vColor;
//         } else if (vDistance < 1.8) {
//           // Средние звезды - смесь цвета и белого
//           float t = (vDistance - 1.0) / 0.8;
//           vec3 coldWhite = vec3(0.9, 0.95, 1.0); // Холодный белый с голубизной
//           finalColor = mix(vColor, coldWhite, t);
//         } else {
//           // Дальние звезды - холодный белый
//           float blueShift = 0.9 + 0.1 * sin(vDistance * 5.0); // Легкая вариация
//           finalColor = vec3(0.85, 0.9, 1.0) * blueShift;
//         }
        
//         // Яркость зависит от расстояния (дальше - тусклее)
//         float distanceBrightness = 1.0 / (1.0 + vDistance * 0.4);
        
//         // Итоговый цвет с альфа-каналом для мягкости
//         float alpha = brightness * distanceBrightness * 0.9;
//         gl_FragColor = vec4(finalColor, alpha);
//       }
//     `;

//     // Компиляция шейдеров
//     const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertexShader, vsSource);
//     gl.compileShader(vertexShader);

//     const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragmentShader, fsSource);
//     gl.compileShader(fragmentShader);

//     const program = gl.createProgram();
//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);
//     gl.useProgram(program);
//     programRef.current = program;

//     // Создание звезд - больше, с вариациями
//     const starsCount = 4000;
//     const positions = new Float32Array(starsCount * 3);
//     const colors = new Float32Array(starsCount * 3);
//     const sizes = new Float32Array(starsCount);

//     for (let i = 0; i < starsCount; i++) {
//       // Сфера со случайным радиусом - больше дальних звезд
//       const radius = 0.5 + Math.random() * 2.0; // от 0.5 до 2.5
      
//       // Распределение: больше звезд на дальних слоях
//       let r;
//       if (Math.random() < 0.6) {
//         // 60% звезд - дальние (1.5 - 2.5)
//         r = 1.5 + Math.random() * 1.0;
//       } else {
//         // 40% - ближние (0.5 - 1.5)
//         r = 0.5 + Math.random() * 1.0;
//       }
      
//       const theta = Math.random() * Math.PI * 2;
//       const phi = Math.acos(2 * Math.random() - 1);
      
//       positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
//       positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
//       positions[i*3+2] = r * Math.cos(phi);

//       // Цвет: только для ближних звезд, очень бледные оттенки
//       if (r < 1.5) { // Все звезды ближе 1.5 получают оттенок
//         // Более разнообразные холодные оттенки
//         const hue = 0.5 + Math.random() * 0.4; // Голубые, синие, чуть фиолетовые
//         const intensity = 0.6 + Math.random() * 0.9; // Выше интенсивность
        
//         // Конвертация HSV в RGB (упрощенно)
//         colors[i*3] = (0.5 + 0.5 * Math.sin(hue * 6.283)) * intensity + 0.7;
//         colors[i*3+1] = (0.5 + 0.5 * Math.sin(hue * 6.283 + 2.094)) * intensity + 0.75;
//         colors[i*3+2] = (0.5 + 0.5 * Math.sin(hue * 6.283 + 4.188)) * intensity + 0.9;
//       } else {
//         // Холодный белый с легкими вариациями
//         const base = 0.85 + Math.random() * 0.15;
//         colors[i*3] = base * (0.95 + Math.random() * 0.05);
//         colors[i*3+1] = base * (0.98 + Math.random() * 0.05);
//         colors[i*3+2] = 1.0;
//       }

//       // Размер звезды (случайный, зависит от расстояния)
//       if (r < 1.0) {
//         sizes[i] = 2.0 + Math.random() * 2.0; // Ближние крупнее
//       } else if (r < 1.8) {
//         sizes[i] = 1.0 + Math.random() * 1.5; // Средние
//       } else {
//         sizes[i] = 0.5 + Math.random() * 1.0; // Дальние мельче
//       }
//     }

//     // Буфер позиций
//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
//     const positionLoc = gl.getAttribLocation(program, 'position');
//     gl.enableVertexAttribArray(positionLoc);
//     gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

//     // Буфер цветов
//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    
//     const colorLoc = gl.getAttribLocation(program, 'color');
//     gl.enableVertexAttribArray(colorLoc);
//     gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

//     // Буфер размеров
//     const sizeBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    
//     const sizeLoc = gl.getAttribLocation(program, 'size');
//     gl.enableVertexAttribArray(sizeLoc);
//     gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

//     // Матрицы
//     const uProjection = gl.getUniformLocation(program, 'uProjection');
//     const uView = gl.getUniformLocation(program, 'uView');
//     const uTime = gl.getUniformLocation(program, 'uTime');

//     // Матрица проекции (перспектива)
//     const aspect = canvas.width / canvas.height;
//     const projectionMatrix = new Float32Array(16);
//     perspective(projectionMatrix, 45 * Math.PI / 180, aspect, 0.1, 10.0);
//     gl.uniformMatrix4fv(uProjection, false, projectionMatrix);

//     // Матрица вида (камера)
//     const viewMatrix = new Float32Array(16);
//     lookAt(viewMatrix, [0, 0, 3.0], [0, 0, 0], [0, 1, 0]);
//     gl.uniformMatrix4fv(uView, false, viewMatrix);

//     // Анимация
//     const animate = () => {
//       if (!gl || !program) return;

//       timeRef.current += 0.01; // Медленное вращение

//       gl.clearColor(0.02, 0.02, 0.05, 1); // Темно-синий фон
//       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//       gl.uniform1f(uTime, timeRef.current);

//       gl.drawArrays(gl.POINTS, 0, starsCount);

//       requestAnimationFrame(animate);
//     };

//     animate();

//     // Математика для матриц (без изменений)
//     function perspective(m, fov, aspect, near, far) {
//       const f = 1.0 / Math.tan(fov / 2);
//       const nf = 1 / (near - far);
//       m[0] = f / aspect; m[1] = 0; m[2] = 0; m[3] = 0;
//       m[4] = 0; m[5] = f; m[6] = 0; m[7] = 0;
//       m[8] = 0; m[9] = 0; m[10] = (far + near) * nf; m[11] = -1;
//       m[12] = 0; m[13] = 0; m[14] = (2 * far * near) * nf; m[15] = 0;
//     }

//     function lookAt(m, eye, center, up) {
//       const z = normalize(sub(eye, center));
//       const x = normalize(cross(up, z));
//       const y = cross(z, x);

//       m[0] = x[0]; m[1] = y[0]; m[2] = z[0]; m[3] = 0;
//       m[4] = x[1]; m[5] = y[1]; m[6] = z[1]; m[7] = 0;
//       m[8] = x[2]; m[9] = y[2]; m[10] = z[2]; m[11] = 0;
//       m[12] = -dot(x, eye); m[13] = -dot(y, eye); m[14] = -dot(z, eye); m[15] = 1;
//     }

//     function normalize(v) {
//       const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
//       return [v[0]/len, v[1]/len, v[2]/len];
//     }

//     function cross(a, b) {
//       return [
//         a[1]*b[2] - a[2]*b[1],
//         a[2]*b[0] - a[0]*b[2],
//         a[0]*b[1] - a[1]*b[0]
//       ];
//     }

//     function dot(a, b) {
//       return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
//     }

//     function sub(a, b) {
//       return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
//     }

//     // Очистка не нужна - обработчиков событий больше нет
//     return () => {};
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         zIndex: 0,
//         pointerEvents: 'none', // Отключаем взаимодействие
//         background: 'linear-gradient(135deg, #0a0a1a 0%, #000 100%)' // Градиентный фон
//       }}
//       width={window.innerWidth}
//       height={window.innerHeight}
//     />
//   );
// };

// export default StarField;