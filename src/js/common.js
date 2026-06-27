// ----------------------------
// menu開閉（sp）
// ----------------------------
function toggleMenu() {
  const html = document.querySelector('html');
  const menu = document.querySelector('.js-menu');
  if (!menu) return;

  const openBtn = document.querySelector('[data-js-menu="open-btn"]');
  const closeBtn = menu.querySelector('[data-js-menu="close-btn"]');

  // メニューを開く
  openBtn.addEventListener('click', () => {
    console.log("click")
    menu.classList.add('is-open');
    html.style.overflow = 'hidden';
  });

  // メニューを閉じる
  closeBtn.addEventListener('click', () => {
    menu.classList.remove('is-open');
    html.style.overflow = '';
  });
}

toggleMenu();