import React from 'react';
import { Helmet } from 'react-helmet';

function Meta({ title, description, imageUrl }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta roperty="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
    </Helmet>
  );
}

export default Meta;


// import React, { useEffect } from 'react';
// import { Helmet } from 'react-helmet';

// function YourComponent({ title, description, imageUrl }) {

//   useEffect(() => {
//     // установка метатега description при монтировании компонента
//     const helmet = document.querySelector("head");

//     const metaTags = [
//       { property: "og:description", content: description },
//       { property: "og:title", content: title },
//       { property: "og:image", content: imageUrl }
//     ];

//     metaTags.forEach(tag => {
//       const metaTag = document.createElement("meta");

//       for (const key in tag) {
//         metaTag.setAttribute(key, tag[key]);
//       }

//       helmet.appendChild(metaTag);
//     });

//     return () => {
//       // убедитесь, что удаляете все установленные метатеги при размонтировании компонента
//       metaTags.forEach(tag => {
//         const tagToRemove = document.querySelector(`meta[${Object.keys(tag)}="${tag[Object.keys(tag)]}"]`);
//         tagToRemove && helmet.removeChild(tagToRemove);
//       });
//     };
//   }, [title, description, imageUrl]);

//   return null; 
// }

// export default YourComponent;