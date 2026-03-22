import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../galaconfig';
import './ArtCard.scss';
import StarField from './StarField';

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
              <StarField />
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
          <div className="artcard-instrument">{card.instrument || 'музыкант'}</div>
        </div>
      </div>

      {card.ticker && (
        <div className="artcard-ticker">
          <marquee behavior="scroll" direction="left">{card.ticker}</marquee>
        </div>
      )}

      {/* ========== БЛОК UI — ПЕРЕНЕСЁН НАВЕРХ ========== */}
      <div className="artcard-actions">
        <button 
          className="action-btn message-btn"
          onClick={() => setShowMessageInput(!showMessageInput)}
        >
          💬 НАПИСАТЬ
        </button>
        <button 
          className={`action-btn collab-btn ${collabRequested ? 'active' : ''}`}
          onClick={toggleCollabRequest}
        >
          {collabRequested ? '✅ отправлено' : '👏 гоу фит'}
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

      {card.messages?.length > 0 && (
        <div className="artcard-messages">
          <h3>💬 сообщения</h3>
          {card.messages.map((msg, i) => (
            <div key={i} className="message-item">
              <div className="message-author">@{msg.fromName}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-date">{new Date(msg.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      {/* ========== КОНЕЦ БЛОКА UI ========== */}

      <div className="artcard-details">
        {card.experience && (
          <div className="detail-item">
            <span className="detail-label">🎸 стаж</span>
            <span>{card.experience} лет</span>
          </div>
        )}
        {card.style && (
          <div className="detail-item">
            <span className="detail-label">🎵 стиль</span>
            <span>{card.style}</span>
          </div>
        )}
        {card.location && (
          <div className="detail-item">
            <span className="detail-label">📍 локация</span>
            <span>{card.location}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">💪 готовность</span>
          <span className={card.ready ? 'ready-yes' : 'ready-no'}>
            {card.ready ? 'готов к сотрудничеству' : 'пока не ищу'}
          </span>
        </div>
      </div>

      {card.projects?.length > 0 && (
        <div className="artcard-section">
          <h3>🎧 проекты</h3>
          <div className="tags">
            {card.projects.map((p, i) => <span key={i} className="tag">{p}</span>)}
          </div>
        </div>
      )}

      {card.favbands?.length > 0 && (
        <div className="artcard-section">
          <h3>💿 любимые группы</h3>
          <div className="tags">
            {card.favbands.map((b, i) => <span key={i} className="tag">{b}</span>)}
          </div>
        </div>
      )}

      {card.promo && (
        <div className="artcard-section">
          <h3>📢 промо</h3>
          <p className="promo-text">{card.promo}</p>
        </div>
      )}

      {card.price && (
        <div className="artcard-section">
          <h3>💰 цена за сет</h3>
          <p className="price-text">{card.price} ⚡</p>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/')}>
        ← НА ГЛАВНУЮ
      </button>
    </div>
    </div>
  );
};

export default ArtCard;