# Prophesyzx's Blog

欢迎来到我的个人博客！这是一个基于GitHub Pages的个人博客系统，方便我随时查看和编辑内容。

## 功能特点

- 美观现代的界面设计
- 响应式布局，适配各种设备
- 包含首页、关于我、文章、项目和联系等区块
- 支持展示个人技能和项目作品
- 集成了联系表单

## 如何使用

### 查看博客

直接访问 [prophesyzx.github.io](https://prophesyzx.github.io) 即可查看博客内容。

### 编辑博客

1. 克隆仓库到本地：
   ```
   git clone https://github.com/prophesyzx/prophesyzx.github.io.git
   ```

2. 编辑文件：
   - `index.html` - 主页内容
   - `css/style.css` - 样式文件
   - `js/main.js` - JavaScript交互代码

3. 提交更改：
   ```
   git add .
   git commit -m "更新博客内容"
   git push
   ```

### 添加新文章

1. 在`index.html`中的`posts`区块添加新的文章卡片：
   ```html
   <article class="post-card">
       <div class="post-image"></div>
       <div class="post-content">
           <div class="post-meta">
               <span class="post-date">日期</span>
               <span class="post-category">分类</span>
           </div>
           <h3 class="post-title">文章标题</h3>
           <p class="post-excerpt">文章摘要</p>
           <a href="#" class="read-more">阅读全文 <i class="fas fa-arrow-right"></i></a>
       </div>
   </article>
   ```

2. 如果需要创建单独的文章页面，可以在项目根目录创建新的HTML文件，并更新链接。

### 添加新项目

在`index.html`中的`projects`区块添加新的项目卡片：
   ```html
   <div class="project-card">
       <div class="project-icon">
           <i class="fas fa-icon"></i>
       </div>
       <h3 class="project-title">项目名称</h3>
       <p class="project-description">项目描述</p>
       <a href="项目链接" class="project-link">查看项目 <i class="fas fa-external-link-alt"></i></a>
   </div>
   ```

### 更新个人信息

编辑`index.html`中的`about`区块，更新你的个人介绍和技能标签。

### 更新联系方式

编辑`index.html`中的`contact`区块，更新你的联系信息。

## 项目结构

```
prophesyzx.github.io/
├── css/
│   └── style.css          # 样式文件
├── js/
│   └── main.js            # JavaScript交互代码
├── index.html             # 主页
├── README.md              # 项目说明
├── web1/                  # 数据可视化项目
└── web2/                  # 数据分析报告
```

## 技术栈

- HTML5
- CSS3
- JavaScript
- Font Awesome (图标库)

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎通过博客中的联系方式与我联系。
