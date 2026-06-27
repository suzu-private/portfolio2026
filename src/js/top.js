if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
  });
});

// ----------------------------
// mvスクロール終了判定
// ----------------------------
const mvWrapper = document.querySelector('.js-top-mv');
const mv = mvWrapper.querySelector('[data-top-mv="mv"]')

let canResize = false;
let resizeStart = 0;

mv.addEventListener('scroll', () => {
  const isScrollEnd =
    mv.scrollTop + mv.clientHeight >= mv.scrollHeight - 2;

  if (isScrollEnd && !canResize) {
    canResize = true;
    resizeStart = window.scrollY;
    mv.style.overflow = "hidden";
  }

  if (!isScrollEnd && canResize) {
    canResize = false;
  }
});

// ----------------------------
// スクロールでmvの幅を変更
// ----------------------------
const maxWidth = 40;

let ticking = false;

const updateWidth = () => {
  if (!canResize) {
    document.documentElement.style.setProperty('--contents-width', '0%');
    document.documentElement.style.setProperty('--mv-width', '100%');
    ticking = false;
    return;
  }

  const progress = Math.min(
    (window.scrollY - resizeStart) / 500,
    1
  );

  const width = progress * maxWidth;
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty(
    '--contents-width',
    `${width}%`
  );

  rootStyle.setProperty(
    '--mv-width',
    `${100 - width}%`
  );

  if(width === 0) {
    console.log("aaa")
    mv.style.overflow = "scroll";
  }else if (width === 40) {
    mv.style.overflow = "hidden";
    console.log('hidden')
  } 

  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateWidth);
    ticking = true;
  }
});
