// icons/AddIcon.js
import React from 'react';
import { SvgXml } from 'react-native-svg';

const AddIcon = ({ color, size }) => {
    const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${size}px" height="${size}px" viewBox="0 0 256 256" xml:space="preserve">

<defs>
</defs>
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(32,196,203); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 41.901 78.5 c -1.657 0 -3 -1.343 -3 -3 V 20.698 c 0 -1.657 1.343 -3 3 -3 s 3 1.343 3 3 V 75.5 C 44.901 77.157 43.558 78.5 41.901 78.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(27,167,173); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 69.302 51.1 H 14.5 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 54.802 c 1.657 0 3 1.343 3 3 S 70.959 51.1 69.302 51.1 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(27,167,173); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 45.099 75.302 c -1.657 0 -3 -1.343 -3 -3 V 17.5 c 0 -1.657 1.343 -3 3 -3 s 3 1.343 3 3 v 54.802 C 48.1 73.959 46.756 75.302 45.099 75.302 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 72.5 47.9 H 17.698 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 H 72.5 c 1.657 0 3 1.343 3 3 S 74.157 47.9 72.5 47.9 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
  `;

    return <SvgXml xml={xml} width={size} height={size} fill={color} />;
};

export default AddIcon;
