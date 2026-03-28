import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/profile.scss';
import "./GalaxyProfile.scss";
import { sendGalaxyMessage } from './GalaxyMessages';
import { collection, addDoc, query, where, orderBy, limit, getDocs} from 'firebase/firestore';
// import { collection, addDoc } from 'firebase/firestore';
import { db } from '../galaconfig';



const CommandTerminal = ({ currentUser, onModeChange }) => {
  const [command, setCommand] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [uploadMode, setUploadMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [newsItems, setNewsItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // База команд
  const commands = {

    '@@login': { path: '/login', desc: 'авторизоваться' },
    '@@st': { path: '/startpage', desc: 'Стартовая страница' },
    '@@pf': { path: '/galaxy/', desc: 'Твой профиль' },
    '@@art': { path: null, desc: '@@art abcdef — открыть визитку по ID' },
    '@@find': { path: '/finder/', desc: 'Твой профиль' },
    '@@cyberchat': { path: '/messenger', desc: 'Мессенджер' },
    '@@mk': { path: '/market', desc: 'продавать' },
    '@@mkp': { path: '/marketplace', desc: 'Галактик маркет' },
    '@@postvid': { path: null, desc: 'Опубликовать видео дня' },
    '@@news': { path: '/news', desc: 'лента' },
    '@@origin': { path: null, desc: '@@origin XK79P2 — открыть канал по ID' },
    '@@origins': { path: '/origins', desc: 'каналы' },
    '@@getnews': { path: null, desc: 'Показать свежие видео' },
    '@@help': { path: null, desc: 'Показать все команды' },
    '@@send': { path: null, desc: 'Отправить личное сообщение (пример: @@sendto KateDark привет)' },
    '@@clear': { path: 'clear', desc: 'Очистить историю' }
  };

  const handleCommand = async (e) => {  // ← добавить async
    e.preventDefault();
    const cmd = command.trim();
    console.log('🔥 Команда:', cmd);
    if (!cmd) return;

    if (cmd === '@@help') {
      setHistory(prev => [...prev, { 
        command: cmd, 
        result: 'Доступные команды: ' + Object.keys(commands).join(', ') 
      }]);
      setMessage({ type: 'info', text: 'Все команды показаны' });
    }
    else if (cmd.startsWith('@@user ')) {
      const userId = cmd.replace('@@user ', '');
      navigate(`/guest/${userId}`);
    } 
    else if (cmd === '@@clear') {
      setHistory([]);
      setMessage({ type: 'success', text: 'История очищена' });
    }
    else if (cmd.startsWith('@@send ')) {
      const parts = cmd.replace('@@send ', '').split(' ');
      const toNick = parts[0];
      const message = parts.slice(1).join(' ');
      
      if (!toNick || !message) {
        setMessage({ type: 'error', text: 'Формат: @@send ник сообщение' });
        return;
      }
      
      try {
        await sendGalaxyMessage(toNick, message, currentUser);
        setMessage({ type: 'success', text: `Сообщение отправлено ${toNick}` });
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
    else if (cmd === '@@getnews') {
      // Включаем режим active2
      if (onModeChange) {
        onModeChange('active2');
      }
      
      // Загружаем новости
      const q = query(
        collection(db, 'news'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsItems(items);
      setMessage({ type: 'success', text: `Загружено: ${items.length} записей` });
    }
    else if (cmd === '@@clearnews') {
      setNewsItems([]);  // очищаем список
      setMessage({ type: 'success', text: 'Новости скрыты' });
    }
    else if (cmd === '@@mode1') {
      onModeChange('active');
      setMessage({ type: 'success', text: 'Режим active' });
    }
    else if (cmd === '@@mode2') {
      onModeChange('active2');
      setMessage({ type: 'success', text: 'Режим active2' });
    }
    else if (cmd.startsWith('@@req ')) {
      const text = cmd.replace('@@req ', '').trim();
      
      if (!text) {
        setMessage({ type: 'error', text: 'Формат: @@req текст объявления' });
        return;
      }
      
      try {
        await addDoc(collection(db, 'ads'), {
          text,
          authorId: currentUser.uid,
          authorName: currentUser.galaxyName,
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 часа
        });
        
        setMessage({ type: 'success', text: 'Объявление добавлено в радар' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Ошибка публикации' });
      }
    }
    else if (commands[cmd]) {
      setHistory(prev => [...prev, { 
        command: cmd, 
        result: `Переход на ${commands[cmd].path || cmd}` 
      }]);
      setMessage({ type: 'success', text: `Выполняю ${cmd}` });
      
      if (commands[cmd].path) {
        setTimeout(() => navigate(commands[cmd].path), 500);
      }
    }
    else if (cmd.startsWith('@@origin ')) {
      const originId = cmd.replace('@@origin ', '').trim();
      navigate(`/origin/${originId}`);
    }
    else if (cmd.startsWith('@@art ')) {
      const artcardId = cmd.replace('@@art ', '').trim();
      if (artcardId) {
        navigate(`/artcard/${artcardId}`);
      } else {
        setMessage({ type: 'error', text: 'Укажи ID визитки: @@art abcdef' });
      }
    }
    else {
      setHistory(prev => [...prev, { 
        command: cmd, 
        result: 'Команда не найдена' 
      }]);
      setMessage({ type: 'error', text: 'Неизвестная команда' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    
    setCommand('');
    setShowSuggestions(false);
    
    // Автоскролл истории
    setTimeout(() => {
      const historyDiv = document.querySelector('.terminal-history');
      if (historyDiv) {
        historyDiv.scrollTop = historyDiv.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (history.length > 0) {
      const timer = setTimeout(() => {
        setHistory([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [history]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCommand(value);
    
    if (value.startsWith('@@')) {
      const filtered = Object.keys(commands).filter(cmd => 
        cmd.includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка на MP4
    if (file.type !== 'video/mp4') {
      setMessage({ type: 'error', text: 'Только MP4 файлы!' });
      return;
    }

    // Проверка на размер (1 MB)
    const maxSize = 1 * 1024 * 1024; // 1 MB в байтах
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Файл больше 1 MB!' });
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0); // Сброс прогресса
  };

  const handlePublish = async () => {
    if (!selectedFile) return;

    setMessage({ type: 'info', text: 'Обработка видео...' });

    // Симуляция прогресса (можно заменить на реальное кодирование)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Читаем файл как base64
    const reader = new FileReader();
    reader.onload = async () => {
      clearInterval(interval);
      const base64Video = reader.result;

      // Генерируем уникальный ключ для видео
      const videoKey = `vid_${currentUser.uid}_${Date.now()}`;

      // Сохраняем в localStorage
      localStorage.setItem(videoKey, base64Video);

      await addDoc(collection(db, 'news'), {
        authorId: currentUser.uid,
        authorName: currentUser.galaxyName,
        authorAvatar: currentUser.avatar,
        type: 'video',
        videoKey: videoKey,
        timestamp: Date.now(),
        size: selectedFile.size,
        viewers: []
      });

      setMessage({ type: 'success', text: 'Видео опубликовано!' });
      
      // Сброс режима
      setUploadMode(false);
      setSelectedFile(null);
      setUploadProgress(0);
    };
    reader.readAsDataURL(selectedFile);
  };

  const cancelUpload = () => {
    setUploadMode(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setMessage(null);
  };

  const handleVideoClick = (item) => {
    const videoData = localStorage.getItem(item.videoKey);
    if (videoData) {
      setSelectedVideo({ ...item, data: videoData });
    }
  };

  // Фокус на инпут по хоткею (Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="command-terminal">

{newsItems.length > 0 && (
        <div className="terminal-news">
          {newsItems.map(item => (
            <div key={item.id} className="terminal-news-item"
            onClick={() => handleVideoClick(item)} 
            >
              <div className="avatar-wrapper">
                <img src={item.authorAvatar} alt={item.authorName} />
                {item.type === 'video' && <span className="type-icon">🎥</span>}
                {item.type === 'photo' && <span className="type-icon">📷</span>}
                {item.type === 'post' && <span className="type-icon">📝</span>}
              </div>
              {/* <span className="author-name">{item.authorName}</span> */}
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div className="video-player">
          <video src={selectedVideo.data} autoPlay />
          <button onClick={() => setSelectedVideo(null)}>✕</button>
        </div>
      )}


      {message && (
        <div className={`terminal-${message.type}`}>
          {message.text}
        </div>
      )}
      
      {/* <div className="terminal-status">
        CTRL + / 
      </div> */}
      
      {showSuggestions && (
        <div className="terminal-suggestions">
          {suggestions.map(cmd => (
            <div 
              key={cmd} 
              className="suggestion-item"
              onClick={() => handleSuggestionClick(cmd)}
            >
              <span className="command-name">{cmd}</span>
              <span className="command-desc">{commands[cmd].desc}</span>
            </div>
          ))}
        </div>
      )}
      
      {history.length > 0 && (
        <div className="terminal-history">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <span className="history-command">{item.command}</span>
              <span className="history-result">{item.result}</span>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleCommand} className="terminal-container">
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={command}
          onChange={handleInputChange}
          placeholder="введи команду... @@admin, @@news, @@help"
          spellCheck="false"
          autoComplete="off"
        />
      </form>

      {uploadMode && (
        <div className="upload-interface">
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>

          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          <div className="upload-controls">
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              📹 ВЫБРАТЬ ВИДЕО
            </button>
            
            {selectedFile && (
              <>
                <span className="file-name">{selectedFile.name}</span>
                <button 
                  className="publish-btn"
                  onClick={handlePublish}
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                >
                  🚀 ОПУБЛИКОВАТЬ
                </button>
              </>
            )}
            
            <button className="cancel-btn" onClick={cancelUpload}>
              ✕ ОТМЕНА
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommandTerminal;