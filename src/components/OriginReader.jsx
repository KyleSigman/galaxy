import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../galaconfig';
import './OriginReader.scss';

const OriginReader = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [searchId, setSearchId] = useState('');
  const [authorData, setAuthorData] = useState(null);
  
  // Умный хэдэр
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]); // массив объектов каналов, на которые подписан
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const headerRef = useRef(null);
  
  // Нижняя панель
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [displayMode, setDisplayMode] = useState('posts'); // 'posts', 'galamode', 'listmode'
  const [subscriptionsForMode, setSubscriptionsForMode] = useState([]);
  
  // Добавить после существующих состояний
const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  // Загрузка автора канала
  useEffect(() => {
    if (channel?.uid) {
      const loadAuthor = async () => {
        const userDoc = await getDoc(doc(db, 'users', channel.uid));
        if (userDoc.exists()) {
          setAuthorData(userDoc.data());
        }
      };
      loadAuthor();
    }
  }, [channel]);

  // Загрузка текущего пользователя
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

  // Загрузка канала
  useEffect(() => {
    if (!channelId) return;
    
    const loadChannel = async () => {
      setLoading(true);
      const channelRef = doc(db, 'origins', channelId);
      const channelSnap = await getDoc(channelRef);
      
      if (channelSnap.exists()) {
        const data = channelSnap.data();
        setChannel(data);
        if (currentUser) {
          setIsSubscribed((data.subscribers || []).includes(currentUser.uid));
        }
      } else {
        setChannel(null);
      }
      setLoading(false);
    };
    
    loadChannel();
  }, [channelId, currentUser]);

  // Загрузка подписок пользователя (все каналы, где subscribers содержит uid)
  const loadUserSubscriptions = useCallback(async () => {
    if (!currentUser?.uid) return;
    
    setSubscriptionsLoading(true);
    try {
      const originsRef = collection(db, 'origins');
      const q = query(originsRef, where('subscribers', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const subs = [];
      for (const docSnapshot of querySnapshot.docs) {
        const channelData = docSnapshot.data();
        const channelUid = channelData.uid; // ID владельца канала в users
        
        // Загружаем аватар владельца из users
        let avatar = null;
        if (channelUid) {
          const userDoc = await getDoc(doc(db, 'users', channelUid));
          if (userDoc.exists()) {
            avatar = userDoc.data().avatar;
          }
        }
        
        subs.push({
          id: docSnapshot.id,
          ...channelData,
          avatar: avatar // аватар владельца
        });
      }
      
      setSubscriptions(subs);
      setSubscriptionsForMode(subs);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setSubscriptionsLoading(false);
    }
  }, [currentUser]);
  // const loadUserSubscriptions = useCallback(async () => {
  //   if (!currentUser?.uid) return;
    
  //   setSubscriptionsLoading(true);
  //   try {
  //     const originsRef = collection(db, 'origins');
  //     const q = query(originsRef, where('subscribers', 'array-contains', currentUser.uid));
  //     const querySnapshot = await getDocs(q);
      
  //     const subs = [];
  //     querySnapshot.forEach(doc => {
  //       subs.push({
  //         id: doc.id,
  //         ...doc.data()
  //       });
  //     });
  //     setSubscriptions(subs);
  //     setSubscriptionsForMode(subs);
  //   } catch (error) {
  //     console.error('Error loading subscriptions:', error);
  //   } finally {
  //     setSubscriptionsLoading(false);
  //   }
  // }, [currentUser]);

  // Загружаем подписки при наличии пользователя
  useEffect(() => {
    if (currentUser) {
      loadUserSubscriptions();
    }
  }, [currentUser, loadUserSubscriptions]);

  // Обработка клика вне хэдэра для сворачивания
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target) && isHeaderExpanded) {
        setIsHeaderExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHeaderExpanded]);

  // Подписка/отписка
  const toggleSubscribe = async () => {
    if (!currentUser) {
      navigate('/fastreg');
      return;
    }
    
    try {
      const channelRef = doc(db, 'origins', channelId);
      const userRef = doc(db, 'users', currentUser.uid);
      
      if (isSubscribed) {
        await updateDoc(channelRef, {
          subscribers: arrayRemove(currentUser.uid)
        });
        await updateDoc(userRef, {
          subscribedOrigins: arrayRemove(channelId)
        });
        setIsSubscribed(false);
        // Обновляем список подписок
        loadUserSubscriptions();
      } else {
        await updateDoc(channelRef, {
          subscribers: arrayUnion(currentUser.uid)
        });
        await updateDoc(userRef, {
          subscribedOrigins: arrayUnion(channelId)
        });
        setIsSubscribed(true);
        // Обновляем список подписок
        loadUserSubscriptions();
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      alert('Ошибка при подписке. Попробуйте позже.');
    }
  };

  // Добавить комментарий
  const addComment = async (postId, text) => {
    if (!text.trim() || !currentUser) return;
    
    try {
      const channelRef = doc(db, 'origins', channelId);
      const updatedPosts = channel.posts.map(post => {
        if (post.postId === postId) {
          const newComment = {
            author: currentUser.galaxyName,
            authorId: currentUser.uid,
            text: text.trim(),
            date: new Date().toISOString()
          };
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      });
      
      await updateDoc(channelRef, { posts: updatedPosts });
      setChannel({ ...channel, posts: updatedPosts });
      setCommentText({ ...commentText, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  // Поиск по ID
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setIsHeaderExpanded(false);
      navigate(`/origin/${searchId.trim()}`);
    }
  };

  // Переход по подписке
  const goToSubscription = (subId) => {
    setIsHeaderExpanded(false);
    navigate(`/origin/${subId}`);
  };

  // Обработка командной строки
// В handleCommandSubmit - удаляем обработку @@listmode
const handleCommandSubmit = (e) => {
  e.preventDefault();
  const cmd = commandInput.trim().toLowerCase();
  
  if (cmd === '@@galamode') {
    setDisplayMode('galamode');
    setIsBottomExpanded(false);
    setCommandInput('');
  } else if (cmd === '@@posts') {
    setDisplayMode('posts');
    setIsBottomExpanded(false);
    setCommandInput('');
  } else if (cmd.startsWith('@@')) {
    alert(`Неизвестная команда: ${cmd}`);
    setCommandInput('');
  }
};

  // Создать Origin
  const handleCreateOrigin = () => {
    navigate('/create-origin');
  };

  // Получить последний пост для режима listmode
  // const getLastPost = (channelData) => {
  //   const posts = channelData.posts || [];
  //   if (posts.length === 0) return null;
  //   const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  //   return sorted[0];
  // };

  // Рендер режима galamode (сетка подписок)
  const renderGalaMode = () => {
    if (subscriptionsForMode.length === 0) {
      return (
        <div className="empty-subscriptions">
          <p>✨ Нет подписок</p>
          <button onClick={handleCreateOrigin} className="btn-primary">
            ➕ Создать свой Origin
          </button>
        </div>
      );
    }
    
    // Динамическое количество колонок в зависимости от количества
    const getGridClass = () => {
      const count = subscriptionsForMode.length;
      if (count <= 4) return 'grid-2x2';
      if (count <= 9) return 'grid-3x3';
      return 'grid-4x4';
    };
    
    return (
      <div className={`gala-mode ${getGridClass()}`}>
        {subscriptionsForMode.map(sub => (
          <div 
            key={sub.id} 
            className="gala-card"
            onClick={() => goToSubscription(sub.id)}
          >
            <div className="gala-avatar">
              {sub.avatar ? (
                <img src={sub.avatar} alt={sub.name} />
              ) : (
                <span>🎤</span>
              )}
            </div>
            <div className="gala-name">{sub.name || sub.id}</div>
            <div className="gala-stats">
              {(sub.posts?.length || 0)} постов
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Рендер режима listmode (список с последним постом)
  // const renderListMode = () => {
  //   if (subscriptionsForMode.length === 0) {
  //     return (
  //       <div className="empty-subscriptions">
  //         <p>✨ Нет подписок</p>
  //         <button onClick={handleCreateOrigin} className="btn-primary">
  //           ➕ Создать свой Origin
  //         </button>
  //       </div>
  //     );
  //   }
    
  //   return (
  //     <div className="list-mode">
  //       {subscriptionsForMode.map(sub => {
  //         const lastPost = getLastPost(sub);
  //         return (
  //           <div 
  //             key={sub.id} 
  //             className="list-mode-item"
  //             onClick={() => goToSubscription(sub.id)}
  //           >
  //             <div className="list-mode-avatar">
  //               {sub.avatar ? (
  //                 <img src={sub.avatar} alt={sub.name} />
  //               ) : (
  //                 <span>🎤</span>
  //               )}
  //             </div>
  //             <div className="list-mode-info">
  //               <div className="list-mode-name">{sub.name || sub.id}</div>
  //               <div className="list-mode-author">@{sub.uid || 'anon'}</div>
  //               {lastPost && (
  //                 <div className="list-mode-last-post">
  //                   📝 {lastPost.title || lastPost.text?.slice(0, 60)}...
  //                 </div>
  //               )}
  //               {!lastPost && (
  //                 <div className="list-mode-no-posts">✧ Нет постов ✧</div>
  //               )}
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  if (loading) {
    return (
      <div className="origin-reader">
        <div className="loader">✦ ЗАГРУЗКА КАНАЛА ✦</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="empty-state" style={{ background: 'black' }}>
        <h3>⚡ КАНАЛ НЕ НАЙДЕН</h3>
        <p>Проверьте ID канала или создайте свой</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ✦ НА ГЛАВНУЮ ✦
        </button>
      </div>
    );
  }

  const posts = (channel.posts || []).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Рендер основного контента в зависимости от режима
  const renderContent = () => {
    if (displayMode === 'galamode') {
      return renderGalaMode();
    }
    // if (displayMode === 'listmode') {
    //   return renderListMode();
    // }
    
    // Стандартный режим (посты канала)
    return (
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-posts">
            <p>✦ В этом канале пока нет постов ✦</p>
          </div>
        ) : (
          posts.map(post => (
            
            <div key={post.postId} className="post-card" data-post-id={post.postId}>
              <div className="post-title">{post.title}</div>
              <div className="post-text">{post.text}</div>
              <div className="post-meta">
                <span>🕒 {new Date(post.date).toLocaleString()}</span>
                <span>🔑 {post.postId}</span>
              </div>

              <div className="comments-section" data-post={post.postId}>
                <button 
                  className="toggle-comments"
                  onClick={() => {
                    const parent = document.querySelector(`.comments-section[data-post="${post.postId}"]`);
                    const area = parent.querySelector('.comment-input-area');
                    area.classList.toggle('show');
                  }}
                >
                  💬 Комментарии {post.comments?.length > 0 && `(${post.comments.length})`}
                </button>
                <div className="comment-input-area">
                  <input
                    type="text"
                    value={commentText[post.postId] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.postId]: e.target.value })}
                    placeholder={currentUser ? "Ваш комментарий..." : "Войдите, чтобы комментировать"}
                    disabled={!currentUser}
                  />
                  <button 
                    className="send-comment"
                    onClick={async () => {
                      const text = commentText[post.postId]?.trim();
                      if (text && currentUser) {
                        await addComment(post.postId, text);
                        setCommentText({ ...commentText, [post.postId]: '' });
                        const parent = document.querySelector(`.comments-section[data-post="${post.postId}"]`);
                        parent.querySelector('.comment-input-area').classList.remove('show');
                      }
                    }}
                    disabled={!currentUser}
                  >
                    ➤
                  </button>
                </div>
                <div className="comments-list">
                  {(post.comments || []).map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      <div className="comment-author">@{comment.author}</div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Вычисление статистики (добавить после const posts = ...)
const totalComments = channel?.posts?.reduce((sum, post) => sum + (post.comments?.length || 0), 0) || 0;
const postsCount = channel?.posts?.length || 0;

// Функция скролла к посту (добавить после toggleSubscribe или addComment)
const scrollToPost = (postId) => {
  const postElement = document.querySelector(`.post-card[data-post-id="${postId}"]`);
  if (postElement) {
    postElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

  return (
    <div className={`origin-reader ${displayMode !== 'posts' ? 'mode-active' : ''}`}>
      {/* Умный хэдэр */}
{/* Умный хэдэр */}
<div className={`smart-header ${isHeaderExpanded ? 'expanded' : ''}`} ref={headerRef}>
  <div className="header-main">
    <div className="header-left">
      <button className="header-icon" onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}>
        👤
      </button>
    </div>
    
    <div className="channel-header-compact">
      <div 
        className="channel-avatar-compact"
        onClick={() => setIsStatsExpanded(!isStatsExpanded)}
        style={{ cursor: 'pointer' }}
      >
        {authorData?.avatar ? (
          <img src={authorData.avatar} alt={authorData.galaxyName} />
        ) : (
          <span>🎤</span>
        )}
      </div>
      <div className="channel-info-compact">
        <h1 className="channel-name">{channel.name || channelId}</h1>
        <div className="channel-meta">
          <span>@{authorData?.galaxyName || channel.uid || 'anon'}</span>
          {/* число постов убрано */}
        </div>
      </div>
    </div>
    
    <div className="header-actions">

      <button 
        className={`subscribe-btn-header ${isSubscribed ? 'subscribed' : ''}`}
        onClick={toggleSubscribe}
      >
        {isSubscribed ? '⟁' : 'подписаться'}
      </button>
    </div>
  </div>

    {/* Блок статистики канала (по клику на аватарку) */}
    <div className={`stats-expandable ${isStatsExpanded ? 'show' : ''}`}>
    <div className="stats-section">
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{postsCount}</span>
          <span className="stat-label">постов</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{totalComments}</span>
          <span className="stat-label">комментариев</span>
        </div>

        <div className="stat-item">

        <button 
        className="share-btn-header"
        onClick={() => {
          const url = `${window.location.origin}/origin/${channelId}`;
          navigator.clipboard.writeText(url);
          alert('Ссылка скопирована!');
        }}
        title="Поделиться"
      >
        🔗
      </button>
        </div>

      </div>
    </div>
    
    {postsCount > 0 && (
      <div className="posts-list-compact">
        <div className="posts-list-label">📜 ПОСТЫ</div>
        <div className="posts-list-scroll">
          {posts.map(post => (
            <div 
              key={post.postId} 
              className="post-item-compact"
              onClick={() => {
                scrollToPost(post.postId);
                setIsStatsExpanded(false);
              }}
            >
              <span className="post-bullet">•</span>
              <span className="post-title-compact">{post.title || 'Без заголовка'}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {postsCount === 0 && (
      <div className="no-posts-message">
        ✦ В этом канале пока нет постов ✦
      </div>
    )}
  </div>
  
  {/* Блок подписок и поиска (по клику на 👤) */}
  <div className={`header-expandable ${isHeaderExpanded ? 'show' : ''}`}>
    <div className="subscriptions-section">
      <div className="subscriptions-label">👥 МОИ ПОДПИСКИ</div>
      <div className="subscriptions-scroll">
        {subscriptionsLoading ? (
          <div className="subscriptions-loading">Загрузка...</div>
        ) : subscriptions.length === 0 ? (
          <div className="subscriptions-empty">✨ Нет подписок. Создайте свой Origin!</div>
        ) : (
          subscriptions.map(sub => (
            <div 
              key={sub.id} 
              className="subscription-item"
              onClick={() => goToSubscription(sub.id)}
            >
              <div className="subscription-avatar">
                {sub.avatar ? (
                  <img src={sub.avatar} alt={sub.name} />
                ) : (
                  <span>🎤</span>
                )}
              </div>
              <div className="subscription-name">{sub.name || sub.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
    
    <form className="search-expanded" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input-expanded"
        placeholder="Введите ID канала"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button type="submit" className="search-btn-expanded">🔍</button>
    </form>
  </div>
  
</div>

      {/* Основной контент */}
      <div className="origin-content">
        {renderContent()}
      </div>

      {/* Нижняя панель с возможностью расширения */}
      <div className={`bottom-bar ${isBottomExpanded ? 'expanded' : ''}`}>
        <div className={`bottom-expandable ${isBottomExpanded ? 'show' : ''}`}>
          <form className="command-form" onSubmit={handleCommandSubmit}>
            <span className="command-prompt">&gt;</span>
            <input
              type="text"
              className="command-input"
              placeholder="@@galamode | @@posts"
              // placeholder="@@galamode | @@listmode | @@posts"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              autoFocus={isBottomExpanded}
            />
          </form>
        </div>
        
        <div className="bottom-buttons">
          <button className="expand-btn"
            onClick={() => setIsBottomExpanded(!isBottomExpanded)}
          >
            {isBottomExpanded ? '⌃' : '⌄'}
          </button>
          
          <button className="bottom-nav-btn" onClick={() => {
            setDisplayMode('posts');
            setIsBottomExpanded(false);
            navigate('/');
          }}>
            🏠 ГЛАВНАЯ
          </button>
          
          <button className="bottom-nav-btn" onClick={handleCreateOrigin}>
            ➕ СОЗДАТЬ
          </button>
          
          <button className="bottom-nav-btn" onClick={() => navigate('/fastreg')}>
            📝 ВОЙТИ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OriginReader;
