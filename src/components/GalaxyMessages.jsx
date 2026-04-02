import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db } from '../galaconfig';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import "../pages/GalaxyMessages.scss";

const GalaxyMessages = ({ currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate(); // ← добавить


  const handleInviteClick = (roomId) => {
    navigate(`/messenger?room=${roomId}`);
    onClose();
  };
  
  useEffect(() => {
    if (!currentUser?.galaxyName) return;

    // Загружаем из localStorage
    const stored = JSON.parse(localStorage.getItem(`galaxy_msgs_${currentUser.galaxyName}`) || '[]');
    setMessages(stored);

    // Слушаем новые сообщения
    const q = query(
      collection(db, 'temp_messages'),
      where('to', '==', currentUser.galaxyName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const msgData = change.doc.data();
          const newMsg = {
            id: change.doc.id,
            ...msgData,
            received: Date.now()
          };

          const current = JSON.parse(localStorage.getItem(`galaxy_msgs_${currentUser.galaxyName}`) || '[]');
          const updated = [...current, newMsg];
          localStorage.setItem(`galaxy_msgs_${currentUser.galaxyName}`, JSON.stringify(updated));
          setMessages(updated);

          deleteDoc(change.doc.ref);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser?.galaxyName]);

  return (
    <div className="galaxy-messages">
      <div className="messages-header">
        <h3>📩 входящие</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="messages-list">
  {messages.length === 0 ? (
    <div className="empty-state">✦ нет сообщений ✦</div>
  ) : (
    messages.map(msg => (
      <div key={msg.id} className="message-item">
        <div className="message-header">
          <span className="from">{msg.fromNick}</span>
          <span className="time">
            {new Date(msg.time).toLocaleString()}
          </span>
        </div>
        
        {/* Проверяем, является ли сообщение приглашением */}
        {msg.roomId ? (
          <div className="invite-content">
            <span className="invite-icon">🔮</span>
            <span>ПРИГЛАШЕНИЕ В ЧАТ</span>
            <button 
              className="invite-room-button"
              onClick={() => {
                navigate(`/messenger?room=${msg.roomId}`);
                onClose();
              }}
            >
              [{msg.roomId}]
            </button>
            <span>нажми чтобы войти</span>
          </div>
        ) : (
          <div className="message-text">{msg.text}</div>
        )}
        
        <button 
          className="delete-message"
          onClick={() => {
            const updated = messages.filter(m => m.id !== msg.id);
            localStorage.setItem(`galaxy_msgs_${currentUser.galaxyName}`, JSON.stringify(updated));
            setMessages(updated);
          }}
        >
          ✕
        </button>
      </div>
    ))
  )}
</div>

      {/* <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">✦ нет сообщений ✦</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="message-item">
              <div className="message-header">
                <span className="from">{msg.fromNick}</span>
                <span className="time">
                  {new Date(msg.time).toLocaleString()}
                </span>
              </div>
              <div className="message-text">{msg.text}</div>
              <button 
                className="delete-message"
                onClick={() => {
                  const updated = messages.filter(m => m.id !== msg.id);
                  localStorage.setItem(`galaxy_msgs_${currentUser.galaxyName}`, JSON.stringify(updated));
                  setMessages(updated);
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div> */}

    </div>
  );

};

export const sendGalaxyMessage = async (toNick, text, fromUser, roomId = null) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    await addDoc(collection(db, 'temp_messages'), {
      to: toNick,
      from: fromUser.uid,
      fromNick: fromUser.galaxyName,
      text,
      roomId,  // ← добавляем поле
      time: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Ошибка отправки:', error);
    throw error;
  }
};

// export const sendGalaxyMessage = async (toNick, text, fromUser) => {
//   try {
//     const { collection, addDoc } = await import('firebase/firestore');
//     await addDoc(collection(db, 'temp_messages'), {
//       to: toNick,
//       from: fromUser.uid,
//       fromNick: fromUser.galaxyName,
//       text,
//       time: Date.now()
//     });
//     return true;
//   } catch (error) {
//     console.error('Ошибка отправки:', error);
//     throw error;
//   }
// };

export default GalaxyMessages;
