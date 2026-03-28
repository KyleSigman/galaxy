import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../galaconfig';
import './ArtCard.scss';
import { QRCodeCanvas } from 'qrcode.react';
// import QRCode from 'qrcode.react';

const ArtCard = () => {
  const { artcardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [collabRequested, setCollabRequested] = useState(false);
  const [activeTab, setActiveTab] = useState('base');
  const [copySuccess, setCopySuccess] = useState(false);

  // Текущий пользователь
  useEffect(() => {
    const userKey = localStorage.getItem('userKey');
    if (userKey) {
      const loadUser = async () => {
        const userDoc = await getDoc(doc(db, 'users', userKey));
        if (userDoc.exists()) {
          setCurrentUser({ uid: userKey, ...userDoc.data() });
        }
      };
      loadUser();
    }
  }, []);

  // Загрузка визитки и данных автора
  useEffect(() => {
    if (!artcardId) return;
  
    const loadData = async () => {
      setLoading(true);
      
      const cardSnap = await getDoc(doc(db, 'artcards', artcardId));
      
      if (cardSnap.exists()) {
        const cardData = cardSnap.data();
        setCard(cardData);
        
        const userRef = doc(db, 'users', cardData.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
        
        if (currentUser && cardData.collabRequests?.includes(currentUser.uid)) {
          setCollabRequested(true);
        }
      }
      setLoading(false);
    };
    
    loadData();
  }, [artcardId, currentUser]);

  // Отправить сообщение
  const sendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;
    
    const cardRef = doc(db, 'artcards', artcardId);
    const newMessage = {
      fromUid: currentUser.uid,
      fromName: currentUser.galaxyName,
      text: messageText.trim(),
      date: new Date().toISOString(),
      read: false
    };
    
    await updateDoc(cardRef, {
      messages: arrayUnion(newMessage)
    });
    
    setMessageText('');
    setShowMessageInput(false);
  };

  // Запрос на коллаб
  const toggleCollabRequest = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const cardRef = doc(db, 'artcards', artcardId);
    
    if (collabRequested) {
      await updateDoc(cardRef, {
        collabRequests: arrayRemove(currentUser.uid)
      });
      setCollabRequested(false);
    } else {
      await updateDoc(cardRef, {
        collabRequests: arrayUnion(currentUser.uid)
      });
      setCollabRequested(true);
    }
  };

  // Поделиться — копировать ссылку
  const shareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Данные для вкладки БАЗА (без телефона)
  const baseData = [
    { label: 'стиль', value: card?.style },
    { label: 'стаж', value: card?.experience ? `${card.experience} лет` : null },
    { label: 'проекты', value: card?.projects, isArray: true },
    { label: 'актуальный проект', value: card?.actualproject, isArray: true },
    { label: 'любимые группы', value: card?.favband, isArray: true },
    // { label: 'разогревы', value: card?.support, isArray: true },
    { label: 'эндорсмент', value: card?.endorsement },
    { label: 'образование', value: card?.education },
    { label: 'оборудование', value: card?.gear },
    { label: 'прайс', value: card?.price },
    { label: 'статус', value: card?.status }
    // { label: 'FEATS / коллаборации', value: card?.feats, isMultiline: true }
  ];

  // Данные для вкладки ХАРАКТЕР (без алкоголя, сообщений, оформления)
  const characterData = [
    { label: 'творческий подход', value: card?.creativeApproach },
    { label: 'движения на сцене', value: card?.stageMovement },
    { label: 'сценический образ', value: card?.stageLook },
    { label: 'уровень вовлеченности', value: card?.commitment },
    { label: 'любимая техника', value: card?.favTechnique },
    { label: 'девиз / кредо', value: card?.motto },
    { label: 'коммуникация', value: card?.communication },
    { label: '+1 на репе', value: card?.plusOne },
    { label: 'вайб', value: card?.vibe, isMultiline: true }
  ];

  const renderTabContent = () => {
    if (activeTab === 'base') {
      return (
        <div className="artcard-details">
          {baseData.map((item, idx) => {
            if (!item.value) return null;
            if (item.isArray && Array.isArray(item.value) && item.value.length > 0) {
              return (
                <div key={idx} className="detail-item">
                  <span className="detail-label">⟁ {item.label}</span>
                  <div className="tags">
                    {item.value.map((v, i) => <span key={i} className="tag">{v}</span>)}
                  </div>
                </div>
              );
            }
            if (item.isMultiline && item.value) {
              return (
                <div key={idx} className="detail-item">
                  <span className="detail-label">⟁ {item.label}</span>
                  <span className="multiline-text">{item.value}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="detail-item">
                <span className="detail-label">⟁ {item.label}</span>
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (activeTab === 'character') {
      return (
        <div className="artcard-details">
          {characterData.map((item, idx) => {
            if (!item.value) return null;
            if (item.isMultiline) {
              return (
                <div key={idx} className="detail-item">
                  <span className="detail-label">⟁ {item.label}</span>
                  <span className="multiline-text">{item.value}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="detail-item">
                <span className="detail-label">⟁ {item.label}</span>
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (activeTab === 'contact') {
      return (
        <div className="artcard-details">
          {/* Ссылки на релизы */}
          {card?.releaseLinks && (
            <div className="detail-item">
              <span className="detail-label">⟁ ссылки на релизы</span>
              <span className="multiline-text">{card.releaseLinks}</span>
            </div>
          )}
          
          {/* QR-код */}
          <div className="detail-item">
            <span className="detail-label">⟁ QR-код</span>
            <div className="qr-container">
            <QRCodeCanvas 
              value={`${window.location.origin}/artcard/${artcardId}`} 
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
            />
            </div>
          </div>
          
          {/* Кнопка поделиться */}
          <div className="detail-item">
            <span className="detail-label">⟁ поделиться</span>
            <button className="share-btn" onClick={shareProfile}>
              {copySuccess ? '✓ СКОПИРОВАНО' : '📋 КОПИРОВАТЬ ССЫЛКУ'}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div className="artcard-loader">✦ ЗАГРУЗКА ✦</div>;
  }

  if (!card || !userData) {
    return (
      <div className="artcard-notfound">
        <h3>⚡ ВИЗИТКА НЕ НАЙДЕНА</h3>
        <p>Визитка с ID {artcardId} не найдена</p>
        <button onClick={() => navigate('/')}>← НА ГЛАВНУЮ</button>
      </div>
    );
  }

  const bgClass = `artcard-bg-${card.bgStyle || 'stars'}`;

  return (
    <div className="ArtCard">
      <div className={`artcard ${bgClass}`}>
        <div className="artcard-header">
          <div className="artcard-avatar">
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.galaxyName} />
            ) : (
              <span>{userData.galaxyName?.charAt(0) || '🎤'}</span>
            )}
          </div>
          <div className="artcard-info">
            <h1 className="artcard-name">{userData.galaxyName}</h1>
            <div className="artcard-instrument">
              {card.instruments?.length > 0 
                ? card.instruments.join(', ') 
                : (card.instrument || 'музыкант')}
            </div>
          </div>
        </div>

        {card.ticker && (
          <div className="artcard-ticker">
            <marquee behavior="scroll" direction="left">{card.ticker}</marquee>
          </div>
        )}

        <div className="artcard-actions">
          <button 
            className="action-btn message-btn"
            onClick={() => setShowMessageInput(!showMessageInput)}
          >
            НАПИСАТЬ
          </button>
          <button 
            className={`action-btn collab-btn ${collabRequested ? 'active' : ''}`}
            onClick={toggleCollabRequest}
          >
            {collabRequested ? '✅ ОТПРАВЛЕНО' : 'КОЛЛАБ'}
          </button>
        </div>

        {showMessageInput && (
          <div className="message-input">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ваше сообщение..."
              rows="3"
            />
            <button onClick={sendMessage}>➤ ОТПРАВИТЬ</button>
          </div>
        )}

        <div className="artcard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'base' ? 'active' : ''}`}
            onClick={() => setActiveTab('base')}
          >
            общее
          </button>
          <button 
            className={`tab-btn ${activeTab === 'character' ? 'active' : ''}`}
            onClick={() => setActiveTab('character')}
          >
            характер
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            связь
          </button>
        </div>

        {renderTabContent()}

        <button className="back-btn" onClick={() => navigate('/')}>
          ← НА ГЛАВНУЮ
        </button>

      </div>
    </div>
  );
};

export default ArtCard;