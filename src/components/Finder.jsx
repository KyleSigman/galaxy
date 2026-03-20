import React , {useState, useEffect} from "react";
import { Link} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot,  doc, getDoc, getDocs   } from "firebase/firestore";
import StarField from './StarField';
import SkyBoxF from "../components/SkyBoxF";
import finder from "../img/find.png"
import drums from "../img/drm.png"
import guitar from "../img/gtr.png"
import bass from "../img/bss.png"
import vocal from "../img/micc.jpg"
import producer from "../img/pdcr.png"
import fx from "../img/fx.png"

const SearchPage = () => {

    const[blogs, Setblogs] = useState([]);
    const[search, setSearch] = useState('');
    const[Searchblogs, SetSearchblogs] = useState([]);
    const [newName, setNewName] = useState("");
    const [user] = useAuthState(auth);

      // Состояние для выбранной опции
    // const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const articleRef = collection(db, "Regalias");
        onSnapshot(articleRef, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          Setblogs(data);       
        });
      }, []);

      useEffect(() => {
        const fetchUserData = async () => {
        try {
        const userRef = doc(db, "users", user.id, "userinfo");
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
        const userInfo = docSnap.data();
        const newName = userInfo?.NAME || "";
        setNewName(newName);
        }
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
        };
        fetchUserData();
        }, [user]);



useEffect(() => {
  SearchBlog();
}, [selectedOption, search]); // Добавьте `search` в зависимости

const SearchBlog = (e) => {
  if (e) e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

  const lowerCaseSearch = search.toLowerCase().trim(); // Убираем лишние пробелы

  // Если поле поиска пустое, сбрасываем результаты
  if (!lowerCaseSearch && !selectedOption) {
    SetSearchblogs([]); // Очищаем результаты
    return;
  }

  // Фильтрация по введенному слову и выбранной категории
  SetSearchblogs(
    blogs.filter((blog) => {
      const matchesSelectedOption = selectedOption ? blog.selectedOption === selectedOption : true;
      const matchesSearch =
        blog.title.toLowerCase().includes(lowerCaseSearch) || 
        blog.style.toLowerCase().includes(lowerCaseSearch) || 
        blog.favband.toLowerCase().includes(lowerCaseSearch);

      return matchesSelectedOption && matchesSearch;
    })
  );
};

    return(
        <div className="Finder">
<StarField />

            <div>
                <form 
                onSubmit={(e) => {SearchBlog(e)}}
                >
                      <input
        onChange={(e) => {
            setSearch(e.target.value); // Обновляем состояние
            SearchBlog(e); // Вызываем функцию поиска
        }}
    />
                    
                </form>

                <div className="radio">
  <label>
    <span style={{fontSize: '32px'}}>😈</span>
    <input
      type="radio"
      value="option1"
      checked={selectedOption === 'option1'}
      onChange={(e) => { 
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
  <label>
    <span style={{fontSize: '32px'}}>🎸</span>
    <input
      type="radio"
      value="option2"
      checked={selectedOption === 'option2'}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
  <label>
    <span style={{fontSize: '32px'}}>🎸</span>
    <input
      type="radio"
      value="option3"
      checked={selectedOption === 'option3'}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
  <label>
    <span style={{fontSize: '32px'}}>🎤</span>
    <input
      type="radio"
      value="option4"
      checked={selectedOption === 'option4'}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
  <label>
    <span style={{fontSize: '32px'}}>🎧</span>
    <input
      type="radio"
      value="option5"
      checked={selectedOption === 'option5'}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
  <label>
    <span style={{fontSize: '32px'}}>😎</span>
    <input
      type="radio"
      value="option6"
      checked={selectedOption === 'option6'}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        SearchBlog(e);
      }}
    />
  </label>
</div>

                {/* <div className="radio">
    <label>
        <img src={drums} alt="" />
        <input
            type="radio"
            value="option1"
            checked={selectedOption === 'option1'}
            onChange={(e) => { 
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
    <label>
        <img src={guitar} alt="" />
        <input
            type="radio"
            value="option2"
            checked={selectedOption === 'option2'}
            onChange={(e) => {
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
    <label>
        <img src={bass} alt="" />
        <input
            type="radio"
            value="option3"
            checked={selectedOption === 'option3'}
            onChange={(e) => {
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
    <label>
        <img src={vocal} alt="" />
        <input
            type="radio"
            value="option4"
            checked={selectedOption === 'option4'}
            onChange={(e) => {
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
    <label>
        <img src={fx} alt="" />
        <input
            type="radio"
            value="option5"
            checked={selectedOption === 'option5'}
            onChange={(e) => {
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
    <label>
        <img src={producer} alt="" />
        <input
            type="radio"
            value="option6"
            checked={selectedOption === 'option6'}
            onChange={(e) => {
                setSelectedOption(e.target.value);
                SearchBlog(e); // вызов функции поиска
            }}
        />
    </label>
                </div> */}

            </div>

            <div className="Regaliascontent">

            {Searchblogs.length === 0 ? (
            <p></p>
            ) : (
            Searchblogs.map(
          ({
            id,
            title,
            exp,
            style,
            price,
            band,
            actualband,
            favband,
            support,
            message,
            state,
            description,
            imageUrl,
            createdAt,
            createdBy,
            userId,
            ready,
            likes,
            comments,
            // followers,
          }) => (
            <div className="regaliacontent">
                
                {/* <Link to={`/vocancy/${id}`}>
                </Link> */}

                  {/* <Link to={`/guest/${userId}`}>
                  <div className="imgshell">
                  <img className="vocimg" src={imageUrl} alt="title" />
                </div>
                </Link> */}
                
                
              <div className="regalia" key={id}>
              <Link to={`/visitka/${userId}`}>
              {createdBy && 
              (<div className="nick inset">

              {createdBy}
              </div>)}

                </Link>
                  
                  <div className="regaliatittle inset">
                  <h2>специальность:</h2>
                  {title}</div>
                  <div className="regaliaexp inset">
                  <h2>стаж:</h2>
                  {exp}</div>
                  <div className="regaliastyle inset">
                  <h2>стиль:</h2>
                  {style}</div>
                  <div className="regaliaactualband inset">
                  <h2>основной проект:</h2>
                    {actualband}</div>
                  <div className="regaliabands inset">
                  <h2>проекты:</h2>
                    {band}</div>
                    <div className="regaliasupport inset">
                  <h2>разогрев:</h2>
                    {support}</div>

                  <div className="regprice inset">
                    <h2>прайс лист: </h2>
                    {price}</div>
                    <div className="regfavband inset">
                    <h2>фавориты: </h2>
                    {favband}</div>
                    <div className="regmessage inset">
                    <h2>промо: </h2>
                    {message}</div>
                    <div id="p_wrap" className="regtext inset">
                    <h2>ссылки на тг:</h2>
                    {description}</div>
                    <div className="regstate inset">
                    <h2>статус: </h2>
                    {state}</div>
                    <div className="ready inset">
                      {ready}
                    </div>

              </div>
              
            </div>
            
          )
        )
      )}
            </div>

      <div className="finderhome">
        <Link style={{ textDecoration: 'none', color: 'white' }} to="/galaxy/">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="" />
          </Link>
      </div>

        </div>
    );
};
export default SearchPage;

