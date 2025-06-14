import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
h1.article-title {
  margin: 1.9rem 0 0 0 !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  font-size: 1.9rem !important;
  line-height: 2.3rem !important;
  color: #647a83 !important;
}

/* ダークモード対応 */
:root[saved-theme="dark"] h1.article-title {
  color: #e0e0e0 !important;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
