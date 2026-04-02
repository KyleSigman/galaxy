import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../pages/GalacticMarketPlace.scss";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, orderBy } from "firebase/firestore";

// Firebase конфиг для маркета (тот же)
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

const marketApp = initializeApp(firebaseConfig, "market");
const marketDb = getFirestore(marketApp);

const GalacticMarketPlace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { value: "all", label: "ВСЕ", icon: "✨" },
    { value: "microphone", label: "МИКРОФОНЫ", icon: "🎤" },
    { value: "guitar", label: "ГИТАРЫ", icon: "🎸" },
    { value: "drums", label: "БАРАБАНЫ", icon: "😈" },
    { value: "keys", label: "КЛАВИШИ", icon: "🎹" },
    { value: "studio", label: "СТУДИЙНОЕ", icon: "🎧" },
    { value: "other", label: "ДРУГОЕ", icon: "🔮" }
  ];

  // Загрузка товаров
  useEffect(() => {
    const q = query(collection(marketDb, "market"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    });
    return () => unsub();
  }, []);

  // Фильтрация
  useEffect(() => {
    let filtered = products;

    // Фильтр по категории
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="market-place">
      <div className="market-header">
        <h1>✦ GALACTIC MARKET ✦</h1>
        <p>межгалактическая барахолка для музыкантов</p>
      </div>

      {/* Поиск */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Категории */}
      <div className="categories-section">
        <div className="categories-grid">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Счетчик товаров */}
      <div className="products-count">
        ⚡ {filteredProducts.length} товаров в маркете
      </div>

      {/* Сетка товаров */}
      <div className="products-grid">
        {filteredProducts.map(product => (
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
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-footer">
                <span className="product-price">{product.price} ⚡</span>
                <div className="product-seller">
                  <img 
                    src={product.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt=""
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                  <span>{product.userName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка для продавцов */}
      <Link to="/market" className="seller-btn">
        + ПРОДАВАТЬ
      </Link>

      {/* Домой */}
      <Link to="/" className="market-home">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="home" />
      </Link>
    </div>
  );
};

export default GalacticMarketPlace;
