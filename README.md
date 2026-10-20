# 最高领袖陈汉瑞 — 中央门户

中文界面、保留朝鲜语标题的传统门户网站，包含命运计算器、八项变量、可复现的平行时间线、情报报告、历史图表和持久保存的荣誉记录。使用 React、TypeScript、Vite、Tailwind CSS、Framer Motion 与 Recharts 构建，无需后端或 API 密钥。

## 本地开发

```sh
npm ci
npm run dev
```

## 生产验证

```sh
npm test
npm run build
npx playwright install chromium
npm run test:pages
```

`test:pages` 会直接启动并检查 `dist` 产物，覆盖网站根目录和 `/HanruiforPresident/` 项目路径、中文界面、保留的朝鲜语、滑块、计算、报告下载、移动端布局，以及加载失败和禁用 JavaScript 时的恢复提示。使用已有 Chromium 时，可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定浏览器可执行文件路径。

## GitHub Pages 部署

在仓库 Settings → Pages 中选择 **GitHub Actions**。合并到 `main` 后，工作流会构建、执行浏览器验证，再发布 `dist`。请勿直接发布源代码目录，因为源 `index.html` 引用 TypeScript，构建后的页面才会引用可执行的 JavaScript。

静态资源使用相对路径，兼容项目地址和自定义域名。加载完成前会显示门户标题；脚本加载失败时显示重新加载按钮；禁用 JavaScript 或渲染失败时均有中文提示。

中文内容使用宋体风格的系统字体；朝鲜语使用本地打包的 Noto Serif KR，其 SIL Open Font License 位于 `public/licenses`。页首插画同样随网站发布，不依赖外部图片或字体服务器。
