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
        <img src="/static/Loventi_logo.webp" alt="Loventia" class="logo-img" />
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
  gap: 0.25rem;
  margin: 1rem 0 0.5rem 0;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.logo {
  display: block;
  margin: 0 auto 0.25rem auto;
  text-align: center;
  width: 100%;
  line-height: 1;
}

.logo-img {
  height: auto;
  width: auto;
  max-width: 400px;
  max-height: 120px;
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
