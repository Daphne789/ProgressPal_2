// icons/CalendarIcon.js
import React from 'react';
import { SvgXml } from 'react-native-svg';

const CalendarIcon = ({ color, size }) => {
    const xml = `
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path fill="#506C7F" d="M50,2c-0.553,0-1,0.447-1,1v1v2v4c0,0.553,0.447,1,1,1s1-0.447,1-1V6V4V3C51,2.447,50.553,2,50,2z"></path> <path fill="#506C7F" d="M14,2c-0.553,0-1,0.447-1,1v1v2v4c0,0.553,0.447,1,1,1s1-0.447,1-1V6V4V3C15,2.447,14.553,2,14,2z"></path> </g> <path fill="#F9EBB2" d="M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V17h60V60z"></path> <path fill="#F76D57" d="M62,15H2V8c0-1.104,0.896-2,2-2h7v4c0,1.657,1.343,3,3,3s3-1.343,3-3V6h30v4c0,1.657,1.343,3,3,3 s3-1.343,3-3V6h7c1.104,0,2,0.896,2,2V15z"></path> <g> <path fill="#394240" d="M11,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C10,53.553,10.447,54,11,54z M12,49h4v3h-4V49z"></path> <path fill="#394240" d="M23,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C22,53.553,22.447,54,23,54z M24,49h4v3h-4V49z"></path> <path fill="#394240" d="M35,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C34,53.553,34.447,54,35,54z M36,49h4v3h-4V49z"></path> <path fill="#394240" d="M11,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C10,42.553,10.447,43,11,43z M12,38h4v3h-4V38z"></path> <path fill="#394240" d="M23,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C22,42.553,22.447,43,23,43z M24,38h4v3h-4V38z"></path> <path fill="#394240" d="M35,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C34,42.553,34.447,43,35,43z M36,38h4v3h-4V38z"></path> <path fill="#394240" d="M47,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C46,42.553,46.447,43,47,43z M48,38h4v3h-4V38z"></path> <path fill="#394240" d="M11,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C10,31.553,10.447,32,11,32z M12,27h4v3h-4V27z"></path> <path fill="#394240" d="M23,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C22,31.553,22.447,32,23,32z M24,27h4v3h-4V27z"></path> <path fill="#394240" d="M35,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C34,31.553,34.447,32,35,32z M36,27h4v3h-4V27z"></path> <path fill="#394240" d="M47,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5 C46,31.553,46.447,32,47,32z M48,27h4v3h-4V27z"></path> <path fill="#394240" d="M60,4h-7V3c0-1.657-1.343-3-3-3s-3,1.343-3,3v1H17V3c0-1.657-1.343-3-3-3s-3,1.343-3,3v1H4 C1.789,4,0,5.789,0,8v52c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V8C64,5.789,62.211,4,60,4z M49,3c0-0.553,0.447-1,1-1 s1,0.447,1,1v7c0,0.553-0.447,1-1,1s-1-0.447-1-1V3z M13,3c0-0.553,0.447-1,1-1s1,0.447,1,1v7c0,0.553-0.447,1-1,1s-1-0.447-1-1 V3z M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V17h60V60z M62,15H2V8c0-1.104,0.896-2,2-2h7v4c0,1.657,1.343,3,3,3 s3-1.343,3-3V6h30v4c0,1.657,1.343,3,3,3s3-1.343,3-3V6h7c1.104,0,2,0.896,2,2V15z"></path> </g> </g> <g> <rect x="12" y="27" fill="#B4CCB9" width="4" height="3"></rect> <rect x="24" y="27" fill="#B4CCB9" width="4" height="3"></rect> <rect x="36" y="27" fill="#B4CCB9" width="4" height="3"></rect> <rect x="48" y="27" fill="#B4CCB9" width="4" height="3"></rect> <rect x="12" y="38" fill="#B4CCB9" width="4" height="3"></rect> <rect x="24" y="38" fill="#B4CCB9" width="4" height="3"></rect> <rect x="36" y="38" fill="#B4CCB9" width="4" height="3"></rect> <rect x="48" y="38" fill="#B4CCB9" width="4" height="3"></rect> <rect x="12" y="49" fill="#B4CCB9" width="4" height="3"></rect> <rect x="24" y="49" fill="#B4CCB9" width="4" height="3"></rect> <rect x="36" y="49" fill="#B4CCB9" width="4" height="3"></rect> </g> </g> </g></svg>
  `;

    return <SvgXml xml={xml} width={size} height={size} fill={color} />;
};

export default CalendarIcon;
