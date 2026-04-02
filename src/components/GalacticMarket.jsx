import React, { useState, useEffect } from "react";
import StarField from './StarField';
import { Link, useNavigate } from "react-router-dom";
import "../pages/GalacticMarket.scss";

import { db } from "../galaconfig";
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";

const GalacticMarket = () => {
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "electronics",
    description: "",
    imageUrl: ""
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 12 общих категорий
  const categories = [
    { value: "electronics", label: "📱 Электроника", icon: "📱" },
    { value: "clothing", label: "👕 Одежда", icon: "👕" },
    { value: "books", label: "📚 Книги", icon: "📚" },
    { value: "games", label: "🎮 Игры", icon: "🎮" },
    { value: "home", label: "🏠 Дом и сад", icon: "🏠" },
    { value: "auto", label: "🚗 Автотовары", icon: "🚗" },
    { value: "sports", label: "🏋️ Спорт", icon: "🏋️" },
    { value: "art", label: "🎨 Искусство", icon: "🎨" },
    { value: "tools", label: "🔧 Инструменты", icon: "🔧" },
    { value: "kids", label: "🧸 Детям", icon: "🧸" },
    { value: "pets", label: "🐶 Животные", icon: "🐶" },
    { value: "other", label: "🎁 Другое", icon: "🎁" }
  ];

  // Загрузка пользователя из localStorage
  useEffect(() => {
    const userKey = localStorage.getItem('userKey');
    const userNick = localStorage.getItem('userNick');
    
    if (!userKey) {
      navigate('/login');
      return;
    }

    setUserData({
      uid: userKey,
      galaxyName: userNick || "Аноним",
      avatar: null // можно будет подтянуть из Firestore при необходимости
    });
  }, [navigate]);

  // Подписка на товары
  useEffect(() => {
    const q = query(
      collection(db, "market"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    });
    
    return () => unsubscribe();
  }, []);

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      alert("Авторизуйтесь для размещения товара");
      navigate('/login');
      return;
    }
    
    if (!formData.imageUrl) {
      alert("Добавьте ссылку на фото");
      return;
    }

    setUploading(true);
    try {
      await addDoc(collection(db, "market"), {
        ...formData,
        price: Number(formData.price),
        userId: userData.uid,
        userName: userData.galaxyName,
        userAvatar: userData.avatar || "",
        createdAt: new Date(),
        status: "active"
      });

      setFormData({
        title: "",
        price: "",
        category: "electronics",
        description: "",
        imageUrl: ""
      });
      
      alert("Товар успешно добавлен!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при добавлении товара");
    } finally {
      setUploading(false);
    }
  };

  // Удаление товара (только для своих)
  const handleDelete = async (productId, userId) => {
    if (!userData || userId !== userData.uid) {
      alert("Вы можете удалять только свои товары");
      return;
    }
    
    if (window.confirm("Удалить товар?")) {
      try {
        await deleteDoc(doc(db, "market", productId));
        alert("Товар удален");
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Получить иконку категории
  const getCategoryIcon = (categoryValue) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.icon : "🎁";
  };

  return (
    <div className="galactic-market">
      <StarField />
      
      <div className="market-header">
        <h1>✦ GALACTIC MARKET ✦</h1>
        <p>межгалактическая барахолка</p>
        {userData && (
          <div className="user-badge">
            👤 @{userData.galaxyName}
          </div>
        )}
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
                placeholder="iPhone 15 Pro Max"
                maxLength="50"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ЦЕНА (⭐)</label>
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
                placeholder="Отличное состояние, торг уместен, доставка по галактике..."
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
                      e.target.parentElement.innerHTML = '<span style="color:red;">❌ неверная ссылка</span>';
                    }}
                  />
                </div>
                <div className="preview-info">
                  <div className="preview-title">{formData.title || "Название"}</div>
                  <div className="preview-price">{formData.price || "0"} ⭐</div>
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={uploading}>
              {uploading ? "⟳ ЗАГРУЗКА..." : "⟶ ВЫСТАВИТЬ"}
            </button>
          </form>
        </div>

        {/* Сетка товаров */}
        <div className="products-grid">
          <div className="products-header">
            <h2>✦ ТОВАРЫ В МАРКЕТЕ ✦</h2>
            <span className="products-count">{products.length} товаров</span>
          </div>
          
          {products.length === 0 ? (
            <div className="empty-products">
              <p>✨ Здесь пока ничего нет ✨</p>
              <p>Стань первым продавцом!</p>
            </div>
          ) : (
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-category">
                    {getCategoryIcon(product.category)}
                  </div>
                  <div className="product-image">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=IMAGE+NOT+FOUND";
                      }}
                    />
                  </div>
                  <div className="product-content">
                    <h3>{product.title}</h3>
                    <p>{product.description.length > 100 
                      ? product.description.slice(0, 100) + "..." 
                      : product.description}</p>
                    <div className="product-meta">
                      <span className="product-price">{formatPrice(product.price)} ⭐</span>
                      <span className="product-seller">
                        {product.userAvatar ? (
                          <img src={product.userAvatar} alt="" />
                        ) : (
                          <span className="seller-icon">👤</span>
                        )}
                        @{product.userName}
                      </span>
                    </div>
                    
                    {/* Кнопка удаления для своих товаров */}
                    {userData && product.userId === userData.uid && (
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product.id, product.userId)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="market-footer">
        <Link to="/" className="market-home">
          🏠
        </Link>
        <Link to="/profile" className="market-profile">
          👤
        </Link>
      </div>
    </div>
  );
};

export default GalacticMarket;
