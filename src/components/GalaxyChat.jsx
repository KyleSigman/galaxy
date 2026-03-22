import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import "../pages/GalaxyChat.scss";

const GalaxyChat = () => {
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [nick, setNick] = useState(localStorage.getItem('galaxyNick') || '');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [mode, setMode] = useState('dialog'); // dialog, channel, conference
  const [isAuthor, setIsAuthor] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Подключение к WebSocket
  const connect = (room) => {
    const socket = new WebSocket(`wss://galaxy-zbyh.onrender.com`);
    // const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}`);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'join',
        roomId: room,
        nick: nick || 'Аноним'
      }));
      setWs(socket);
      setIsConnected(true);
      setRoomId(room);
    };
  
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      if (data.type === 'init') {
        setIsAuthor(data.isAuthor);
        setMode(data.mode);
        setAllowedUsers(data.allowedUsers || []);
      }
      else if (data.type === 'mode_changed') {
        setMode(data.mode);
        setAllowedUsers(data.allowedUsers || []);
      } else {
        setMessages(prev => [...prev, data]);
      }
    };
  
    socket.onclose = () => {
      setIsConnected(false);
    };
  };

  // const connect = (room) => {
  //   const socket = new WebSocket('ws://localhost:8080');
    
  //   socket.onopen = () => {
  //     socket.send(JSON.stringify({
  //       type: 'join',
  //       roomId: room,
  //       nick: nick || 'Аноним',
  //       mode: mode
  //     }));
  //     setWs(socket);
  //     setIsConnected(true);
  //     setRoomId(room);
      
  //     // Первый вошедший становится автором
  //     if (messages.length === 0) {
  //       setIsAuthor(true);
  //     }
  //   };

  //   socket.onmessage = (e) => {
  //     const data = JSON.parse(e.data);
      
  //     if (data.type === 'init') {
  //       setIsAuthor(data.isAuthor);
  //       setMode(data.mode);
  //       setAllowedUsers(data.allowedUsers || []);
  //     }
  //     else if (data.type === 'mode_changed') {
  //       setMode(data.mode);
  //       setAllowedUsers(data.allowedUsers || []);
  //     } else {
  //       setMessages(prev => [...prev, data]);
  //     }
  //   };

  //   // socket.onmessage = (e) => {
  //   //   const data = JSON.parse(e.data);
      
  //   //   if (data.type === 'mode_change') {
  //   //     setMode(data.mode);
  //   //     setAllowedUsers(data.allowedUsers || []);
  //   //   } else {
  //   //     setMessages(prev => [...prev, data]);
  //   //   }
  //   // };

  //   socket.onclose = () => {
  //     setIsConnected(false);
  //   };
  // };

  // Создать комнату
  
  const createRoom = () => {
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    connect(newRoom);
  };

  // Войти в комнату
  const joinRoom = () => {
    if (roomId) connect(roomId);
  };

  // Сменить режим
  const changeMode = (newMode) => {
    if (!isAuthor) return;
    
    ws.send(JSON.stringify({
      type: 'change_mode',
      mode: newMode,
      allowedUsers: newMode === 'conference' ? allowedUsers : []
    }));
  };

  // const changeMode = (newMode) => {
  //   if (!isAuthor) return;
    
  //   ws.send(JSON.stringify({
  //     type: 'change_mode',
  //     mode: newMode,
  //     allowedUsers: newMode === 'conference' ? allowedUsers : []
  //   }));
  //   setMode(newMode);
  // };

  // Разрешить пользователя (для конференции)
  
  const allowUser = (userNick) => {
    if (!isAuthor) return;
    
    const updated = [...allowedUsers, userNick];
    setAllowedUsers(updated);
    ws.send(JSON.stringify({
      type: 'allow_user',
      user: userNick
    }));
  };

  // Проверка может ли пользователь писать
  const canWrite = () => {
    if (mode === 'dialog') return true;
    if (mode === 'channel') return isAuthor;
    if (mode === 'conference') return isAuthor || allowedUsers.includes(nick);
    return false;
  };

  // Отправить сообщение
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !ws || !canWrite()) return;

    ws.send(JSON.stringify({
      type: 'message',
      message: inputMessage
    }));
    setInputMessage('');
  };

  // Выйти из чата
  const exitChat = () => {
    if (ws) {
      ws.close();
      setIsConnected(false);
      setMessages([]);
      setRoomId('');
      setIsAuthor(false);
      setMode('dialog');
      setAllowedUsers([]);
    }
  };

  // Сохранить чат
  const saveChat = () => {
    const data = {
      roomId,
      mode,
      messages,
      savedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${roomId}-${Date.now()}.cosmic`;
    a.click();
  };

  // Загрузить чат
  const loadChat = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setMessages(data.messages);
      setRoomId(data.roomId);
      setMode(data.mode || 'dialog');
    };
    reader.readAsText(file);
  };

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Сохранить ник
  useEffect(() => {
    if (nick) localStorage.setItem('galaxyNick', nick);
  }, [nick]);

  return (
    <div className="galaxy-chat">
      <div className="chat-header">
        <h1>✦ GALAXY CHAT ✦</h1>
        <p>межгалактический чат</p>
      </div>

      {!isConnected ? (
        <div className="room-manager">
        <div className="terminal-panel">
          <h3>🔮 ВХОД В ЧАТ</h3>
          
          <div className="form-group">
            <label>ТВОЙ НИК</label>
            <input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="CyberVocalist"
              maxLength="20"
            />
          </div>
      
          <button onClick={createRoom} className="btn-primary btn-block">
            🚀 СОЗДАТЬ НОВУЮ КОМНАТУ
          </button>
      
          <div className="divider">ИЛИ</div>
      
          <div className="form-group">
            <label>ID КОМНАТЫ</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="XK7-9P2"
              maxLength="8"
            />
          </div>
      
          <button onClick={joinRoom} className="btn-secondary btn-block">
            🔑 ВОЙТИ ПО ID
          </button>
        </div>
      </div>
        // <div className="room-manager">
        //   <div className="terminal-panel">
        //     <h3>🔮 ВХОД В ЧАТ</h3>
            
        //     <div className="form-group">
        //       <label>ТВОЙ НИК</label>
        //       <input
        //         type="text"
        //         value={nick}
        //         onChange={(e) => setNick(e.target.value)}
        //         placeholder="CyberVocalist"
        //         maxLength="20"
        //       />
        //     </div>

        //     <div className="form-group">
        //       <label>ID КОМНАТЫ</label>
        //       <input
        //         type="text"
        //         value={roomId}
        //         onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        //         placeholder="XK7-9P2"
        //         maxLength="8"
        //       />
        //     </div>

        //     <div className="button-group">
        //       <button onClick={createRoom} className="btn-primary">
        //         🚀 СОЗДАТЬ
        //       </button>
        //       <button onClick={joinRoom} className="btn-secondary">
        //         🔑 ВОЙТИ
        //       </button>
        //     </div>
        //   </div>
        // </div>
      ) : (
        <div className="chat-container">
          <div className="room-info">
            <span>КОМНАТА: {roomId}</span>
            <span>НИК: {nick}</span>
            {isAuthor && <span className="author-badge">👑 АВТОР</span>}
          </div>

          {/* Панель режимов (только для автора) */}
          {isAuthor && (
            <div className="mode-panel">
              <button 
                className={`mode-btn ${mode === 'dialog' ? 'active' : ''}`}
                onClick={() => changeMode('dialog')}
              >
                💬 ДИАЛОГ
              </button>
              <button 
                className={`mode-btn ${mode === 'channel' ? 'active' : ''}`}
                onClick={() => changeMode('channel')}
              >
                📢 КАНАЛ
              </button>
              <button 
                className={`mode-btn ${mode === 'conference' ? 'active' : ''}`}
                onClick={() => changeMode('conference')}
              >
                🎤 КОНФЕРЕНЦИЯ
              </button>
            </div>
          )}

          {/* Индикатор режима */}
          <div className="mode-indicator">
            {mode === 'dialog' && '💬 Все могут писать'}
            {mode === 'channel' && '📢 Только автор может писать'}
            {mode === 'conference' && '🎤 Только избранные могут писать'}
          </div>

          {/* Сообщения */}
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type === 'system' ? 'system' : ''}`}>
                {msg.type === 'system' ? (
                  <span className="system-message">✦ {msg.message}</span>
                ) : (
                  <>
                    <span className="message-nick">{msg.nick}:</span>
                    <span className="message-text">{msg.message}</span>
                    <span className="message-time">
                      {new Date(msg.time).toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ввод сообщения */}
          <form onSubmit={sendMessage} className="message-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={canWrite() ? "введи сообщение..." : "⛔ ты не можешь писать"}
              disabled={!canWrite()}
              maxLength="200"
            />
            <button type="submit" disabled={!canWrite()}>🚀</button>
          </form>

          {/* Управление */}
          <div className="chat-footer">
  {isAuthor && (
    <div className="chat-controls">
      <button onClick={saveChat} className="btn-save">💾 СОХРАНИТЬ</button>
      <input type="file" accept=".cosmic" onChange={loadChat} id="load-chat" style={{ display: 'none' }} />
      <button onClick={() => document.getElementById('load-chat').click()}>📂 ЗАГРУЗИТЬ</button>
    </div>
  )}
  <button onClick={exitChat} className="btn-exit">⚡ ВЫЙТИ</button>
</div>
          {/* <div className="chat-controls">
            <button onClick={saveChat} className="btn-save">
              💾 СОХРАНИТЬ
            </button>
            <input
              type="file"
              accept=".cosmic"
              onChange={loadChat}
              id="load-chat"
              style={{ display: 'none' }}
            />
            <button onClick={() => document.getElementById('load-chat').click()}>
              📂 ЗАГРУЗИТЬ
            </button>
            
            <button onClick={exitChat} className="btn-exit">
              ⚡ ВЫЙТИ
            </button>
          </div> */}

          {/* Панель управления пользователями (для конференции) */}
          {mode === 'conference' && isAuthor && (
            <div className="user-manager">
              <h4>РАЗРЕШЕННЫЕ ПОЛЬЗОВАТЕЛИ</h4>
              <div className="allowed-users">
                {allowedUsers.map((user, i) => (
                  <span key={i} className="user-tag">{user}</span>
                ))}
              </div>
              <div className="add-user">
                <input 
                  type="text" 
                  placeholder="ник пользователя"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      allowUser(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <Link to="/" className="chat-home">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="home" />
      </Link>
    </div>
  );
};

export default GalaxyChat;



// // components/GalaxyChat.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import "../pages/GalaxyChat.scss";
// const GalaxyChat = () => {
//   const [ws, setWs] = useState(null);
//   const [roomId, setRoomId] = useState('');
//   const [nick, setNick] = useState(localStorage.getItem('galaxyNick') || '');
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Подключение к WebSocket
//   const connect = (room) => {
//     const socket = new WebSocket('ws://localhost:8080');
    
//     socket.onopen = () => {
//       socket.send(JSON.stringify({
//         type: 'join',
//         roomId: room,
//         nick: nick || 'Аноним'
//       }));
//       setWs(socket);
//       setIsConnected(true);
//       setRoomId(room);
//     };

//     socket.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages(prev => [...prev, data]);
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//     };
//   };

//   // Создать комнату
//   const createRoom = () => {
//     const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
//     connect(newRoom);
//   };

//   // Войти в комнату
//   const joinRoom = () => {
//     if (roomId) connect(roomId);
//   };

//   // Отправить сообщение
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim() || !ws) return;

//     ws.send(JSON.stringify({
//       type: 'message',
//       message: inputMessage
//     }));
//     setInputMessage('');
//   };

//   // Сохранить чат
//   const saveChat = () => {
//     const data = {
//       roomId,
//       messages,
//       savedAt: new Date().toISOString()
//     };
//     const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `chat-${roomId}-${Date.now()}.cosmic`;
//     a.click();
//   };

//   // Загрузить чат
//   const loadChat = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = JSON.parse(e.target.result);
//       setMessages(data.messages);
//       setRoomId(data.roomId);
//     };
//     reader.readAsText(file);
//   };

//   // Автоскролл
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Сохранить ник
//   useEffect(() => {
//     if (nick) localStorage.setItem('galaxyNick', nick);
//   }, [nick]);

//   return (

//     <div className="galaxy-chat">

//       <div className="chat-header">
//         <h1>✦ GALAXY CHAT ✦</h1>
//         <p>межгалактический чат без регистрации</p>
//       </div>

//       {!isConnected ? (
//         <div className="room-manager">
//           <div className="terminal-panel">
//             <h3>🔮 ВХОД В ЧАТ</h3>
            
//             <div className="form-group">
//               <label>ТВОЙ НИК</label>
//               <input
//                 type="text"
//                 value={nick}
//                 onChange={(e) => setNick(e.target.value)}
//                 placeholder="CyberVocalist"
//                 maxLength="20"
//               />
//             </div>

//             <div className="form-group">
//               <label>ID КОМНАТЫ</label>
//               <input
//                 type="text"
//                 value={roomId}
//                 onChange={(e) => setRoomId(e.target.value.toUpperCase())}
//                 placeholder="XK7-9P2"
//                 maxLength="8"
//               />
//             </div>

//             <div className="button-group">
//               <button onClick={createRoom} className="btn-primary">
//                 🚀 СОЗДАТЬ
//               </button>
//               <button onClick={joinRoom} className="btn-secondary">
//                 🔑 ВОЙТИ
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="chat-container">
//           <div className="room-info">
//             <span>КОМНАТА: {roomId}</span>
//             <span>НИК: {nick}</span>
//           </div>

//           <div className="messages-container">
//             {messages.map((msg, i) => (
//               <div key={i} className={`message ${msg.type === 'system' ? 'system' : ''}`}>
//                 {msg.type === 'system' ? (
//                   <span className="system-message">✦ {msg.message}</span>
//                 ) : (
//                   <>
//                     <span className="message-nick">{msg.nick}:</span>
//                     <span className="message-text">{msg.message}</span>
//                     <span className="message-time">
//                       {new Date(msg.time).toLocaleTimeString()}
//                     </span>
//                   </>
//                 )}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={sendMessage} className="message-input-form">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="введи сообщение..."
//               maxLength="200"
//             />
//             <button type="submit">🚀</button>
//           </form>

//           <div className="chat-controls">
//             <button onClick={saveChat} className="btn-save">
//               💾 СОХРАНИТЬ ЧАТ
//             </button>
//             <input
//               type="file"
//               accept=".cosmic"
//               onChange={loadChat}
//               id="load-chat"
//               style={{ display: 'none' }}
//             />
//             <button onClick={() => document.getElementById('load-chat').click()}>
//               📂 ЗАГРУЗИТЬ ЧАТ
//             </button>
//           </div>
//         </div>
//       )}

//       <Link to="/" className="chat-home">
//         <img src="https://static-00.iconduck.com/assets.00/return-icon-2048x1866-c8h3yn0w.png" alt="home" />
//       </Link>
//     </div>

//   );
// };

// export default GalaxyChat;
