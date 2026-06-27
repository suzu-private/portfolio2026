import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const wrapper = document.querySelector(".js-top-mv");

if (wrapper) {
  const mv = wrapper.querySelector("[data-top-mv='mv']");
  const mvInner = wrapper.querySelector("[data-top-mv='mv-inner']");
  const contents = wrapper.querySelector("[data-top-mv='contents']");
  const contentsInner = wrapper.querySelector("[data-top-mv='contents-inner']");

  const sticky = document.querySelector(".js-top-sticky");

  let mvScroll;
  let contentsScroll;

  function createAnimation() {
    // CSSプロパティとtransformをリセット
    gsap.set([mv, mvInner, contents, contentsInner], {
      clearProps: "all"
    });
    
    // --contents-widthを初期状態に戻す
    document.documentElement.style.setProperty('--contents-width', '0%');

    const isSp = window.matchMedia('(width < 768px)').matches;

    if (isSp) {
      // ----------------------------
      // SP版: 縦スクロール
      // ----------------------------
      
      // スクロール量を計算
      mvScroll = mvInner.scrollHeight - mv.clientHeight;
      
      // contentsの下辺がウィンドウ（ビューポート）の下辺に来るまでの距離
      const mvTransition = contents.clientHeight + 40;
      const totalScroll = mvScroll + mvTransition;

      console.log('SP:', { mvScroll, mvTransition, totalScroll });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=" + totalScroll,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // ① mv固定しつつmvInnerをスクロール
      tl.to(mvInner, {
        y: -mvScroll,
        ease: "none",
        duration: mvScroll
      });

      // ② mvとcontentsを同時に上にスクロールさせる（contentsの下辺が画面下辺に来るまで）
      tl.to([mv, contents], {
        y: -mvTransition,
        ease: "none",
        duration: mvTransition
      }, ">");

    } else {
      // ----------------------------
      // PC版: 横スクロール（既存の挙動）
      // ----------------------------

      mvScroll = mvInner.scrollHeight - sticky.clientHeight;

      // 一時的に幅を100%に変更して、正確な高さを測定
      const originalWidth = getComputedStyle(document.documentElement).getPropertyValue('--contents-width');
      
      document.documentElement.style.setProperty('--contents-width', '100%');
      
      // 強制的にレイアウトを再計算させる
      contents.offsetHeight; // reflow trigger
      
      // 幅が変わった後のcontentsScrollを正確に計算
      contentsScroll = contentsInner.scrollHeight - contents.clientHeight;
      
      // 元に戻す
      document.documentElement.style.setProperty('--contents-width', originalWidth);

      const transitionDuration = 1000;
      const totalScroll = mvScroll + transitionDuration + contentsScroll;

      console.log('PC:', { mvScroll, contentsScroll, totalScroll });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=" + totalScroll,
          pin: sticky,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // ① MV内スクロール
      tl.to(mvInner, {
        y: -mvScroll,
        ease: "none",
        duration: mvScroll
      });

      // ② 幅変更
      tl.fromTo(":root", {
        "--contents-width": "0%"
      }, {
        "--contents-width": "100%",
        ease: "none",
        duration: transitionDuration
      });

      // ③ 右側スクロール
      tl.to(contentsInner, {
        y: -contentsScroll,
        ease: "none",
        duration: contentsScroll
      });
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    // デバウンス処理：リサイズが完了してから再計算
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // ScrollTriggerをすべて削除してリセット
      ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
      
      // DOMが安定するまで少し待機
      requestAnimationFrame(() => {
        createAnimation();
      });
    }, 250);
  });

  // 初回実行
  createAnimation();
}