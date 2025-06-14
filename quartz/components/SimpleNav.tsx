import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const SimpleNav: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "simple-nav")}>
      <ul>
        <li><a href="/articles">📘 Articles</a></li>
        <li><a href="/notes">📝 Notes</a></li>
        <li><a href="/projects">🛠️ Projects</a></li>
        <li><a href="/about">👤 About</a></li>
      </ul>
    </div>
  )
}

SimpleNav.css = `
.simple-nav {
  margin: 0.5rem 0;
}

.simple-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.simple-nav li {
  margin-bottom: 0.5rem;
}

.simple-nav a {
  display: block;
  padding: 0.25rem 0;
  color: #637983;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.simple-nav a:hover {
  color: #4a5c63;
  text-decoration: underline;
}
`

export default (() => {
  return SimpleNav
}) satisfies QuartzComponentConstructor
