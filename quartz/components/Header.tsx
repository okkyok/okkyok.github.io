import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <header class="quartz-header">
      <a href="/" class="logo">
        <img src="/static/Loventi_logo.webp" alt="Loventia" class="logo-img" />
      </a>
      {children.length > 0 && <div class="header-content">{children}</div>}
    </header>
  )
}

Header.css = `
.quartz-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1.5rem 0;
  gap: 2rem;
  padding: 0 1rem;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
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

header h1 {
  margin: 0;
  flex: auto;
  font-size: 1.5rem;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .quartz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .logo {
    margin-bottom: 0.5rem;
  }
  
  .logo-img {
    height: 36px;
  }
}
`

export default (() => Header) satisfies QuartzComponentConstructor
