import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../galaconfig';
import StarField from './StarField';
import './Origins.scss';

const Origins = () => {
  const [origins, setOrigins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrigins = async () => {
      setLoading(true);
      try {
        const originsRef = collection(db, 'origins');
        const snapshot = await getDocs(originsRef);
        
        const items = await Promise.all(
          snapshot.docs.map(async (originDoc) => {
            const data = originDoc.data();
            let avatar = null;
            if (data.uid) {
              const userDoc = await getDoc(doc(db, 'users', data.uid));
              if (userDoc.exists()) {
                avatar = userDoc.data().avatar;
              }
            }
            return {
              id: originDoc.id,
              name: data.name || originDoc.id,
              ...data,
              avatar,
              postsCount: data.posts?.length || 0,
            };
          })
        );
        
        setOrigins(items);
      } catch (error) {
        console.error('Error loading origins:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrigins();
  }, []);

  const getGridClass = () => {
    const count = origins.length;
    if (count <= 4) return 'grid-2x2';
    if (count <= 9) return 'grid-3x3';
    return 'grid-4x4';
  };

  if (loading) {
    return (
      <div className="origins-page">
        <StarField />
        <div className="loader">✦ ЗАГРУЗКА ✦</div>
      </div>
    );
  }

  return (
    <div className="origins-page">
      <StarField />
      <div className="origins-container">
        <div className="origins-header">
          <h1>✦ КАНАЛЫ ✦</h1>
          <p>{origins.length} каналов</p>
        </div>
        
        <div className={`gala-mode ${getGridClass()}`}>
          {origins.map((origin) => (
            <div 
              key={origin.id} 
              className="gala-card"
              onClick={() => navigate(`/origin/${origin.id}`)}
            >
              <div className="gala-avatar">
                {origin.avatar ? (
                  <img src={origin.avatar} alt={origin.name} />
                ) : (
                  <span>🌌</span>
                )}
              </div>
              <div className="gala-name">{origin.name}</div>
              <div className="gala-stats">
                {origin.postsCount} постов
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Origins;