# 问题跟踪器：本地 Markdown

本仓库的 issue 与规格说明以 Markdown 文件形式存放在 `.scratch/` 下。

## 约定

- 每个功能一个目录：`.scratch/<feature-slug>/`
- 规格说明为 `.scratch/<feature-slug>/spec.md`
- 实现类 issue 一票一文件，存放在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，编号从 `01` 开始；禁止把多个工单合并写进一个文件
- 分诊状态以文件顶部附近的 `Status:` 行记录（`claimed`/`resolved`）
- 评论与会话历史追加到文件底部 `## Comments` 标题之下

## 当技能要求「发布到问题跟踪器」时

在 `.scratch/<feature-slug>/` 下创建新文件（目录不存在时先创建）。

## 当技能要求「获取相关工单」时

读取所引用路径的文件。用户通常直接给出路径或工单编号。

## 寻路操作

供 `/wayfinder` 使用。**地图**是一个文件，每张工单对应一个**子文件**。

- **地图**：`.scratch/<effort>/map.md`（正文为 Notes / Decisions-so-far / Fog）。
- **子工单**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，问题写在正文中。`Type:` 行记录工单类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed`/`resolved`。
- **阻塞关系**：文件顶部附近的 `Blocked by: NN, NN` 行。当所列文件全部为 `resolved` 时，该工单解除阻塞。
- **前沿扫描**：扫描 `.scratch/<effort>/issues/` 下未解决、未阻塞、未被认领的文件；按编号从小到大优先。
- **认领**：开始任何工作前先设置 `Status: claimed` 并保存。
- **解决**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，然后在地图 `map.md` 的 Decisions-so-far 中追加一个上下文指针（gist + 链接）。
