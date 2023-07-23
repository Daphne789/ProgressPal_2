// icons/HomeIcon.js
import React from 'react';
import { SvgXml } from 'react-native-svg';

const HomeIcon = ({ color, size }) => {
  const xml = `
  <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
  <polygon fill="#E8EAF6" points="42,39 6,39 6,23 24,6 42,23"/>
  <g fill="#C5CAE9">
      <polygon points="39,21 34,16 34,9 39,9"/>
      <rect x="6" y="39" width="36" height="10"/>
  </g>
  <polygon fill="#B71C1C" points="24,4.3 4,22.9 6,25.1 24,8.4 42,25.1 44,22.9"/>
  <rect x="18" y="28" fill="#D84315" width="12" height="16"/>
  <rect x="21" y="17" fill="#01579B" width="6" height="6"/>
  <path fill="#FF8A65" d="M27.5,35.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S28,38.3,28,38v-2C28,35.7,27.8,35.5,27.5,35.5z"/>
</svg>
  `;

  return <SvgXml xml={xml} width={size} height={size} fill={color} />;
};

export default HomeIcon;
