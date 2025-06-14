import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <header class="quartz-header">
      {children.length > 0 && <div class="header-content">{children}</div>}
    </header>
  )
}

Header.css = `
.quartz-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 0 1rem;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
