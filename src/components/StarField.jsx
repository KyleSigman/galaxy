import React, { useEffect, useRef, useState } from 'react';

const StarField = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const timeRef = useRef(0);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;
    
    // Вершинный шейдер - сохраняем вращение, но оптимизируем
    const vsSource = `
      attribute vec3 position;
      attribute vec3 color;
      attribute float size;
      
      uniform float uTime;
      uniform mat4 uProjection;
      uniform mat4 uView;
      
      varying vec3 vColor;
      varying float vDistance;
      
      void main() {
        // Сохраняем вращение, но оптимизируем вычисления
        float angle = uTime * 0.02;
        float c = cos(angle);
        float s = sin(angle);
        
        // Вращение вокруг Y
        vec3 rotatedPos;
        rotatedPos.x = position.x * c - position.z * s;
        rotatedPos.y = position.y;
        rotatedPos.z = position.x * s + position.z * c;
        
        vec4 viewPos = uView * vec4(rotatedPos, 1.0);
        vDistance = abs(viewPos.z);
        
        // Оптимизированный расчет размера - меньше операций
        float pointSize = size * (2.0 / (0.8 + vDistance * 0.6));
        
        // Простое мерцание только для дальних звезд, но без лишних условий в шейдере
        float twinkle = 0.85 + 0.15 * sin(uTime * 1.5 + position.x * 8.0);
        pointSize = pointSize * twinkle;
        
        gl_PointSize = clamp(pointSize, 0.8, 8.0);
        gl_Position = uProjection * viewPos;
        vColor = color;
      }
    `;

    // Фрагментный шейдер - оптимизируем без потери качества
    const fsSource = `
      precision mediump float;
      varying vec3 vColor;
      varying float vDistance;
      
      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) discard;
        
        // Мягкое падение яркости
        float brightness = (1.0 - r * 0.7);
        
        // Оптимизированный расчет цвета без множественных условий
        float t = clamp((vDistance - 0.8) * 0.8, 0.0, 1.0);
        vec3 coldWhite = vec3(0.9, 0.95, 1.0);
        vec3 finalColor = mix(vColor, coldWhite, t);
        
        // Яркость с расстоянием
        float distanceBrightness = 1.0 / (1.0 + vDistance * 0.5);
        float alpha = brightness * distanceBrightness * 0.9;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Компиляция шейдеров
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);
    programRef.current = program;

    // Компромиссное количество звезд - 2500 вместо 4000
    const starsCount = 900;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
      // Сфера с распределением для лучшей визуальной глубины
      const radius = 0.5 + Math.random() * 2.5;
      
      // Распределение для визуального интереса
      let r;
      if (Math.random() < 0.5) {
        r = 1.2 + Math.random() * 1.3; // Средние и дальние
      } else {
        r = 0.6 + Math.random() * 0.8; // Ближние
      }
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);

      // Яркие, заметные цвета
      if (r < 1.5) {
        // Ближние звезды - разноцветные, яркие
        const colorType = Math.random();
        if (colorType < 0.6) {
          // Голубовато-белые
          colors[i*3] = 0.7 + Math.random() * 0.3;
          colors[i*3+1] = 0.8 + Math.random() * 0.2;
          colors[i*3+2] = 1.0;
        } else if (colorType < 0.8) {
          // Теплые оттенки
          colors[i*3] = 1.0;
          colors[i*3+1] = 0.7 + Math.random() * 0.3;
          colors[i*3+2] = 0.6 + Math.random() * 0.4;
        } else {
          // Холодные синие
          colors[i*3] = 0.5 + Math.random() * 0.3;
          colors[i*3+1] = 0.6 + Math.random() * 0.3;
          colors[i*3+2] = 1.0;
        }
      } else {
        // Дальние звезды - холодный белый
        const base = 0.7 + Math.random() * 0.3;
        colors[i*3] = base * 0.9;
        colors[i*3+1] = base * 0.95;
        colors[i*3+2] = base;
      }

      // Размеры - заметные звезды
      if (r < 1.0) {
        sizes[i] = 2.5 + Math.random() * 2.0; // Крупные ближние
      } else if (r < 1.8) {
        sizes[i] = 1.5 + Math.random() * 1.5; // Средние
      } else {
        sizes[i] = 1.0 + Math.random() * 1.0; // Мелкие, но видимые
      }
    }

    // Настройка буферов
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    
    const colorLoc = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    
    const sizeLoc = gl.getAttribLocation(program, 'size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // Матрицы
    const uProjection = gl.getUniformLocation(program, 'uProjection');
    const uView = gl.getUniformLocation(program, 'uView');
    const uTime = gl.getUniformLocation(program, 'uTime');

    // Матрица проекции
    const aspect = canvas.width / canvas.height;
    const projectionMatrix = new Float32Array(16);
    perspective(projectionMatrix, 45 * Math.PI / 180, aspect, 0.1, 10.0);
    gl.uniformMatrix4fv(uProjection, false, projectionMatrix);

    // Матрица вида
    const viewMatrix = new Float32Array(16);
    lookAt(viewMatrix, [0, 0, 3.0], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(uView, false, viewMatrix);

    // Оптимизации WebGL
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false); // Отключаем запись в depth buffer для производительности
    
    // Анимация
    let frameCount = 0;
    let lastTime = performance.now();
    
    const animate = () => {
      if (!gl || !program) return;
      
      const now = performance.now();
      const delta = now - lastTime;
      
      // Плавная анимация без throttle для сохранения визуального эффекта
      timeRef.current += 0.012; // Немного медленнее вращения для плавности
      
      // Обновляем размер canvas при изменении окна
      if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const newAspect = canvas.width / canvas.height;
        perspective(projectionMatrix, 45 * Math.PI / 180, newAspect, 0.1, 10.0);
        gl.uniformMatrix4fv(uProjection, false, projectionMatrix);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      
      gl.clearColor(0.02, 0.02, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.uniform1f(uTime, timeRef.current);
      gl.drawArrays(gl.POINTS, 0, starsCount);
      
      frameCount++;
      lastTime = now;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию с небольшой задержкой для стабильности
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);
    
    // Функции матриц
    function perspective(m, fov, aspect, near, far) {
      const f = 1.0 / Math.tan(fov / 2);
      const nf = 1 / (near - far);
      m[0] = f / aspect; m[1] = 0; m[2] = 0; m[3] = 0;
      m[4] = 0; m[5] = f; m[6] = 0; m[7] = 0;
      m[8] = 0; m[9] = 0; m[10] = (far + near) * nf; m[11] = -1;
      m[12] = 0; m[13] = 0; m[14] = (2 * far * near) * nf; m[15] = 0;
    }
    
    function lookAt(m, eye, center, up) {
      const z = normalize(sub(eye, center));
      const x = normalize(cross(up, z));
      const y = cross(z, x);
      
      m[0] = x[0]; m[1] = y[0]; m[2] = z[0]; m[3] = 0;
      m[4] = x[1]; m[5] = y[1]; m[6] = z[1]; m[7] = 0;
      m[8] = x[2]; m[9] = y[2]; m[10] = z[2]; m[11] = 0;
      m[12] = -dot(x, eye); m[13] = -dot(y, eye); m[14] = -dot(z, eye); m[15] = 1;
    }
    
    function normalize(v) {
      const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
      return [v[0]/len, v[1]/len, v[2]/len];
    }
    
    function cross(a, b) {
      return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
      ];
    }
    
    function dot(a, b) {
      return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    }
    
    function sub(a, b) {
      return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(colorBuffer);
        gl.deleteBuffer(sizeBuffer);
      }
    };
  }, [dimensions]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #000 100%)'
      }}
    />
  );
};

export default StarField;
