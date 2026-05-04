# 宁乡市第十一高级中学官网

这是宁乡市第十一高级中学的官方网站项目，已优化为纯静态站点，可直接部署到Cloudflare Pages。

## 项目结构

```
.
├── public/             # 前端静态文件
│   ├── css/            # 样式文件
│   ├── images/         # 图片资源
│   ├── js/             # JavaScript文件
│   │   ├── data.js     # 静态数据
│   │   └── main.js     # 主脚本
│   └── *.html          # HTML页面
├── data/               # JSON数据文件 (备份)
├── server.js           # Express后端服务器 (备份)
├── package.json        # 项目配置
├── wrangler.toml       # Cloudflare Pages配置
└── README.md           # 项目说明
```

## 本地运行

### 方式1: 直接打开
直接在浏览器中打开 `public/index.html`

### 方式2: 使用本地服务器
```bash
npm install
npm start
```
服务器将在 http://localhost:3000 启动

## 部署到Cloudflare Pages

### 步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 选择 `Leo-jx/nxsyz` 仓库
5. 配置构建设置：
   - **Project name**: `nxsyz` (或您喜欢的名称)
   - **Production branch**: `master`
   - **Framework preset**: 选择 `None`
   - **Build command**: 留空（不需要构建）
   - **Build output directory**: `public`
6. 点击 **Save and Deploy**

### 自定义域名
部署成功后，您可以：
- 使用 Cloudflare 提供的 `.pages.dev` 域名
- 或绑定自定义域名

## 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **数据**: 静态JavaScript对象
- **响应式设计**: 支持桌面端、平板、移动端
- **部署平台**: Cloudflare Pages

## 功能特性

- 🏫 学校概况介绍
- 📰 新闻动态展示
- 🎨 特色教育介绍
- 📚 招生信息查询
- 📞 联系我们页面
- 📱 完整响应式设计
- 🎯 移动端触摸滑动
- 🔄 Banner轮播

## 联系信息

- 学校地址: 湖南省长沙市宁乡市双江口镇

## 更新数据

如需更新网站内容，编辑 `public/js/data.js` 文件即可。

## License

MIT
