import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../galaconfig';
// import StarField from './StarField';
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

  // Подписка/отписка
  const toggleSubscribe = async () => {
    if (!currentUser) {
      navigate('/fastreg');
      return;
    }
    
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
    } else {
      await updateDoc(channelRef, {
        subscribers: arrayUnion(currentUser.uid)
      });
      await updateDoc(userRef, {
        subscribedOrigins: arrayUnion(channelId)
      });
      setIsSubscribed(true);
    }
  };

  // Добавить комментарий
const addComment = async (postId, text) => {
    if (!text.trim() || !currentUser) return;
    
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
  };
  
  useEffect(() => {
    const toggleBtns = document.querySelectorAll('.toggle-comments');
    const sendBtns = document.querySelectorAll('.send-comment');
  
    const toggleHandler = (e) => {
      const parent = e.currentTarget.closest('.comments-section');
      const area = parent.querySelector('.comment-input-area');
      area.classList.toggle('show');
    };
  
    const sendHandler = async (e) => {
      const parent = e.currentTarget.closest('.comments-section');
      const input = parent.querySelector('.comment-input-area input');
      const text = input.value.trim();
      if (text && currentUser) {
        const postId = parent.dataset.post;
        await addComment(postId, text);
        input.value = '';
        parent.querySelector('.comment-input-area').classList.remove('show');
      }
    };
  
    toggleBtns.forEach(btn => btn.addEventListener('click', toggleHandler));
    sendBtns.forEach(btn => btn.addEventListener('click', sendHandler));
  
    return () => {
      toggleBtns.forEach(btn => btn.removeEventListener('click', toggleHandler));
      sendBtns.forEach(btn => btn.removeEventListener('click', sendHandler));
    };
  }, [channel, currentUser]);

 
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/origin/${searchId.trim()}`);
    }
  };

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

  return (
    <div className="origin-reader">

      {/* Поисковая строка */}
      <form className="search-section" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Введите ID канала"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className="channel-header">
  <div className="channel-avatar">
    {authorData?.avatar ? (
      <img src={authorData.avatar} alt={authorData.galaxyName} />
    ) : (
      <span>🎤</span>
    )}
  </div>
  <div className="channel-info">
    <h1 className="channel-name">{channel.name || channelId}</h1>
    <div className="channel-meta">
      <span className="channel-author">@{authorData?.galaxyName || channel.uid || 'anon'}</span>
      <span className="channel-stats">{posts.length} {posts.length === 1 ? 'пост' : 'постов'}</span>
      {/* <span className="channel-stats">🔑 {channelId} · {posts.length} {posts.length === 1 ? 'пост' : 'постов'}</span> */}
    </div>
  </div>
  <button 
    className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
    onClick={toggleSubscribe}
  >
    {isSubscribed ? '✅ Пподписан' : '➕ подписаться'}
  </button>
</div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-posts">
            <p>✦ В этом канале пока нет постов ✦</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.postId} className="post-card">
              <div className="post-title">{post.title}</div>
              <div className="post-text">{post.text}</div>
              <div className="post-meta">
                <span>🕒 {new Date(post.date).toLocaleString()}</span>
                <span>🔑 {post.postId}</span>
              </div>

              {/* Комментарии */}
              <div className="comments-section" data-post={post.postId}>
  <button className="toggle-comments">
    💬 + комментировать {post.comments?.length > 0 && `(${post.comments.length})`}
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

              {/* <div className="comments-section" data-post={post.postId}>
  <button className="toggle-comments">💬 + комментировать {post.comments?.length > 0 && `(${post.comments.length})`}</button>
  <div className="comment-input-area">
    <input type="text" placeholder="Ваш комментарий..." />
    <button className="send-comment">➤</button>
  </div>
  <div className="comments-list">
    {(post.comments || []).map((comment, idx) => (
      <div key={idx} className="comment-item">
        <div className="comment-author">@{comment.author}</div>
        <div className="comment-text">{comment.text}</div>
      </div>
    ))}
  </div>
            </div> */}

            </div>
          ))
        )}
      </div>


      <div className="action-buttons">
  <button className="back-btn" onClick={() => navigate('/')}>
    ← НА ГЛАВНУЮ
  </button>
  <button 
    className="share-btn" 
    onClick={() => {
      const url = `${window.location.origin}/origin/${channelId}`;
      navigator.clipboard.writeText(url);
      alert('Ссылка скопирована!');
    }}
  >
    🔗 ПОДЕЛИТЬСЯ
  </button>
</div>

      {/* <button className="back-btn" onClick={() => navigate('/')}>
        ← НА ГЛАВНУЮ
      </button> */}



    </div>
  );
};

export default OriginReader;
