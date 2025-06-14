import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class="page-title-container">
      <a href="/" class="logo">
        <img src="/static/Loventia_logo.webp" alt="Loventia" class="logo-img" />
      </a>
      <h2 class={classNames(displayClass, "page-title")}>
        <a href={baseDir} class="title-link">{title}</a>
      </h2>
    </div>
  )
}

PageTitle.css = `
.page-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin: 0;
}

.page-title {
  font-size: 1.4rem;
  margin: 0;
  font-family: var(--titleFont);
  color: #637983; /* テキストカラーを #637983 に設定 */
}

.logo {
  display: block;
  margin: 0;
  text-align: center;
  width: 100%;
  line-height: 1;
}

.logo-img {
  height: auto;
  width: auto; /* 自動調節に戻す */
  max-width: 450px; /* 最大横幅を450pxに設定 */
  max-height: 150px;
  object-fit: contain;
}

.title-link {
  color: inherit;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .page-title-container {
    margin: 0.75rem 0 0.5rem 0;
  }
  
  .logo-img {
    height: 36px;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
