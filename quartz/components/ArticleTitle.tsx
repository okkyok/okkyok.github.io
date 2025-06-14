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
  margin: 2rem 0 0 0 !important;
  font-size: 2.0rem !important;
  line-height: 2.4rem !important;
  color: #647a83 !important;
}

/* ダークモード対応 */
:root[saved-theme="dark"] h1.article-title {
  color: #e0e0e0 !important;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
