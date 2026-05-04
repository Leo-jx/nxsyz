# 宁乡市第十一高级中学官网

这是宁乡市第十一高级中学的官方网站项目，包含完整的前端和后端代码。

## 项目结构

```
.
├── data/               # JSON数据文件
│   ├── admission.json
│   ├── news.json
│   └── teachers.json
├── public/             # 前端静态文件
│   ├── css/            # 样式文件
│   ├── images/         # 图片资源
│   ├── js/             # JavaScript文件
│   └── *.html          # HTML页面
├── server.js           # Express后端服务器
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 本地运行

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

服务器将在 http://localhost:3000 启动

## 部署到Cloudflare Pages

### 前端部署

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

### 后端部署 (可选)

对于后端API，可以使用以下方式之一：

#### 方案1: Cloudflare Workers
1. 将后端逻辑重写为Cloudflare Worker
2. 使用KV存储数据

#### 方案2: Render/Heroku
1. 将后端部署到Render或Heroku
2. 修改前端API调用地址

## 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **后端**: Node.js + Express
- **数据**: JSON文件存储
- **响应式设计**: 支持桌面端、平板、移动端

## 功能特性

- 🏫 学校概况介绍
- 📰 新闻动态展示
- 🎨 特色教育介绍
- 📚 招生信息查询
- 📞 联系我们页面
- 📱 完整响应式设计
- 🎯 移动端触摸滑动

## 联系信息

- 学校地址: 湖南省长沙市宁乡市双江口镇
- 校办电话: 88310089
- 招生咨询: 15084991557 (邓老师)

## License

MIT
