# JupyterLab Desktop 中文适配版

[English](README.md) | 简体中文

本项目是 [JupyterLab Desktop](https://github.com/jupyterlab/jupyterlab-desktop) 的 fork。JupyterLab Desktop 将 JupyterLab 和 Python 环境管理功能整合到桌面应用中，可用于创建和编辑 Jupyter Notebook，也支持连接已有的 JupyterLab 服务器。

## 本 fork 的功能

- **中文桌面界面**：在“设置 → 常规 → Language”中选择“简体中文”，点击“应用并重启”生效。也可以切换回 English。欢迎页、设置、环境管理及部分提示和对话框已适配中文，少量内容仍可能显示英文。
- **关闭到系统托盘**：在“设置 → 常规 → 关闭窗口时”选择“最小化到托盘”。通过托盘图标可以恢复窗口或退出程序；也可以选择“直接关闭”。
- **可扩展的语言资源**：桌面界面的语言资源位于 [`src/main/locales`](src/main/locales)，扩展方法见[语言资源说明](src/main/locales/README.md)。JupyterLab 网页界面本身由其 Python 环境中的语言包管理。

## 安装和运行

请优先查看本 fork 的 [Releases](https://github.com/htyxyt/jupyterlab-desktop/releases) 是否提供适合您系统的构建。如果没有可用的发布包，可按下方说明从源码构建。

[上游发行版](https://github.com/jupyterlab/jupyterlab-desktop/releases)和 `winget install jupyterlab` 安装的是上游程序，不包含本 fork 新增的中文界面和托盘功能。

启动后可在欢迎页新建笔记本或会话、打开文件或文件夹，或连接本地及远程 JupyterLab 服务器。也可以使用 `jlab` 命令；具体用法见[命令行文档](cli.md)。

## Python 环境

在桌面应用菜单中选择“管理 Python 环境”，可以选择已有环境或新建环境。用于本地会话的 Python 环境需要安装兼容的 `jupyterlab` 软件包。更详细的操作请参阅 [Python 环境管理指南](python-env-management.md)。

## 从源码构建

构建依赖 Node.js 和 Yarn；完整的开发、测试及打包说明请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

```bash
yarn install --frozen-lockfile
yarn build
yarn test:unit
```

Windows 打包命令为 `yarn dist:win-64`。完整发行包还需要按照项目构建流程准备内置 Python 环境归档；仅完成 `yarn build` 不会生成包含 Python 环境的安装包。

## 其他文档

- [用户指南](user-guide.md)
- [故障排查](troubleshoot.md)
- [贡献指南](CONTRIBUTING.md)
- [BSD 三条款许可证](LICENSE)
