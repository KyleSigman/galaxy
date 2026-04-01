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
    '#FF0000', // красный
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

// const HighlightBlock = ({ highlights }) => {
//   // Палитра ярких цветов для фона
//   const colors = [
//     '#FF0000', // красный
//     '#ffc340', // оранжевый
//     '#FFFF00', // желтый
//     '#00FF00', // зеленый
//     '#c8ff17', // лимон
//     '#00FFFF', // циан
//     '#3884ff', // синий
//     '#FF00FF', // индиго
//     '#b47aff', // лилак
//   ];
  
//   // Цвет границы
//   const borderColors = [
//     '#FF8C42',
//     '#FF6B6B',
//     '#4A9E6E',
//     '#4A8FE7',
//     '#E6B422',
//     '#9B6B9E',
//     '#F4A261',
//     '#2C8C8C',
//     '#E67E22',
//     '#A64B4B',
//     '#6A9C6A',
//     '#E67E22',
//   ];
  
//   return (
//     <div className="post-highlights">
//       <div className="highlights-title">🔥 лучшие тезисы</div>
//       <div className="highlights-list">
//       {highlights.map((h, i) => {
//   const colorIndex = i % colors.length;
//   const marginLeft = i * 5; // каждый следующий +5px, первый 0
//   return (
//     <div 
//       key={i} 
//       className="highlight-item"
//       style={{
//         background: colors[colorIndex],
//         borderLeftColor: borderColors[colorIndex],
//         marginLeft: `${marginLeft}px`
//       }}
//     >
//       <span className="highlight-marker">✦</span>
//       <span className="highlight-text">{h}</span>
//     </div>
//   );
// })}
//       </div>
//     </div>
//   );
// };

// const HighlightBlock = ({ highlights }) => (
  
//   <div className="post-highlights">
//     <div className="highlights-title">🔥 ГОРЯЧИЕ ТЕЗИСЫ</div>
//     <div className="highlights-list">
//       {highlights.map((h, i) => (
//         <div key={i} className="highlight-item">
//           <span className="highlight-marker">✦</span>
//           <span className="highlight-text">{h}</span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// Вспомогательный компонент оглавления с возможностью свернуть

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

// const TocBlock = ({ headings }) => {
//   const [isOpen, setIsOpen] = React.useState(false);
  
//   return (
//     <div className="post-toc">
//       <div 
//         className={`toc-title ${isOpen ? 'open' : ''}`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         содержание
//       </div>
//       {isOpen && (
//         <div className="toc-list">
//           {headings.map((h, i) => (
//             <a key={i} href={`#${h.id}`} className="toc-item">
//               <span className="toc-bullet">▹</span>
//               <span className="toc-text">{h.text}</span>
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const TocBlock = ({ headings }) => (
//   <div className="post-toc">
//     <div className="toc-title">СОДЕРЖАНИЕ</div>
//     <div className="toc-list">
//       {headings.map((h, i) => (
//         <a key={i} href={`#${h.id}`} className="toc-item">
//           <span className="toc-bullet">▹</span>
//           <span className="toc-text">{h.text}</span>
//         </a>
//       ))}
//     </div>
//   </div>
// );

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

  parse(rawText) {
    if (!rawText) return { highlights: [], headings: [], contentBlocks: [] };
  
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
    '#FF0000', // красный
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
    const contentBlocks = blocks.map(block => this.parseBlock(block));
    
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

// // galaEngine.js

// class GalaEngine {
//   constructor() {
//     this.rules = {
//       highlight: /^\^\^(.*?)\^\^$/gm,
//       heading: /^## (.*)$/gm,
//       variant: /(\S+)\|(\S+)/g,
//       image: /(\S+)\[img:(https?:\/\/[^\s\]]+)\]/g
//     };
//   }

//   parse(rawText) {
//     if (!rawText) return { highlights: [], headings: [], contentHtml: '' };

//     let content = rawText;
    
//     const highlights = [];
//     let match;
//     while ((match = this.rules.highlight.exec(content)) !== null) {
//       highlights.push(match[1].trim());
//     }
//     content = content.replace(/^\^\^.*?\^\^$\n?/gm, '');
    
//     const headings = [];
//     while ((match = this.rules.heading.exec(content)) !== null) {
//       const headingText = match[1].trim();
//       headings.push({
//         text: headingText,
//         id: this.slugify(headingText)
//       });
//     }
//     content = content.replace(/^## .*$/gm, '');
    
//     let contentHtml = this.parseInline(content);
//     contentHtml = this.processMarkdown(contentHtml);
//     contentHtml = contentHtml.replace(/\n/g, '<br/>');
    
//     return { highlights, headings, contentHtml };
//   }

//   parseInline(text) {
//     if (!text) return '';
//     let html = text;
    
//     html = html.replace(this.rules.image, (match, word, url) => {
//       return `<span class="word-with-image" data-image="${url}">${word}<span class="image-tooltip"><img src="${url}" onerror="this.style.display='none'"></span></span>`;
//     });
    
//     html = html.replace(this.rules.variant, (match, word1, word2) => {
//       return `<span class="variant-word" data-variant="${word1}|${word2}">${word1}</span>`;
//     });
    
//     return html;
//   }

//   processMarkdown(text) {
//     let html = text;
//     html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
//     html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
//     return html;
//   }

//   render(parsed) {
//     const { highlights, headings, contentHtml } = parsed;
    
//     let html = '';
    
//     if (highlights.length > 0) {
//       html += '<div class="post-highlights">';
//       html += '<div class="highlights-title">✨ КЛЮЧЕВЫЕ ТЕЗИСЫ</div>';
//       html += '<div class="highlights-list">';
//       highlights.forEach(h => {
//         html += `<div class="highlight-item"><span class="highlight-marker">✦</span><span class="highlight-text">${h}</span></div>`;
//       });
//       html += '</div></div>';
//     }
    
//     if (headings.length > 0) {
//       html += '<div class="post-toc">';
//       html += '<div class="toc-title">📖 СОДЕРЖАНИЕ</div>';
//       html += '<div class="toc-list">';
//       headings.forEach(h => {
//         html += `<a href="#${h.id}" class="toc-item">▹ ${h.text}</a>`;
//       });
//       html += '</div></div>';
//     }
    
//     html += `<div class="post-content">${this.addHeadingAnchors(contentHtml, headings)}</div>`;
    
//     return html;
//   }

//   addHeadingAnchors(html, headings) {
//     let result = html;
//     headings.forEach(heading => {
//       const regex = new RegExp(`<h2>${this.escapeRegex(heading.text)}</h2>`, 'i');
//       result = result.replace(regex, `<h2 id="${heading.id}">${heading.text}</h2>`);
//     });
//     return result;
//   }

//   slugify(text) {
//     return text.toLowerCase().replace(/[^a-zа-яё0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
//   }

//   escapeRegex(str) {
//     return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   }
// }

// const galaEngine = new GalaEngine();
// export default galaEngine;