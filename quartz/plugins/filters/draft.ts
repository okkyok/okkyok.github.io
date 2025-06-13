import { QuartzFilterPlugin } from "../types"

export const RemoveDrafts: QuartzFilterPlugin<{}> = () => ({
  name: "RemoveDrafts",
  shouldPublish(_ctx, [_tree, vfile]) {
    // Frontmatterがない場合は常に表示する
    if (!vfile.data?.frontmatter) return true

    // publish: trueが明示的に設定されている場合は表示する
    if (vfile.data.frontmatter.publish === true || vfile.data.frontmatter.publish === "true") return true
    
    // draft: trueが設定されている場合は表示しない
    const draftFlag: boolean =
      vfile.data.frontmatter.draft === true || vfile.data.frontmatter.draft === "true"
    
    // draftフラグがない場合は表示する
    return !draftFlag
  },
})
