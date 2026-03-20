import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import {  } from 'firebase/firestore';
import StarField from './StarField';
import {doc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../galaconfig';


import SkyBox from './SkyBox';
import CommandTerminal from './CommandTerminal';
import GalaxyMessages from './GalaxyMessages';
import './GalaxyProfile.scss';
import "../fonts/Deutsch Gothic.ttf";

const GalaxyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showVisualKey, setShowVisualKey] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileMode, setProfileMode] = useState('default');

  const [ads, setAds] = useState([]);
  const colors = [
    '#9900cc', // тёмный пурпурный
    '#0066cc', // тёмный синий
    '#660099', // фиолетовый
    '#006666', // тёмный бирюзовый
    '#333399', // индиго
    '#663366', // сливовый
    '#336666', // тёмный циан
    '#660066', // пурпурный
    '#440066', // тёмный фиолетовый
    '#553366', // лавандовый
    '#335566', // сине-зелёный
    '#442244'  // тёмный баклажан
  ];

  useEffect(() => {
    const loadProfile = async () => {
      const userKey = localStorage.getItem('userKey');
      
      if (!userKey) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userKey));
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          localStorage.removeItem('userKey');
          localStorage.removeItem('userNick');
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const q = query(
      collection(db, 'ads'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(items);
    });
    
    return () => unsubscribe();
  }, []);

  // Функция для отрисовки визуального ключа
  const drawVisualKey = (canvas, key) => {
    if (!canvas || !key) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 150;
    
    // Черный фон
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, 150, 150);
    
    // Превращаем ключ в seed
    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed += key.charCodeAt(i) * (i + 1) * 100;
    }
    
    const seededRandom = (offset) => {
      const x = Math.sin(seed * (offset + 1)) * 10000;
      return x - Math.floor(x);
    };
    
    const colors = ['#ff00ff', '#00ffff', '#b300ff', '#00ff9d', '#ffff00'];
    
    // Рисуем линии
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      const startX = seededRandom(i) * 120 + 15;
      const startY = seededRandom(i + 50) * 120 + 15;
      const endX = seededRandom(i + 100) * 120 + 15;
      const endY = seededRandom(i + 150) * 120 + 15;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = colors[Math.floor(seededRandom(i + 200) * colors.length)];
      ctx.lineWidth = seededRandom(i + 250) * 2 + 1;
      ctx.stroke();
    }
    
    // Рисуем точки
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const x = seededRandom(i + 300) * 130 + 10;
      const y = seededRandom(i + 350) * 130 + 10;
      const radius = seededRandom(i + 400) * 2 + 1;
      
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[Math.floor(seededRandom(i + 450) * colors.length)];
      ctx.fill();
    }
  };

  const showKey = () => {
    setShowVisualKey(true);
    // Перерисовываем ключ при показе
    setTimeout(() => {
      const canvas = document.getElementById('visualKey');
      drawVisualKey(canvas, userData?.uid);
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem('userKey');
    localStorage.removeItem('userNick');
    navigate('/login');
  };

  const downloadVisualKey = () => {
    const canvas = document.getElementById('visualKey');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `visual_key_${userData?.uid}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    if (userData?.uid) {
      const canvas = document.getElementById('visualKey');
      drawVisualKey(canvas, userData.uid);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="loading-screen">
        {/* <SkyBox /> */}
        <div className="loader">✦ ЗАГРУЗКА ✦</div>
      </div>
    );
  }

  return (
    <div className={`galaxy-profile ${profileMode}`}>
      {/* <SkyBox /> */}
      <StarField />


{isMinimized ? (
  <div className="profile-mini" onClick={() => setIsMinimized(false)}>
    <div className="mini-avatar">
      {userData?.avatar ? (
        <img src={userData.avatar} alt={userData.galaxyName} />
      ) : (
        <div className="mini-placeholder">
          {userData?.galaxyName?.charAt(0)}
        </div>
      )}
    </div>
    <div className="mini-name">@{userData?.galaxyName}</div>
    <button className="mini-expand">▼</button>
  </div>
) : (
    <div className="profile-container">
    {/* <div className="profile-header">
      <h1>✦ ПРОФИЛЬ ✦</h1>
    </div> */}

    <div className="profile-card">
      
      {/* Аватар */}
      <div className="avatar-section">
        {userData?.avatar ? (
          <img 
            src={userData.avatar} 
            alt={userData.galaxyName} 
            className="avatar"
          />
        ) : (
          <div className="avatar-placeholder">
            {userData?.galaxyName?.charAt(0)}
          </div>
        )}
      </div>

      {/* Galaxy Name */}
      
      <div className={`galaxy-name ${userData?.status === "VIP" ? "vip" : ""}`}>
        {userData?.status === "VIP" && (
        <span className="vip-first-letter">
          {userData.galaxyName.charAt(0)}
        </span>
        )}
        <span className="rest-name">
        {userData?.status === "VIP" 
          ? userData.galaxyName.slice(1) 
          : userData?.galaxyName}
        </span>
        {userData?.status === "VIP" && (
        <span className="vip-badge">✦ VIP ✦</span>
        )}
      </div>

          <div className="radar">
        <div className="ticker">
          {ads.map((ad, index) => (
            <span 
  className="ticker-item" 
  style={{ backgroundColor: colors[index % colors.length] }}
  data-author={ad.authorName}
>
  {ad.text}
</span>
          ))}
        </div>
          </div>


        {showMessages && (
        <div className="messages-overlay">
          <GalaxyMessages 
            currentUser={userData}
            onClose={() => setShowMessages(false)}
          />
        </div>
)}

<button onClick={() => setShowMessages(true)} className="messages-btn">
  📩 {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
</button>

      {/* Инструменты */}
      <div className="info-section">
        <h3>🎸 инструменты</h3>
        <div className="tags">
          {userData?.instruments?.map(inst => (
            <span key={inst} className="tag">
              {inst === 'guitar' && '🎸 Гитара'}
              {inst === 'bass' && '🎸 Бас'}
              {inst === 'drums' && '😈 Барабаны'}
              {inst === 'vocal' && '🎤 Вокал'}
              {inst === 'keys' && '🎹 Клавиши'}
              {inst === 'producer' && '😎 Продюсер'}
            </span>
          ))}
        </div>
      </div>
      {/* Стили */}
      <div className="info-section">
        <h3>🎵 стили</h3>
        <div className="tags">
          {userData?.styles?.map(style => (
            <span key={style} className="tag style-tag">
              {style}
            </span>
          ))}
        </div>
      </div>

      <div className="terminal-section">
        <CommandTerminal 
          currentUser={userData} 
          onModeChange={setProfileMode}
        />
      </div>

        <div className="profile-footer">

          <button className="show-key-btn" onClick={showKey}>
          🔑 ПОКАЗАТЬ КЛЮЧ
          </button>

          {showVisualKey && (
            <div className="visual-key-mini">
              <canvas id="visualKey" className="visual-key-small" />
              <div className="key-controls">
                <button onClick={downloadVisualKey} className="key-btn download">💾</button>
                <button onClick={() => setShowVisualKey(false)} className="key-btn close">✕</button>
              </div>
            </div>
          )}

          {/* {showVisualKey && (
          <div className="visual-key-mini">
            <canvas id="visualKey" className="visual-key-small" />
          </div>
          )} */}

          <button 
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('userKey');
            localStorage.removeItem('userNick');
            navigate('/login');
          }}
          >
          🔚
          </button>

        </div>

      {/* <div className="visual-key-section">
        <h3>🔑 ВИЗУАЛЬНЫЙ КЛЮЧ</h3>
        <canvas 
          id="visualKey" 
          className="visual-key"
        />
      </div> */}

    </div>

    <button 
  className="minimize-btn"
  onClick={() => setIsMinimized(true)}
>
  ▲ СВЕРНУТЬ
    </button>

    {/* <button 
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem('userKey');
        localStorage.removeItem('userNick');
        navigate('/login');
      }}
    >
      ⚡ ВЫЙТИ
    </button> */}

  </div>
)}

    </div>

    
  );
};

export default GalaxyProfile;

