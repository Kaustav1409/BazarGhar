import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  name = "BazarGhar", 
  type = "website",
  image = "https://bazarghar.in/og-image.jpg",
  url = "https://bazarghar.in"
}) => {
  const fullTitle = title ? `${title} — ${name}` : `${name} — Premium E-Commerce | Har Zaroorat Ek Jagah`;
  const defaultDesc = "Discover curated premium products delivered to your doorstep. Quality, convenience and exceptional service.";
  const finalDesc = description || defaultDesc;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={finalDesc} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
