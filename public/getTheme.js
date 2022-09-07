const html = document.documentElement.classList

if (localStorage.theme) {
  localStorage.theme === 'dark' && html.add('dark')
} else {
  window.matchMedia('(prefers-color-scheme: dark)').matches && html.add('dark')
}
