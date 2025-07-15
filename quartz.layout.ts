import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.Backlinks({ hideWhenEmpty: false })],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Explorer({
      title: "", // タイトルを非表示にする
      filterFn: (node) => {
        // Notesフォルダとその中のファイルを非表示にする
        return (
          // ルートのNotesフォルダを非表示にする
          node.slugSegment !== "Notes" &&
          // Notes/に始まるパスを非表示にする
          !node.slug.startsWith("Notes/") &&
          // 任意の階層にあるNotesフォルダを非表示にする
          !node.slug.includes("/Notes/")
        )
      },
    }),
  ],
  right: [Component.DesktopOnly(Component.TableOfContents())],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Explorer({
      title: "", // タイトルを非表示にする
      filterFn: (node) => {
        // Notesフォルダとその中のファイルを非表示にする
        return (
          // ルートのNotesフォルダを非表示にする
          node.slugSegment !== "Notes" &&
          // Notes/に始まるパスを非表示にする
          !node.slug.startsWith("Notes/") &&
          // 任意の階層にあるNotesフォルダを非表示にする
          !node.slug.includes("/Notes/")
        )
      },
    }),
  ],
  right: [],
}
