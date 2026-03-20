import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import StarField from './StarField';
import { Link } from "react-router-dom";
import "../pages/GalacticMarket.scss";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";

// Firebase конфиг для маркета
const firebaseConfig = {
  apiKey: "AIzaSyD7XJDjsL698FfD7QUMGOaxm77Q6xxxxxx",
  authDomain: "creator-75dac.firebaseapp.com",
  databaseURL: "https://creator-75dac-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "creator-75dac",
  storageBucket: "creator-75dac.firebasestorage.app",
  messagingSenderId: "86422721022",
  appId: "1:86422721022:web:ed2ae88a1bc1be46eff0af",
  measurementId: "G-FN7KWCZX7X"
};

// Инициализация маркет Firebase
const marketApp = initializeApp(firebaseConfig, "market");
const marketDb = getFirestore(marketApp);

const GalacticMarket = () => {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "microphone",
    description: "",
    imageUrl: ""
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: "microphone", label: "🎤 Микрофон", icon: "🎤" },
    { value: "guitar", label: "🎸 Гитара", icon: "🎸" },
    { value: "drums", label: "Ⓜ️ Барабаны", icon: "Ⓜ️" },
    { value: "keys", label: "🎹 Клавиши", icon: "🎹" },
    { value: "studio", label: "🎧 Студийное", icon: "🎧" },
    { value: "other", label: "🔮 Другое", icon: "🔮" }
  ];

  // Загрузка товаров
  // useEffect(() => {
  //   const q = query(collection(marketDb, "market"), orderBy("createdAt", "desc"));
  //   const unsub = onSnapshot(q, (snapshot) => {
  //     const productsData = snapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setProducts(productsData);
  //   });
  //   return () => unsub();
  // }, []);

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !formData.imageUrl) return;

    setUploading(true);
    try {
      await addDoc(collection(marketDb, "market"), {
        ...formData,
        userId: user.uid,
        userName: user.displayName || "Аноним",
        userAvatar: user.photoURL || "",
        createdAt: new Date(),
        status: "active"
      });

      setFormData({
        title: "",
        price: "",
        category: "microphone",
        description: "",
        imageUrl: ""
      });
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="galactic-market">
           <StarField />
      
      <div className="market-header">
        <h1>✦ GALACTIC MARKET ✦</h1>
        <p>барахолка для музыкантов</p>
      </div>

      <div className="market-container">
        {/* Форма добавления */}
        <div className="terminal-form">
          <div className="terminal-header">
            <span className="terminal-title">НОВЫЙ ТОВАР</span>
            <span className="terminal-status"> ACTIVE</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>НАЗВАНИЕ ТОВАРА</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Neumann U87 AI"
                maxLength="50"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ЦЕНА (⚡)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="1500"
                  required
                />
              </div>

              <div className="form-group">
                <label>КАТЕГОРИЯ</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>ОПИСАНИЕ</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Магнитный кристалл с Марса, доставка варпом 3 дня..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>ССЫЛКА НА ФОТО</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>

            {/* Превью */}
            {formData.imageUrl && (
              <div className="preview-card">
                <div className="preview-image">
                  <img 
                    src={formData.imageUrl} 
                    alt="preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span style="color:red">❌ неверная ссылка</span>';
                    }}
                  />
                </div>
                <div className="preview-info">
                  <div className="preview-title">{formData.title || "Название"}</div>
                  <div className="preview-price">{formData.price || "0"} ⚡</div>
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={uploading}>
              {uploading ? "⟳ ЗАГРУЗКА..." : "⟶ выставить"}
            </button>
          </form>
        </div>

        {/* Сетка товаров */}
        {/* <div className="products-grid">
          <h2>ТОВАРЫ В МАРКЕТЕ</h2>
          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-rarity">✦ {product.category.toUpperCase()}</div>
                <div className="product-image">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=NO+IMAGE";
                    }}
                  />
                </div>
                <div className="product-content">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">{product.price} ⚡</span>
                    <span className="product-seller">
                      <img 
                        src={product.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="" 
                        onError={(e) => {
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                      />
                      {product.userName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

      </div>

      <Link to="/" className="market-home">
      🏠
      </Link>
    </div>
  );
};

export default GalacticMarket;