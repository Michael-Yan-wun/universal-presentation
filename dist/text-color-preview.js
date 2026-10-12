// Approved typography palette: AIWin orange, white, and WinHub.AI cyan.
// The filename is retained so existing presentation assets remain compatible.
export const brandTypography = {
  primary:'#f08200',
  secondary:'#ffffff',
  platform:'#65d7ea',
  roles:{title:'secondary',emphasis:'primary',number:'primary',body:'secondary',muted:'secondary',line:'primary'}
};

export function applyBrandTypography() {
  document.body.dataset.textTheme='brand';
  for(const color of ['primary','secondary','platform'])document.body.style.setProperty('--type-'+color,brandTypography[color]);
  for(const [role,color] of Object.entries(brandTypography.roles))document.body.style.setProperty('--type-'+role,`var(--type-${color})`);
}
