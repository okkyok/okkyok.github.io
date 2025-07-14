import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { QuartzEmitterPlugin } from "./quartz/plugins/types"
import path from "path"
import fs from "fs-extra"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */

// カスタムプラグイン：指定された画像フォルダをpublicディレクトリにコピーする
const CopyImageFolder: QuartzEmitterPlugin = () => ({
  name: "CopyImageFolder",
  emit: async (ctx, _content, _resources) => {
    const srcDir = "/Users/okky_1_2/Library/Mobile Documents/com~apple~CloudDocs/my_obsidian/🌏️okkylife/image"
    const destDir = path.join(ctx.argv.output, "image")

    if (fs.existsSync(srcDir)) {
      console.log(`
[CopyImageFolder] Copying images from ${srcDir} to ${destDir}`)
      await fs.copy(srcDir, destDir)
      console.log(`[CopyImageFolder] Finished copying images.`)
    } else {
      console.log(`
[CopyImageFolder] Source directory not found: ${srcDir}`)
    }

    return []
  },
})

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Loventia",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ja-JP",
    baseUrl: "okkylife.com", // 独自ドメインを指定（https:// は含めない）
    ignorePatterns: ["private", "templates", ".obsidian", "image"], // 無視するファイル・ディレクトリ
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#627883", // 虫眼鏡やUI要素の色
          tertiary: "#627883", // ホバー時の色など
          highlight: "rgba(98, 120, 131, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#627883", // 虫眼鏡やUI要素の色
          tertiary: "#627883", // ホバー時の色など
          highlight: "rgba(98, 120, 131, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.TableOfContents(),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.HardLineBreaks(),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
      CopyImageFolder(), // カスタムプラグインを有効化
    ],
  },
}

export default config

// コミットするための意味のない変更 2025-06-09
