// 現在表示されている見出しの情報を追跡するためのデータ構造
interface HeaderInfo {
  element: Element;
  tocEntries: NodeListOf<Element>;
  y: number;
}

// 現在表示されている見出しの情報を追跡するためのMap
const visibleHeaders = new Map<string, HeaderInfo>();

// 最後にハイライトされた見出しを記憶する変数
let lastHighlightedHeader: HeaderInfo | null = null;

// 現在表示されている見出しをトラッキングするIntersectionObserver
const observer = new IntersectionObserver((entries) => {
  // 各エントリの状態を更新
  for (const entry of entries) {
    const slug = entry.target.id;
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`);
    
    if (tocEntryElements.length > 0) {
      if (entry.isIntersecting) {
        // 見出しが表示されている場合、Mapに追加
        visibleHeaders.set(slug, {
          element: entry.target,
          tocEntries: tocEntryElements,
          y: entry.boundingClientRect.y
        });
      } else {
        // 見出しが表示されていない場合、Mapから削除
        visibleHeaders.delete(slug);
      }
    }
  }
  
  // すべての目次項目からin-viewクラスを削除
  document.querySelectorAll(".toc-content a.in-view").forEach((el) => {
    el.classList.remove("in-view");
  });
  
  // 表示されている見出しがある場合
  if (visibleHeaders.size > 0) {
    // 最も上にある見出しを見つける
    let topHeader: HeaderInfo | null = null;
    let minY = Infinity;
    
    visibleHeaders.forEach((info) => {
      if (info.y < minY) {
        minY = info.y;
        topHeader = info;
      }
    });
    
    // 最も上にある見出しの目次項目にin-viewクラスを追加
    if (topHeader) {
      topHeader.tocEntries.forEach((el) => {
        el.classList.add("in-view");
      });
      // 最後にハイライトされた見出しを更新
      lastHighlightedHeader = topHeader;
    }
  } else if (lastHighlightedHeader) {
    // 表示されている見出しがない場合、最後にハイライトされた見出しを使用
    lastHighlightedHeader.tocEntries.forEach((el) => {
      el.classList.add("in-view");
    });
  } else {
    // 表示されている見出しがなく、最後にハイライトされた見出しもない場合、最初の目次項目をハイライト
    const firstTocEntry = document.querySelector(".toc-content a");
    if (firstTocEntry) {
      firstTocEntry.classList.add("in-view");
    }
  }
}, {
  rootMargin: "-80px 0px -80% 0px" // 上部80px、下部80%を除外して交差判定
});

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed");
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  );
  const content = this.nextElementSibling as HTMLElement | undefined;
  if (!content) return;
  content.classList.toggle("collapsed");
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header");
    const content = toc.querySelector(".toc-content");
    if (!button || !content) return;
    button.addEventListener("click", toggleToc);
    window.addCleanup(() => button.removeEventListener("click", toggleToc));
  }
}

document.addEventListener("nav", () => {
  setupToc();

  // update toc entry highlighting
  observer.disconnect();
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  headers.forEach((header) => observer.observe(header));
});
