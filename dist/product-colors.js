// Sampled from the user's 2026-10-08 product screenshots after conversion to sRGB.
// Main colors identify products; lighter text colors keep small labels clear on dark stages.
export const productColors = {
  aiwinops: {main:'#ff6a00', text:'#ffad73'},
  numops: {main:'#1c5cff', text:'#86a7ff'},
  winchat: {main:'#7424ff', text:'#bb98ff'},
  winedge: {main:'#009f86', text:'#63d8c5'}
};

const families = {
  vision:'aiwinops', analytics:'numops', chat:'winchat',
  visual:'winedge', numeric:'winedge', unified:'winedge'
};
export const palette = Object.fromEntries(Object.entries(families).map(([id,family])=>[id,productColors[family].main]));
palette.stone = '#66758c';
export const productInk = Object.fromEntries(Object.entries(families).map(([id,family])=>[id,productColors[family].text]));
