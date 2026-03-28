import React, { useState, useEffect } from "react";
import { db } from "../galaconfig";
import { collection, getDocs } from "firebase/firestore";
import StarField from './StarField';
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [searchField, setSearchField] = useState('all'); // all, id, style, instruments, favbands
  const [expandedCards, setExpandedCards] = useState({});

  const instruments = [
    "барабаны", "перкуссия", "гитара", "бас", "вокал", "клавиши",
    "сэмплер", "виола", "труба", "флейта", "скрипка", "контрабас",
    "пианино", "джембе", "бубен", "треугольник", "аккордеон", "другое"
  ];

  const searchOptions = [
    { value: 'all', label: 'везде' },
    { value: 'id', label: 'по ID' },
    { value: 'style', label: 'по стилю' },
    { value: 'instruments', label: 'по инструментам' },
    { value: 'favband', label: 'по группам' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "artcards"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(data);
    };
    fetchData();
  }, []);

  const handleInstrumentClick = (instrument) => {
    if (selectedInstrument === instrument) {
      setSelectedInstrument('');
    } else {
      setSelectedInstrument(instrument);
    }
  };

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const matchesSearchField = (blog, searchTerm) => {
    const lowerTerm = searchTerm.toLowerCase();
    
    switch (searchField) {
      case 'id':
        return blog.artcardId?.toLowerCase() === lowerTerm;
      case 'style':
        return blog.style?.toLowerCase().includes(lowerTerm);
      case 'instruments':
        return blog.instruments?.some(inst => inst.toLowerCase().includes(lowerTerm));
        case 'favband':
          return blog.favband?.some(band => band.toLowerCase().includes(lowerTerm));
        default: // 'all'
        return (
          (blog.artcardId && blog.artcardId.toLowerCase() === lowerTerm) ||
          (blog.style && blog.style.toLowerCase().includes(lowerTerm)) ||
          (blog.instruments && blog.instruments.some(inst => inst.toLowerCase().includes(lowerTerm))) ||
          (blog.favband && blog.favband.some(band => band.toLowerCase().includes(lowerTerm)))
        );
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = !search ? true : matchesSearchField(blog, search);
    const instrumentMatch = !selectedInstrument ? true : blog.instruments?.includes(selectedInstrument);
    return matchesSearch && instrumentMatch;
  });

  const hasActiveFilters = search || selectedInstrument;

  const renderCardFields = (blog) => {
    const fields = [
      { label: "инструменты", value: blog.instruments?.length > 0 ? blog.instruments.join(", ") : null },
      { label: "стаж", value: blog.experience ? `${blog.experience} лет` : null },
      { label: "стиль", value: blog.style },
      { label: "проекты", value: blog.projects?.length > 0 ? blog.projects.join(", ") : null },
      { label: "любимые группы", value: blog.favband?.length > 0 ? blog.favband.join(", ") : null },
      { label: "образование", value: blog.education },
      { label: "эндорсмент", value: blog.endorsement },
      { label: "оборудование", value: blog.gear },
      { label: "любимая техника", value: blog.favTechnique },
      { label: "сценический образ", value: blog.stageLook },
      { label: "движение на сцене", value: blog.stageMovement },
      { label: "творческий подход", value: blog.creativeApproach },
      { label: "алкоголь", value: blog.alcohol },
      { label: "коммуникация", value: blog.communication },
      { label: "девиз", value: blog.motto },
      { label: "телефон", value: blog.phone },
      { label: "плюс один", value: blog.plusOne },
      { label: "релизы", value: blog.releaseLinks },
      { label: "статус", value: blog.status },
      { label: "коммитмент", value: blog.commitment },
      { label: "тикер", value: blog.ticker },
      // { label: "готов к сотрудничеству", value: blog.ready ? "да" : "нет", isSpecial: true }
    ];

    return fields.map((field, idx) => {
      if (!field.value) return null;
      return (
        <div className={`inset ${field.isSpecial ? 'ready' : ''}`} key={idx}>
          <h2>{field.label}:</h2>
          {field.value}
        </div>
      );
    });
  };

  return (
    <div className="Finder">
      <StarField />
      
      <div className="search-section2">
        <div className="search-form">
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="поиск..."
          />
        </div>

        <div className="search-options">
          {searchOptions.map(option => (
            <div
              key={option.value}
              className={`search-option-chip ${searchField === option.value ? 'active' : ''}`}
              onClick={() => setSearchField(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>

        <div className="instruments-grid">
          {instruments.map(instrument => (
            <div
              key={instrument}
              className={`instrument-chip ${selectedInstrument === instrument ? 'active' : ''}`}
              onClick={() => handleInstrumentClick(instrument)}
            >
              {instrument}
            </div>
          ))}
        </div>

        {selectedInstrument && (
          <button onClick={() => setSelectedInstrument('')} className="reset-btn">
            ✕ сбросить фильтр инструмента
          </button>
        )}
      </div>

      <div className="Regaliascontent">
        {!hasActiveFilters ? (
          <p className="info-message">
            введите запрос или выберите инструмент
          </p>
        ) : filteredBlogs.length === 0 ? (
          <p className="info-message">
            ничего не найдено
          </p>
        ) : (
          filteredBlogs.map(blog => {
            const isExpanded = expandedCards[blog.id];
            return (
              <div className="regaliacontent" key={blog.id}>
                <div className="card-header">
                  <div className="nick inset card-id">{blog.artcardId || blog.id}</div>
                  <div className="expand-btn" onClick={() => toggleCard(blog.id)}>
                    {isExpanded ? "▼" : "▶"}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="card-full-content">
                    {renderCardFields(blog)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="finderhome">
        <Link to="/galaxy/">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="" />
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;