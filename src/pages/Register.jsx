import React, { useState, useRef } from 'react';
import { db } from '../galaconfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SkyBoxR from "../components/SkyBoxR";
import './RegisterWizard.scss';

const RegisterWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    galaxyName: '',
    instruments: [],
    styles: [],
    avatar: '',
    key: ''
  });
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [styleInput, setStyleInput] = useState('');
  const [visualKeyCanvas, setVisualKeyCanvas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Генерация ключа
  const generateKey = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Проверка уникальности galaxyName
  const checkGalaxyName = async (name) => {
    try {
      const q = query(collection(db, 'users'), where('galaxyName', '==', name));
      const snapshot = await getDocs(q);
      return snapshot.empty;
    } catch (error) {
      console.log('Firebase error:', error);
      return false;
    }
  };

  // Ресайз и конвертация аватара
  const resizeAndConvertToBase64 = (file, maxWidth = 100, onProgress) => {
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const ratio = img.height / img.width;
          canvas.width = maxWidth;
          canvas.height = maxWidth * ratio;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            onProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              const base64 = canvas.toDataURL('image/jpeg', 0.8);
              resolve(base64);
            }
          }, 50);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const seededRandom = (seed, offset) => {
    const x = Math.sin(seed * (offset + 1)) * 10000;
    return x - Math.floor(x);
  };

    // const drawVisualKey = (key) => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
    
  //   const ctx = canvas.getContext('2d');
  //   canvas.width = 200;
  //   canvas.height = 200;
    
  //   ctx.fillStyle = '#0a0a0f';
  //   ctx.fillRect(0, 0, 200, 200);
    
  //   const colors = ['#ff00ff', '#00ffff', '#b300ff', '#00ff9d', '#ffff00'];
  //   const seed = key.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0);
    
  //   for (let i = 0; i < 15; i++) {
  //     ctx.beginPath();
  //     const startX = (Math.sin(seed + i) * 50 + 100);
  //     const startY = (Math.cos(seed + i * 2) * 50 + 100);
  //     const endX = (Math.sin(seed + i + 5) * 70 + 100);
  //     const endY = (Math.cos(seed + i + 3) * 70 + 100);
      
  //     ctx.moveTo(startX, startY);
  //     ctx.lineTo(endX, endY);
  //     ctx.strokeStyle = colors[i % colors.length];
  //     ctx.lineWidth = Math.random() * 3 + 1;
  //     ctx.stroke();
  //   }
    
  //   for (let i = 0; i < 30; i++) {
  //     ctx.beginPath();
  //     const x = Math.sin(seed + i * 3) * 80 + 100;
  //     const y = Math.cos(seed + i * 2) * 80 + 100;
  //     ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
  //     ctx.fillStyle = colors[i % colors.length];
  //     ctx.fill();
  //   }
    
  //   setVisualKeyCanvas(canvas.toDataURL());
  // };


  // Рисование визуального ключа
  

  const drawVisualKey = (key) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    // Черный фон
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, 200, 200);
    
    // Превращаем ключ в seed
    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed += key.charCodeAt(i) * (i + 1) * 100;
    }
    
    const colors = ['#ff00ff', '#00ffff', '#b300ff', '#00ff9d', '#ffff00'];
    
    // Рисуем линии (всегда одинаково для одного ключа)
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      
      const startX = seededRandom(seed, i) * 150 + 25;
      const startY = seededRandom(seed, i + 50) * 150 + 25;
      const endX = seededRandom(seed, i + 100) * 150 + 25;
      const endY = seededRandom(seed, i + 150) * 150 + 25;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = colors[Math.floor(seededRandom(seed, i + 200) * colors.length)];
      ctx.lineWidth = seededRandom(seed, i + 250) * 3 + 1;
      ctx.stroke();
    }
    
    // Рисуем точки
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      const x = seededRandom(seed, i + 300) * 180 + 10;
      const y = seededRandom(seed, i + 350) * 180 + 10;
      const radius = seededRandom(seed, i + 400) * 3 + 1;
      
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[Math.floor(seededRandom(seed, i + 450) * colors.length)];
      ctx.fill();
    }
    
    setVisualKeyCanvas(canvas.toDataURL());
  };

  const extractGridColors = (canvas) => {
    const ctx = canvas.getContext('2d');
    const colors = [];
    const step = 66;
    
    for (let gy = 0; gy < 3; gy++) {
      for (let gx = 0; gx < 3; gx++) {
        const imageData = ctx.getImageData(gx*step, gy*step, step, step);
        const data = imageData.data;
        
        let r=0,g=0,b=0,count=0;
        for (let i=0; i<data.length; i+=4) {
          if (data[i] > 50 || data[i+1] > 50 || data[i+2] > 50) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
            count++;
          }
        }
        
        if (count > 0) {
          // Вместо объекта - просто числа подряд
          colors.push(
            gx*step + step/2,  // x
            gy*step + step/2,  // y
            Math.floor(r/count), // r
            Math.floor(g/count), // g
            Math.floor(b/count)  // b
          );
        }
      }
    }
    return colors; // теперь массив чисел, а не объектов
  };

  // const extractGridColors = (canvas) => {
  //   const ctx = canvas.getContext('2d');
  //   const colors = [];
  //   const step = 66; // 200 / 3 ≈ 66
    
  //   for (let gy = 0; gy < 3; gy++) {
  //     for (let gx = 0; gx < 3; gx++) {
  //       const imageData = ctx.getImageData(gx*step, gy*step, step, step);
  //       const data = imageData.data;
        
  //       let r=0,g=0,b=0,count=0;
  //       for (let i=0; i<data.length; i+=4) {
  //         if (data[i] > 50 || data[i+1] > 50 || data[i+2] > 50) {
  //           r += data[i];
  //           g += data[i+1];
  //           b += data[i+2];
  //           count++;
  //         }
  //       }
        
  //       if (count > 0) {
  //         colors.push({
  //           x: gx*step + step/2,
  //           y: gy*step + step/2,
  //           r: Math.floor(r/count),
  //           g: Math.floor(g/count),
  //           b: Math.floor(b/count)
  //         });
  //       }
  //     }
  //   }
  //   return colors;
  // };

  // Обработчики шагов
  const handleGalaxyNameSubmit = async () => {
    if (!formData.galaxyName) {
      setError('Введи galaxy name');
      return;
    }
    
    const isAvailable = await checkGalaxyName(formData.galaxyName);
    if (!isAvailable) {
      setError('Имя уже занято');
      return;
    }
    
    setError('');
    setStep(3); // Переход к инструментам
  };

  const handleInstrumentToggle = (instrument) => {
    const updated = formData.instruments.includes(instrument)
      ? formData.instruments.filter(i => i !== instrument)
      : [...formData.instruments, instrument];
    setFormData({...formData, instruments: updated});
  };

  const handleInstrumentsSubmit = () => {
    if (formData.instruments.length === 0) {
      setError('Выбери хотя бы один инструмент');
      return;
    }
    setError('');
    setStep(4); // Переход к стилям
  };

  const handleStyleAdd = () => {
    if (!styleInput.trim()) return;
    if (formData.styles.includes(styleInput)) return;
    
    setFormData({
      ...formData, 
      styles: [...formData.styles, styleInput]
    });
    setStyleInput('');
  };

  const handleStyleRemove = (style) => {
    setFormData({
      ...formData,
      styles: formData.styles.filter(s => s !== style)
    });
  };

  const handleStylesSubmit = () => {
    if (formData.styles.length === 0) {
      setError('Добавь хотя бы один стиль');
      return;
    }
    setError('');
    setStep(5); // Переход к аватару
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setAvatarProgress(0);
      const base64 = await resizeAndConvertToBase64(file, 100, (progress) => {
        setAvatarProgress(progress);
      });
      
      setFormData({...formData, avatar: base64});
      setAvatarUploaded(true);
    } catch (err) {
      setError('Ошибка загрузки аватара');
    }
  };

  const handleAvatarSubmit = () => {
    if (!formData.avatar) {
      setError('Загрузи аватар');
      return;
    }
    setError('');
    setStep(6); // Переход к генерации ключа
  };

    // В handleGenerateKey:
    const handleGenerateKey = () => {
      const key = generateKey();
      setFormData({...formData, key});

      setTimeout(() => {
        drawVisualKey(key);
        const colors = extractGridColors(canvasRef.current);  // ← новая функция
        setFormData(prev => ({ 
          ...prev, 
          vpoints: JSON.stringify(colors)  // ← сохраняем цвета сетки
        }));
      }, 100);

      // setTimeout(() => {
      //   drawVisualKey(key);
      //   const points = captureColorPoints();
      //   setFormData(prev => ({ ...prev, visualPoints: points }));
      // }, 100);
    };
    // const handleGenerateKey = () => {
    //   const key = generateKey();
    //   setFormData({...formData, key});
      
    //   setTimeout(() => {
    //     drawVisualKey(key);
    //   }, 100);
    // };

  // const handleGenerateKey = () => {
  //   const key = generateKey();
  //   setFormData({...formData, key});
    
  //   // Даем время отрендерить canvas
  //   setTimeout(() => {
  //     drawVisualKey(key);
  //   }, 100);
  // };

  // const handleGenerateKey = () => {
  //   const key = generateKey();
  //   setFormData({...formData, key});
  //   drawVisualKey(key);
  // };


  const handleKeySubmit = () => {
    if (!formData.key) {
      setError('Сгенерируй ключ');
      return;
    }
    setError('');
    setStep(7); // Переход к финалу
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', formData.key), {
        uid: formData.key,
        galaxyName: formData.galaxyName,
        instruments: formData.instruments,
        styles: formData.styles,
        avatar: formData.avatar,
        vpoints: formData.vpoints,
        // visualPoints: formData.visualPoints, 
        // visualKey: visualKeyCanvas,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('userKey', formData.key);
      localStorage.setItem('userNick', formData.galaxyName);
      navigate('/galaxy');
    } catch (err) {
      setError('Ошибка сохранения');
      setLoading(false);
    }
  };

  const downloadVisualKey = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `visual_${formData.key}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  
  const downloadKeyFile = () => {
    const data = {
      key: formData.key,
      galaxyName: formData.galaxyName,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `key_${formData.key}.cosmo`;
    link.click();
  };

  return (
    <div className="register-wizard">
      <SkyBoxR />
      
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>✦ РЕГИСТРАЦИЯ ✦</h1>
          <div className="step-indicator">
            {[1,2,3,4,5,6,7].map(s => (
              <div 
                key={s}
                className={`step-dot ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
              />
            ))}
          </div>
          <span className="step-count">шаг {step} из 7</span>
        </div>

        <div className="wizard-content">
          {/* Шаг 1: Приветствие */}
          {step === 1 && (
            <div className="step-welcome">
              <h2>ДОБРО ПОЖАЛОВАТЬ В STARFIELD</h2>
              <p>Пройди регистрацию и стань частью галактики</p>
              <button onClick={() => setStep(2)} className="btn-next">
                НАЧАТЬ 🚀
              </button>
            </div>
          )}

          {/* Шаг 2: Galaxy Name */}
          {step === 2 && (
            <div className="step-galaxyname">
              <h3>ВВЕДИ GALAXY NAME</h3>
              <p>он будет отображаться как @{formData.galaxyName || 'имя'}</p>
              
              <input
                type="text"
                value={formData.galaxyName}
                onChange={(e) => setFormData({...formData, galaxyName: e.target.value})}
                placeholder="CyberVocalist"
                maxLength="20"
                className="neon-input"
              />
              
              {error && <div className="error-message">{error}</div>}
              
              <button onClick={handleGalaxyNameSubmit} className="btn-next">
                ПОДТВЕРДИТЬ
              </button>
            </div>
          )}

          {/* Шаг 3: Инструменты */}
          {step === 3 && (
            <div className="step-instruments">
              <h3>специализация</h3>
              <p>можно выбрать несколько</p>
              
              <div className="instruments-grid">
                {[
                  {id: 'guitar', label: '🎸 Гитара'},
                  {id: 'bass', label: '🎸 Бас'},
                  {id: 'drums', label: '😈 Барабаны'},
                  {id: 'vocal', label: '🎤 Вокал'},
                  {id: 'keys', label: '🎹 Клавиши'},
                  {id: 'producer', label: '😎 Продюсер'}
                ].map(inst => (
                  <label key={inst.id} className="instrument-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.instruments.includes(inst.id)}
                      onChange={() => handleInstrumentToggle(inst.id)}
                    />
                    <span>{inst.label}</span>
                  </label>
                ))}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button onClick={handleInstrumentsSubmit} className="btn-next">
                ПОДТВЕРДИТЬ
              </button>
            </div>
          )}

          {/* Шаг 4: Стили */}
          {step === 4 && (
            <div className="step-styles">
              <h3>ТВОЙ СТИЛЬ</h3>
              <p>добавляй стили через Enter или кнопку +</p>
              
              <div className="styles-input">
                <input
                  type="text"
                  value={styleInput}
                  onChange={(e) => setStyleInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStyleAdd()}
                  placeholder="рок"
                />
                <button onClick={handleStyleAdd}>+</button>
              </div>
              
              <div className="styles-tags">
                {formData.styles.map(style => (
                  <span key={style} className="style-tag">
                    {style}
                    <button onClick={() => handleStyleRemove(style)}>✕</button>
                  </span>
                ))}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                onClick={handleStylesSubmit} 
                className="btn-next"
              >
                ПОДТВЕРДИТЬ
              </button>
            </div>
          )}

          {/* Шаг 5: Аватар */}
          {step === 5 && (
            <div className="step-avatar">
              <h3>ЗАГРУЗИ АВАТАР</h3>
              
              <div className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  id="avatar-input"
                />
                <label htmlFor="avatar-input" className="upload-btn">
                  📷 ВЫБРАТЬ ФАЙЛ  
                </label>
              </div>
              
              {avatarProgress > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{width: `${avatarProgress}%`}}
                  />
                </div>
              )}
              
              {formData.avatar && (
                <div className="avatar-preview">
                  <img src={formData.avatar} alt="preview" />
                </div>
              )}
              
              {error && <div className="error-message">{error}</div>}
              
              {avatarUploaded && (
                <button onClick={handleAvatarSubmit} className="btn-next">
                  ПОДТВЕРДИТЬ
                </button>
              )}
            </div>
          )}

          {/* Шаг 6: Генерация ключа */}
          {step === 6 && (
            <div className="step-key">
              <h3>ТВОЙ УНИКАЛЬНЫЙ КЛЮЧ</h3>
              
              <button onClick={handleGenerateKey} className="generate-btn">
                🎲 СГЕНЕРИРОВАТЬ КЛЮЧ
              </button>
              
              {formData.key && (
                <>
                  <div className="key-display">{formData.key}</div>
                  
                  <canvas 
                    ref={canvasRef}
                    className="visual-key"
                  />

                  <div className="key-actions">
                        <button onClick={downloadVisualKey} className="btn-download">
                          📷 СКАЧАТЬ КАРТИНКУ
                        </button>
                        <button onClick={downloadKeyFile} className="btn-download">
                          🔑 СКАЧАТЬ .COSMO
                        </button>
                  </div>
                  
                  <p className="key-warning">
                    ⚠️ СОХРАНИ КЛЮЧ! Он нужен для входа
                  </p>
                  
                  {error && <div className="error-message">{error}</div>}
                  
                  <button onClick={handleKeySubmit} className="btn-next">
                    ПОДТВЕРДИТЬ
                  </button>
                </>
              )}
            </div>
          )}

          {/* Шаг 7: Финал */}
          {step === 7 && (
            <div className="step-final">
              <h3>ТВОЙ ПРОФИЛЬ ГОТОВ!</h3>
              
              <div className="profile-card">
                {formData.avatar && (
                  <img src={formData.avatar} alt="" className="final-avatar" />
                )}
                <div className="final-info">
                  <p><span className="label">GALAXY NAME:</span> @{formData.galaxyName}</p>
                  <p><span className="label">ИНСТРУМЕНТЫ:</span> {formData.instruments.join(', ')}</p>
                  <p><span className="label">СТИЛИ:</span> {formData.styles.join(', ')}</p>
                  <p><span className="label">КЛЮЧ:</span> {formData.key}</p>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                className="btn-enter"
                disabled={loading}
              >
                {loading ? 'ЗАГРУЗКА...' : '🚀 ВОЙТИ В STARFIELD'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWizard;