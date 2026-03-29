// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../galaconfig"; // импорт из нового проекта
// import SkyBoxR from "../components/SkyBoxR";
// import "./Login.scss";

// const Login = () => {
//   const [key, setKey] = useState("");
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(false);

//     const cleanKey = key.trim().toUpperCase();

//     if (cleanKey.length !== 6) {
//       setError(true);
//       setLoading(false);
//       return;
//     }

//     try {
//       const userDoc = await getDoc(doc(db, "users", cleanKey));
      
//       if (userDoc.exists()) {
//         localStorage.setItem("userKey", cleanKey);
//         localStorage.setItem("userNick", userDoc.data().galaxyName);
//         navigate("/galaxy");
//       } else {
//         setError(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <SkyBoxR />
      
//       <div className="terminal-login">
//         <div className="terminal-header">
//           <span className="terminal-title">✦ ВХОД В STARFIELD ✦</span>
//           <span className="terminal-status">🔑 KEY</span>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             {/* <span className="prompt"> x </span> */}
//             <input
//               type="text"
//               value={key}
//               onChange={(e) => setKey(e.target.value.toUpperCase())}
//               placeholder="XXXXXX"
//               maxLength="6"
//               autoFocus
//             />
//           </div>

//           {error && (
//             <div className="error-message">
//               ⚠ НЕВЕРНЫЙ КЛЮЧ
//             </div>
//           )}

//           <button 
//             type="submit" 
//             className="submit-btn"
//             disabled={loading || key.length !== 6}
//           >
//             {loading ? "⟳ ПРОВЕРКА..." : "⟶ ВОЙТИ"}
//           </button>
//         </form>

//         <div className="terminal-footer">
//           <span>НЕТ КЛЮЧА?</span>
//           <Link to="/register" className="register-link">
//             СОЗДАТЬ ПРОФИЛЬ 🚀
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;





import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../galaconfig";
import StarField from '../components/StarField';
import { collection, query, where, getDocs } from 'firebase/firestore';
import "./Login.scss";

const Login = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [debugString, setDebugString] = useState('');
  // const [imageAnalysis, setImageAnalysis] = useState(null);
  // Вход по ключу
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const cleanKey = key.trim().toUpperCase();

    if (cleanKey.length !== 6) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", cleanKey));
      
      if (userDoc.exists()) {
        localStorage.setItem("userKey", cleanKey);
        localStorage.setItem("userNick", userDoc.data().galaxyName);
        navigate("/galaxy");
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  // Вход по .cosmo файлу
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.key) {
          setKey(data.key);
          // Автоматически отправляем форму
          setTimeout(() => {
            document.querySelector('form').dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }, 100);
        }
      } catch (err) {
        setError(true);
      }
    };
    reader.readAsText(file);
  };

  const extractGridColors = (canvas) => {
    const ctx = canvas.getContext('2d');
    const colors = [];
    const step = 66; // 200 / 3 ≈ 66
    
    for (let gy = 0; gy < 3; gy++) {
      for (let gx = 0; gx < 3; gx++) {
        const imageData = ctx.getImageData(gx*step, gy*step, step, step);
        const data = imageData.data;
        
        let r=0,g=0,b=0,count=0;
        for (let i=0; i<data.length; i+=4) {
          if (data[i] > 50 || data[i+1] > 50 || data[i+2] > 50) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
            count++;
          }
        }
        
        if (count > 0) {
          // Сохраняем как числа, не объекты
          colors.push(
            gx*step + step/2,
            gy*step + step/2,
            Math.floor(r/count),
            Math.floor(g/count),
            Math.floor(b/count)
          );
        }
      }
    }
    return colors;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 200, 200);
        
        // Получаем цвета по сетке
        const colors = extractGridColors(canvas);
        const colorsString = JSON.stringify(colors);
        setDebugString(colorsString);
        
        try {
          // Ищем пользователя с такой же строкой цветов
          const q = query(
            collection(db, 'users'),
            where('vpoints', '==', colorsString)
          );
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();
            
            localStorage.setItem('userKey', userDoc.id);
            localStorage.setItem('userNick', userData.galaxyName);
            navigate('/galaxy');
          } else {
            setError(true);
            setAnalysisResult({ message: 'Пользователь не найден' });
          }
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="login-container">
      <StarField />
      <div className="terminal-login">
        <div className="terminal-header">
          <span className="terminal-title">✦ ВХОД В STARFIELD ✦</span>
          <span className="terminal-status">🔑 KEY</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              maxLength="6"
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠ НЕВЕРНЫЙ КЛЮЧ
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || key.length !== 6}
          >
            {loading ? "⟳ ПРОВЕРКА..." : "⟶ ВОЙТИ ПО КЛЮЧУ"}
          </button>
        </form>

        <div className="divider">ИЛИ</div>

        <div className="alternative-login">
          <input
            type="file"
            accept=".cosmo"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="alt-btn"
            onClick={() => fileInputRef.current.click()}
          >
            📁 ВОЙТИ ПО .COSMO
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={imageInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="alt-btn"
            onClick={() => imageInputRef.current.click()}
          >
            📷 ПО КАРТИНКЕ
          </button>
        </div>

        {/* {debugString && (
  <div className="debug-info">
    <h4>🔍 ЗАПРОС:</h4>
    <div className="debug-string">{debugString}</div>
    <div className="debug-length">Длина: {debugString.length} символов</div>
  </div>
)} */}

        <div className="terminal-footer">
          <span>НЕТ КЛЮЧА?</span>
          <Link to="/register" className="register-link">
            СОЗДАТЬ ПРОФИЛЬ 🚀
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
