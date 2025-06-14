import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <>
      <header class="quartz-header">
        <a href="/" class="logo">
          <img src="/static/Loventi_logo.webp" alt="Loventia" class="logo-img" />
        </a>
        {children.length > 0 && <div class="header-content">{children}</div>}
      </header>
      <div class="header-spacer"></div>
    </>
  )
}

Header.css = `
.quartz-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--light);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 2rem;
}

.logo-img {
  height: 40px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
}

/* ヘッダーの高さ分のスペースを確保 */
.header-spacer {
  height: 80px; /* ヘッダーの高さに合わせて調整 */
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .quartz-header {
    padding: 0.75rem 1rem;
    flex-direction: row;
    align-items: center;
  }
  
  .logo {
    margin-bottom: 0;
    margin-right: 1rem;
  }
  
  .logo-img {
    height: 36px;
  }

  .header-spacer {
    height: 70px; /* モバイル用の高さ */
  }
}
`

export default (() => Header) satisfies QuartzComponentConstructor
