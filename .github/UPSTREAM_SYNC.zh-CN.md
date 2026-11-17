# 上游同步自动化

## 工作流程

- `上游同步`工作流每天检查上游 JupyterLab Desktop 的最新正式 Release，也可在 Actions 页面手动运行。它合并上游标签到 `automation/upstream-v...` 分支并创建 PR；不会改写已有分支或自动合并。冲突时任务失败并在运行摘要列出文件，不推送冲突分支。
- `Fork 更新验证`在上述同步 PR 和手动触发时运行 Windows 构建、单元测试、实际桌面启动测试、fork 约束检查及翻译候选报告。成功后上传 Windows x64 自解压包和报告作为工作流附件，不自动发布。
- 合并并复核之后，可在 Actions 页面手动运行 `Fork 更新验证`，选择 `master` 并将 `create_draft` 设为 true，以创建带附件的 Release 草稿。已有同名 tag 或 Release 时会安全失败，不覆盖；不会正式发布、删除旧版本或修改已有 tag。

## 仓库设置

在 Settings → Actions → General → Workflow permissions 中启用 **Allow GitHub Actions to create and approve pull requests**。默认令牌权限可以保持只读：各工作流在需要时声明最小 job 权限。由 `GITHUB_TOKEN` 创建的 PR 的检查可能需要仓库管理员批准，GitHub 也可能限制自动触发，请在 PR 的 Actions 状态中检查。

已有的 `sync_lab_release.yml` 检查的是 JupyterLab Python 包，不负责同步 Desktop 代码；它依赖上游 GitHub App。本 fork 已限制该旧同步任务和上游多平台发布任务只在上游仓库运行，避免旧流程与本 fork 的发布方式冲突。

## 限制

- 翻译报告只根据变更中的界面文本生成候选，可能有遗漏或误报，不会自动翻译用户数据，也不能证明中文覆盖完整。JupyterLab 网页本体由 Python 环境中的语言包处理。
- 自解压包不包含 Python 环境；目标机需配置已有的 Python 环境。Windows 包未签名。
- 新的上游发布可能改变构建流程、测试或 Electron 行为。检查通过不等于覆盖全部实际场景；建议合并前手动验证语言切换、托盘和退出行为。
- 当前上游检查假设正式 Release 标签符合 `v主版本.次版本.补丁-构建号`（构建号可省略）；不符合时停止并提示人工检查。
