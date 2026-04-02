// galaEngine.js
import React from 'react';

// Вспомогательные компоненты
const Variant = ({ word1, word2 }) => {
  const [current, setCurrent] = React.useState(word1);
  return (
    <span 
      className="variant-word"
      onClick={() => setCurrent(current === word1 ? word2 : word1)}
    >
      {current}
    </span>
  );
};

const ImageHover = ({ word, url }) => (
  <span className="word-with-image">
    {word}
    <span className="image-tooltip">
      <img src={url} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
    </span>
  </span>
);

const HighlightBlock = ({ highlights }) => {
  // Палитра цветов
  const baseColors = [
    // '#FF0000', // красный
    '#ffc340', // оранжевый
    '#FFFF00', // желтый
    '#00FF00', // зеленый
    '#c8ff17', // лимон
    '#00FFFF', // циан
    '#3884ff', // синий
    '#FF00FF', // индиго
    '#b47aff', // лилак
  ];
  
  // Перемешиваем цвета один раз при первом рендере
  const [colors] = React.useState(() => {
    const shuffled = [...baseColors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  
  // Цвета границ тоже перемешиваем (можно отдельно или использовать те же)
  const borderColors = [
    '#FF8C42',
    '#FF6B6B',
    '#4A9E6E',
    '#4A8FE7',
    '#E6B422',
    '#9B6B9E',
    '#F4A261',
    '#2C8C8C',
    '#E67E22',
  ];
  
  const [borderColorsShuffled] = React.useState(() => {
    const shuffled = [...borderColors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  
  return (
    <div className="post-highlights">
      <div className="highlights-title">🔥 лучшие тезисы</div>
      <div className="highlights-list">
        {highlights.map((h, i) => {
          const colorIndex = i % colors.length;
          const marginLeft = i * 5;
          return (
            <div 
              key={i} 
              className="highlight-item"
              style={{
                background: colors[colorIndex],
                borderLeftColor: borderColorsShuffled[colorIndex],
                marginLeft: `${marginLeft}px`,
                '--i': i  
              }}
            >
              {/* <span className="highlight-marker">✦</span> */}
              <span className="highlight-text">{h}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const TocBlock = ({ headings }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // отступ от верхнего края в пикселях
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }, 100);
    }
  };
  
  // const scrollToHeading = (id) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     // Убираем # из URL после скролла
  //     setTimeout(() => {
  //       if (window.history && window.history.replaceState) {
  //         window.history.replaceState(null, '', window.location.pathname + window.location.search);
  //       }
  //     }, 100);
  //   }
  // };
  
  return (
    <div className="post-toc">
      <div 
        className={`toc-title ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        содержание
      </div>
      {isOpen && (
        <div className="toc-list">
          {headings.map((h, i) => (
            <div 
              key={i} 
              className="toc-item"
              onClick={() => scrollToHeading(h.id)}
            >
              <span className="toc-bullet">▹</span>
              <span className="toc-text">{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

class GalaEngine {
  constructor() {
    this.rules = {
      highlight: /\^\^(.*?)\^\^/g, 
      // highlight: /^\^\^(.*?)\^\^$/gm,
      heading: /^## (.*)$/gm,
      variant: /(\S+)\|(\S+)/g,
      image: /(\S+)\[img:(https?:\/\/[^\s\]]+)\]/g
    };
  }

//   parse(rawText) {
//     if (!rawText) return { highlights: [], headings: [], contentBlocks: [] };
    
//     let content = rawText;
    
//     // Извлечь highlights
//     const highlights = [];
//     let match;
//     while ((match = this.rules.highlight.exec(content)) !== null) {
//         highlights.push(match[1].trim());
//     }
    
//     // Извлечь headings
//     const headings = [];
//     while ((match = this.rules.heading.exec(content)) !== null) {
//         const headingText = match[1].trim();
//         headings.push({
//             text: headingText,
//             id: this.slugify(headingText)
//         });
//     }
    
//     // Разбить на блоки по пустым строкам
//     const rawBlocks = content.split(/\n\s*\n/);
//     const contentBlocks = [];
    
//     rawBlocks.forEach((block, index) => {
//         // Обработать непустой блок
//         if (block.trim() !== '') {
//             let processed = block;
            
//             // Обработка заголовков
//             processed = processed.replace(/^## (.*)$/gm, (match, title) => {
//                 const id = this.slugify(title);
//                 return `<h2 class="post-heading" id="${id}">${title}</h2>`;
//             });
            
//             // Обработка highlights
//             processed = processed.replace(/\^\^(.*?)\^\^/g, (match, text) => {
//                 const colors = ['#ffc340', '#FFFF00', '#00FF00', '#c8ff17', '#00FFFF', '#3884ff', '#FF00FF', '#b47aff'];
//                 const randomColor = colors[Math.floor(Math.random() * colors.length)];
//                 return `<span class="inline-highlight" style="background: ${randomColor}; color: #000000;">${text}</span>`;
//             });
            
//             // Обработка !!
//             processed = processed.replace(/!!(.*?)(?=\n|$)/g, '<span class="exclamation-mark">⚡ $1</span>');
            
//             contentBlocks.push(this.parseBlock(processed));
//         }
        
//         // Добавить пустую строку-разделитель после каждого блока, кроме последнего
//         if (index < rawBlocks.length - 1) {
//             contentBlocks.push(<div key={`spacer-${index}`} className="content-block-spacer" />);
//         }
//     });
    
//     return { highlights, headings, contentBlocks };
// }


  parse(rawText) {
    if (!rawText) return { highlights: [], headings: [], contentBlocks: [] };
    console.log('RAW TEXT FROM DB:', JSON.stringify(rawText)); 
    let content = rawText;
    
    // Извлечь highlights
    const highlights = [];
    let match;
    while ((match = this.rules.highlight.exec(content)) !== null) {
      highlights.push(match[1].trim());
    }
    
    // Извлечь headings
    const headings = [];
    while ((match = this.rules.heading.exec(content)) !== null) {
      const headingText = match[1].trim();
      headings.push({
        text: headingText,
        id: this.slugify(headingText)
      });
    }
    
// 👇 НОВЫЕ ОБРАБОТКИ
content = content.replace(/^## (.*)$/gm, (match, title) => {
  const id = this.slugify(title);
  return `<h2 class="post-heading" id="${id}">${title}</h2>`;
});
// content = content.replace(/^## (.*)$/gm, '<h2 class="post-heading">$1</h2>');
content = content.replace(/\^\^(.*?)\^\^/g, (match, text) => {
  const colors = [
    // '#FF0000', // красный
    '#ffc340', // оранжевый
    '#FFFF00', // желтый
    '#00FF00', // зеленый
    '#c8ff17', // лимон
    '#00FFFF', // циан
    '#3884ff', // синий
    '#FF00FF', // индиго
    '#b47aff', // лилак
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `<span class="inline-highlight" style="background: ${randomColor}; color: #000000;">${text}</span>`;
});
    content = content.replace(/!!(.*?)(?=\n|$)/g, '<span class="exclamation-mark">⚡ $1</span>');
    
    // Разобрать контент на блоки
    const blocks = content.split(/\n\s*\n/);
    console.log('BLOCKS:', blocks.map((b, i) => `[${i}]: "${b}"`));
    
    const contentBlocks = blocks.map((block, index) => {
        if (block.trim() === '') {
            console.log(`Блок ${index} пустой, создаю спейсер`);
            return <div key={`spacer-${index}`} className="content-block-spacer" />;
        }
        console.log(`Блок ${index} не пустой, длина ${block.length}`);
        return this.parseBlock(block);
    });
    // const blocks = content.split(/\n\s*\n/);
    // const contentBlocks = blocks.map(block => this.parseBlock(block));
    
    return { highlights, headings, contentBlocks };
  }

  // parse(rawText) {
  //   if (!rawText) return { highlights: [], headings: [], contentBlocks: [] };
  
  //   let content = rawText;
    
  //   // Извлечь highlights
  //   const highlights = [];
  //   let match;
  //   while ((match = this.rules.highlight.exec(content)) !== null) {
  //     highlights.push(match[1].trim());
  //   }
  //   // НЕ УДАЛЯЕМ — оставляем в тексте
    
  //   // Извлечь headings
  //   const headings = [];
  //   while ((match = this.rules.heading.exec(content)) !== null) {
  //     const headingText = match[1].trim();
  //     headings.push({
  //       text: headingText,
  //       id: this.slugify(headingText)
  //     });
  //   }
  //   // НЕ УДАЛЯЕМ — оставляем в тексте
    
  //   // Разобрать контент на блоки
  //   const blocks = content.split(/\n\s*\n/);
  //   const contentBlocks = blocks.map(block => this.parseBlock(block));
    
  //   return { highlights, headings, contentBlocks };
  // }

  // parse(rawText) {
  //   if (!rawText) return { highlights: [], headings: [], contentBlocks: [] };

  //   let content = rawText;
    
  //   // Извлечь highlights
  //   const highlights = [];
  //   let match;
  //   while ((match = this.rules.highlight.exec(content)) !== null) {
  //     highlights.push(match[1].trim());
  //   }
  //   content = content.replace(/^\^\^.*?\^\^$\n?/gm, '');
    
  //   // Извлечь headings
  //   const headings = [];
  //   while ((match = this.rules.heading.exec(content)) !== null) {
  //     const headingText = match[1].trim();
  //     headings.push({
  //       text: headingText,
  //       id: this.slugify(headingText)
  //     });
  //   }
  //   content = content.replace(/^## .*$/gm, '');
    
  //   // Разобрать контент на блоки (разделяем по пустым строкам)
  //   const blocks = content.split(/\n\s*\n/);
  //   const contentBlocks = blocks.map(block => this.parseBlock(block));
    
  //   return { highlights, headings, contentBlocks };
  // }

  parseBlock(block) {
    // Разделяем строку на куски по правилам
    const parts = [];
    let remaining = block;
    
    // Ищем image и variant
    const combinedRegex = /(\S+)\[img:(https?:\/\/[^\s\]]+)\]|(\S+)\|(\S+)/g;
    let lastIndex = 0;
    let execMatch;
    
    while ((execMatch = combinedRegex.exec(remaining)) !== null) {
      // Текст до матча
      if (execMatch.index > lastIndex) {
        const textPart = remaining.slice(lastIndex, execMatch.index);
        if (textPart) parts.push(this.processMarkdownInline(textPart));
      }
      
      // Добавляем компонент
      if (execMatch[1] && execMatch[2]) {
        // image
        parts.push(<ImageHover key={`img-${execMatch.index}`} word={execMatch[1]} url={execMatch[2]} />);
      } else if (execMatch[3] && execMatch[4]) {
        // variant
        parts.push(<Variant key={`var-${execMatch.index}`} word1={execMatch[3]} word2={execMatch[4]} />);
      }
      
      lastIndex = execMatch.index + execMatch[0].length;
    }
    
    // Остаток текста
    if (lastIndex < remaining.length) {
      const textPart = remaining.slice(lastIndex);
      if (textPart) parts.push(this.processMarkdownInline(textPart));
    }
    
    // Если нет ни одного совпадения — весь блок как текст
    if (parts.length === 0) {
      return this.processMarkdownInline(block);
    }
    
    return parts;
  }

  processMarkdownInline(text) {
    // Простая обработка маркдауна в строку (потом можно заменить на React-компоненты)
    let html = text;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    html = html.replace(/\n/g, '<br/>');
    
    // Возвращаем как React-элемент с HTML
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Основной метод рендера
  render(parsed) {
    const { highlights, headings, contentBlocks } = parsed;
    
    return (
      <div className="text-engine-post">
        {highlights.length > 0 && <HighlightBlock highlights={highlights} />}
        {headings.length > 0 && <TocBlock headings={headings} />}
        <div className="post-content">
          {contentBlocks.map((block, i) => (
            <div key={i} className="content-block">
              {Array.isArray(block) ? block : block}
            </div>
          ))}
        </div>
      </div>
    );
  }

  slugify(text) {
    return text.toLowerCase().replace(/[^a-zа-яё0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
  }
}

const galaEngine = new GalaEngine();
export default galaEngine;
