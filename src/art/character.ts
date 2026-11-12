/** Shared apple artwork for the home and board; expressions retain a compact face. */
export function characterSvg(mint=false,happy=false,blink=false,impact=false):string{
 const color=mint?'#9dd4b3':'#ffa392',light=mint?'#b2dfc1':'#ffb4a1',edge=mint?'#79ad8b':'#d38a77';
 const gradient=mint?'mintBody':'peachBody',ink='#70554b';
 const eyes=impact
  ? `<path d="M34 40L42 44L34 47M66 40L58 44L66 47" fill="none" stroke="${ink}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`
  : happy
  ? `<path d="M36 44Q39 40 42 44M58 44Q61 40 64 44" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`
  : blink
  ? `<path d="M36 44Q39 46 42 44M58 44Q61 46 64 44" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`
  : `<ellipse cx="39" cy="43" rx="2.8" ry="3.7" fill="${ink}"/><ellipse cx="61" cy="43" rx="2.8" ry="3.7" fill="${ink}"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -14 100 116">
 <defs><linearGradient id="${gradient}" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>
 <ellipse cx="50" cy="94" rx="29" ry="3.3" fill="${edge}" opacity=".13"/>
 <path d="M49 14Q47 3 51-4" fill="none" stroke="#9b8060" stroke-width="4" stroke-linecap="round"/>
 <path d="M51 4C50-6 59-12 69-10C69 0 61 7 51 4Z" fill="${mint?'#b4bd79':'#91b174'}"/>
 <path d="M54 2Q60-3 65-5" fill="none" stroke="${mint?'#99a468':'#78965f'}" stroke-width="1.3" stroke-linecap="round" opacity=".65"/>
 <path d="M49 13C36 5 22 6 13 17C2 29 4 47 8 61C12 77 25 86 39 92C45 95 49 97 53 96C63 94 72 87 79 78C88 68 92 60 94 53C97 37 95 22 84 14C73 5 60 7 49 13Z" fill="url(#${gradient})" stroke="${edge}" stroke-width="3.5" stroke-linejoin="round"/>
 <path d="M38 17Q27 14 20 23" fill="none" stroke="#fff3df" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round"/>
 <path d="M16 29L15 33" fill="none" stroke="#fff3df" stroke-opacity=".5" stroke-width="2.8" stroke-linecap="round"/>
 <path d="M67 84Q77 80 81 72" fill="none" stroke="${edge}" stroke-opacity=".22" stroke-width="2.2" stroke-linecap="round"/>
 <ellipse cx="31" cy="50" rx="6" ry="3.2" fill="#e68e87" opacity=".5"/><ellipse cx="69" cy="50" rx="6" ry="3.2" fill="#e68e87" opacity=".5"/>
 ${eyes}<path d="M46 49Q50 55 54 49" fill="none" stroke="${ink}" stroke-width="2.3" stroke-linecap="round"/>
 </svg>`;
}
