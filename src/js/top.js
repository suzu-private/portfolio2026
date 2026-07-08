import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const wrapper = document.querySelector(".js-top-mv");

if (wrapper) {
  const mv = wrapper.querySelector("[data-top-mv='mv']");
  const mvOverlay = wrapper.querySelector("[data-top-mv='overlay']")
  const mvInner = wrapper.querySelector("[data-top-mv='mv-inner']");
  const contents = wrapper.querySelector("[data-top-mv='contents']");
  const contentsInner = wrapper.querySelector("[data-top-mv='contents-inner']");
  const sticky = document.querySelector(".js-top-sticky");

  let resizeTimer;

  function resetAnimation() {
    // ScrollTriggerを削除
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // transformなどをリセット
    gsap.set([mv, mvInner, contents, contentsInner], {
      clearProps: "all",
    });

    // CSS変数も初期化
    document.documentElement.style.setProperty("--contents-width", "0%");
  }

  function createAnimation() {
    resetAnimation();

    const isSp = window.matchMedia("(width < 768px)").matches;

    // SPはオーバーレイ変更のみ
    if (isSp) {
      gsap.to(mvOverlay, {
        opacity: 0.45,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return;
    }

    // =============================
    // PCのみ
    // =============================

    const mvScroll = mvInner.scrollHeight - sticky.clientHeight;

    // 一時的に幅を100%にして高さを取得
    const originalWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--contents-width");

    document.documentElement.style.setProperty("--contents-width", "100%");
    contents.offsetHeight;

    const contentsScroll =
      contentsInner.scrollHeight - contents.clientHeight;

    document.documentElement.style.setProperty(
      "--contents-width",
      originalWidth
    );

    const transitionDuration = 1000;
    const totalScroll =
      mvScroll + transitionDuration + contentsScroll;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "+=" + totalScroll,
        pin: sticky,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // MV内スクロール
    tl.to(mvInner, {
      y: -mvScroll,
      ease: "none",
      duration: mvScroll,
    });

    // オーバーレイ濃度変更
    tl.to(
      mvOverlay,
      {
        opacity: 0.45,
        ease: "none",
        duration: mvScroll,
      },
      0
    );

    // 幅変更
    tl.fromTo(
      ":root",
      {
        "--contents-width": "0%",
      },
      {
        "--contents-width": "100%",
        ease: "none",
        duration: transitionDuration,
      }
    );

    // 右側スクロール
    tl.to(contentsInner, {
      y: -contentsScroll,
      ease: "none",
      duration: contentsScroll,
    });

    ScrollTrigger.refresh();
  }

  // 初回
  createAnimation();

  // リサイズ
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        createAnimation();
      });
    }, 250);
  });
}