# JupyterLab Desktop 中文适配版

[![GitHub Release](https://img.shields.io/github/v/release/htyxyt/jupyterlab-desktop)](https://github.com/htyxyt/jupyterlab-desktop/releases)

本项目是 JupyterLab Desktop 的中文适配版本，将 JupyterLab 的笔记本界面与 Python 环境管理功能整合到桌面应用中。

## 功能

- **中文界面**：欢迎页、设置、Python 环境管理及部分提示和对话框已适配简体中文。可以在设置中切换简体中文和英文，少量内容仍可能显示英文。
- **最小化到托盘**：关闭窗口时可选择直接关闭或最小化到系统托盘。通过托盘图标可以恢复窗口或退出程序。
- **已有 Python 环境**：可以选择本机已有的 Python 环境，包括通过 uv 创建的虚拟环境。
- **多语言资源**：桌面界面的语言文件位于 [`src/main/locales`](src/main/locales)，扩展方法见[语言资源说明](src/main/locales/README.md)。

## 下载

目前本仓库提供 **Windows x64 自解压包**：

[下载 JupyterLab Desktop 中文适配版](https://github.com/htyxyt/jupyterlab-desktop/releases/download/v4.6.4-1-cn/JupyterLab-Desktop-CN-4.6.4-1-Windows-x64-SFX.exe) · [查看发布说明](https://github.com/htyxyt/jupyterlab-desktop/releases/tag/v4.6.4-1-cn)

双击下载的文件，选择解压目录；解压完成后运行目录中的 `JupyterLab.exe`。请保留目录里的其他文件。这个自解压包不是安装程序，也没有内置 Python 环境。程序未签名，Windows 可能提示发布者未知。

本仓库目前没有发布 macOS、Linux 或 Windows ARM64 构建。

## 配置 Python 环境

1. 准备一个安装了 JupyterLab 的 Python 环境。若需要在 Notebook 中使用该环境的 Python 内核，也请安装 `ipykernel`。
2. 在应用菜单中选择**管理 Python 环境**，打开**设置**，选择**使用自定义 Python 环境**。
3. 选择该环境的 Python 可执行文件。例如，Windows 上 uv 项目环境通常为 `项目目录\.venv\Scripts\python.exe`。

桌面应用的语言设置与 JupyterLab 网页界面的语言设置相互独立；后者由 Python 环境中的语言包管理。

## 界面设置

在**设置 → 常规**中，可以：

- 在 **Language / 语言**处选择 English 或简体中文，点击**应用并重启**生效。
- 在**关闭窗口时**选择**直接关闭**或**最小化到托盘**。

## 从源码构建

开发和构建需要 Node.js、Yarn，以及适用于目标平台的构建工具。完整说明见[贡献指南](CONTRIBUTING.md)。

```bash
yarn install --frozen-lockfile
yarn build
yarn test:unit
```

Windows 打包命令为 `yarn dist:win-64`。项目的完整发行包流程还需要准备内置 Python 环境归档；仅运行 `yarn build` 不会生成包含 Python 环境的安装包。

## 文档与反馈

以下详细文档目前为英文：

- [用户指南](user-guide.md)
- [Python 环境管理指南](python-env-management.md)
- [命令行使用指南](cli.md)
- [故障排查](troubleshoot.md)
- [贡献指南](CONTRIBUTING.md)

本项目的问题和建议请提交到 [Issues](https://github.com/htyxyt/jupyterlab-desktop/issues)。项目遵循 [BSD 三条款许可证](LICENSE)。
