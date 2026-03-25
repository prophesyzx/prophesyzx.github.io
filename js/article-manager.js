// 文章管理模块
const ArticleManager = {
    // 初始化文章数据
    async init() {
        try {
            // 尝试从GitHub获取文章数据
            const articles = await GitHubAPI.getAllArticles();
            
            // 如果GitHub中没有文章数据，初始化一些示例文章
            if (articles.length === 0) {
                const initialArticles = [
                {
                    id: '1',
                    title: '数据可视化在学术研究中的应用',
                    date: '2023-10-15',
                    category: '数据分析',
                    excerpt: '探讨如何利用数据可视化技术更好地展示研究成果，提高论文的可读性和影响力。',
                    content: `<h2>引言</h2>
<p>在当今信息爆炸的时代，数据可视化已成为学术研究中不可或缺的工具。通过将复杂的数据转化为直观的图表和图形，研究者可以更有效地传达研究发现，提高论文的可读性和影响力。</p>

<h2>数据可视化的类型</h2>
<p>学术研究中常用的数据可视化类型包括：</p>
<ul>
<li><strong>折线图</strong>：展示数据随时间的变化趋势</li>
<li><strong>柱状图</strong>：比较不同类别的数据</li>
<li><strong>散点图</strong>：展示两个变量之间的关系</li>
<li><strong>热力图</strong>：展示数据在二维空间中的分布</li>
<li><strong>网络图</strong>：展示实体之间的关系</li>
</ul>

<h2>数据可视化在学术研究中的应用</h2>
<p>数据可视化在学术研究中有广泛的应用，包括但不限于：</p>
<ol>
<li><strong>数据分析</strong>：帮助研究者发现数据中的模式和趋势</li>
<li><strong>结果展示</strong>：清晰地呈现研究发现</li>
<li><strong>论文写作</strong>：提高论文的可读性和吸引力</li>
<li><strong>学术交流</strong>：在会议和研讨会上更有效地传达研究成果</li>
</ol>

<h2>数据可视化的最佳实践</h2>
<p>在学术研究中使用数据可视化时，应遵循以下最佳实践：</p>
<ul>
<li>选择适当的图表类型来展示数据</li>
<li>确保图表清晰、简洁，避免不必要的装饰</li>
<li>提供清晰的标题、标签和图例</li>
<li>使用一致的颜色和样式</li>
<li>确保图表在黑白打印时仍然可读</li>
</ul>

<h2>数据可视化工具</h2>
<p>学术研究中常用的数据可视化工具包括：</p>
<ul>
<li><strong>Python</strong>：Matplotlib, Seaborn, Plotly</li>
<li><strong>R</strong>：ggplot2, lattice</li>
<li><strong>商业软件</strong>：Tableau, Power BI</li>
<li><strong>在线工具</strong>：Datawrapper, Flourish</li>
</ul>

<h2>结论</h2>
<p>数据可视化是学术研究中强大的工具，能够帮助研究者更有效地传达研究发现。通过选择适当的可视化类型和遵循最佳实践，研究者可以创建清晰、有影响力的图表，提高论文的质量和影响力。</p>`
                },
                {
                    id: '2',
                    title: 'Python数据分析常用技巧总结',
                    date: '2023-10-10',
                    category: '编程技巧',
                    excerpt: '分享在Python数据分析过程中常用的技巧和工具，帮助你提高数据分析效率。',
                    content: `<h2>引言</h2>
<p>Python是当今数据分析领域最受欢迎的编程语言之一。它拥有丰富的库和工具，可以大大提高数据分析的效率。本文将总结一些在Python数据分析过程中常用的技巧和工具。</p>

<h2>数据加载与保存</h2>
<p>在数据分析中，第一步通常是加载数据。Pandas库提供了多种数据加载方式：</p>
<pre><code>import pandas as pd

# 从CSV文件加载数据
df = pd.read_csv('data.csv')

# 从Excel文件加载数据
df = pd.read_excel('data.xlsx')

# 从数据库加载数据
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql_query("SELECT * FROM table", conn)

# 保存数据到CSV文件
df.to_csv('output.csv', index=False)

# 保存数据到Excel文件
df.to_excel('output.xlsx', index=False)
</code></pre>

<h2>数据探索</h2>
<p>加载数据后，通常需要进行数据探索，了解数据的基本情况：</p>
<pre><code># 查看数据前几行
df.head()

# 查看数据后几行
df.tail()

# 查看数据基本信息
df.info()

# 查看数据统计信息
df.describe()

# 查看数据形状
df.shape

# 查看列名
df.columns
</code></pre>

<h2>数据清洗</h2>
<p>数据清洗是数据分析的重要环节，以下是一些常用的数据清洗技巧：</p>
<pre><code># 处理缺失值
# 删除包含缺失值的行
df.dropna()

# 填充缺失值
df.fillna(0)  # 用0填充
df.fillna(df.mean())  # 用均值填充

# 处理重复值
df.drop_duplicates()

# 重命名列
df.rename(columns={'old_name': 'new_name'})

# 更改数据类型
df['column'] = df['column'].astype('int')
</code></pre>

<h2>数据筛选与排序</h2>
<pre><code># 筛选数据
df[df['column'] > 10]  # 筛选某列大于10的行
df[df['column'] == 'value']  # 筛选某列等于某个值的行
df[(df['column1'] > 10) & (df['column2'] < 20)]  # 多条件筛选

# 排序数据
df.sort_values(by='column', ascending=False)  # 按某列降序排序
</code></pre>

<h2>数据聚合与分组</h2>
<pre><code># 数据聚合
df.groupby('column').mean()  # 按某列分组并计算均值
df.groupby('column').sum()  # 按某列分组并计算总和
df.groupby('column').count()  # 按某列分组并计数

# 应用多个聚合函数
df.groupby('column').agg({'column1': 'mean', 'column2': 'sum'})
</code></pre>

<h2>数据可视化</h2>
<p>数据可视化是数据分析的重要环节，以下是一些常用的数据可视化技巧：</p>
<pre><code>import matplotlib.pyplot as plt
import seaborn as sns

# 折线图
plt.plot(df['x'], df['y'])
plt.show()

# 柱状图
plt.bar(df['category'], df['value'])
plt.show()

# 散点图
plt.scatter(df['x'], df['y'])
plt.show()

# 使用Seaborn绘制更美观的图表
sns.lineplot(x='x', y='y', data=df)
plt.show()

sns.barplot(x='category', y='value', data=df)
plt.show()

sns.scatterplot(x='x', y='y', data=df)
plt.show()
</code></pre>

<h2>结论</h2>
<p>Python拥有丰富的数据分析工具和库，掌握这些技巧可以大大提高数据分析的效率。本文总结了数据加载与保存、数据探索、数据清洗、数据筛选与排序、数据聚合与分组以及数据可视化等方面的常用技巧，希望对读者的数据分析工作有所帮助。</p>`
                },
                {
                    id: '3',
                    title: '构建响应式网站的实用指南',
                    date: '2023-10-05',
                    category: 'Web开发',
                    excerpt: '学习如何创建一个在各种设备上都能良好显示的响应式网站，提升用户体验。',
                    content: `<h2>引言</h2>
<p>随着移动设备的普及，响应式网站设计已成为现代Web开发的标准。响应式网站能够根据用户的设备自动调整布局和内容，提供最佳的用户体验。本文将介绍构建响应式网站的实用指南。</p>

<h2>什么是响应式设计</h2>
<p>响应式设计是一种Web设计方法，它使网站能够在各种设备和屏幕尺寸上提供良好的用户体验。响应式设计使用灵活的网格、图像和CSS媒体查询，根据设备的屏幕尺寸、方向和分辨率调整网站布局。</p>

<h2>响应式设计的基本原则</h2>
<ul>
<li><strong>流式布局</strong>：使用百分比和弹性单位而非固定像素来定义元素大小</li>
<li><strong>弹性图像</strong>：使图像能够根据容器大小自动缩放</li>
<li><strong>媒体查询</strong>：根据设备特性应用不同的CSS规则</li>
<li><strong>移动优先</strong>：优先为移动设备设计，然后逐步增强到更大的屏幕</li>
</ul>

<h2>响应式设计的技术实现</h2>

<h3>1. 使用视口元标签</h3>
<pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
</code></pre>

<h3>2. 使用流式布局</h3>
<pre><code>.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.column {
    float: left;
    width: 33.33%;
}
</code></pre>

<h3>3. 使用弹性图像</h3>
<pre><code>img {
    max-width: 100%;
    height: auto;
}
</code></pre>

<h3>4. 使用媒体查询</h3>
<pre><code>@media (max-width: 768px) {
    .column {
        width: 100%;
    }
}
</code></pre>

<h2>响应式设计框架</h2>
<p>使用响应式设计框架可以大大简化响应式网站的开发过程。以下是一些流行的响应式设计框架：</p>
<ul>
<li><strong>Bootstrap</strong>：最流行的前端框架之一，提供丰富的响应式组件</li>
<li><strong>Foundation</strong>：另一个流行的响应式前端框架</li>
<li><strong>Bulma</strong>：基于Flexbox的轻量级CSS框架</li>
<li><strong>Tailwind CSS</strong>：实用优先的CSS框架</li>
</ul>

<h2>响应式设计的最佳实践</h2>
<ul>
<li>采用移动优先的设计方法</li>
<li>使用相对单位（em, rem, %, vw, vh）而非固定像素</li>
<li>优化触摸目标大小，至少44x44像素</li>
<li>简化内容，避免在小屏幕上显示过多信息</li>
<li>优化图像和资源加载，提高移动设备性能</li>
<li>在各种设备和屏幕尺寸上测试网站</li>
</ul>

<h2>响应式设计的测试工具</h2>
<p>以下是一些用于测试响应式设计的工具：</p>
<ul>
<li><strong>浏览器开发者工具</strong>：大多数现代浏览器都提供设备模拟功能</li>
<li><strong>Responsinator</strong>：在线工具，显示网站在各种设备上的外观</li>
<li><strong>BrowserStack</strong>：跨浏览器测试平台</li>
<li><strong>Chrome DevTools Device Mode</strong>：Chrome浏览器的设备模拟功能</li>
</ul>

<h2>结论</h2>
<p>响应式设计是现代Web开发的重要组成部分，它确保网站在各种设备上都能提供良好的用户体验。通过遵循响应式设计的基本原则和最佳实践，使用适当的技术和工具，开发者可以创建出美观、实用的响应式网站。</p>`
                }
            ];
            
            // 将初始文章保存到GitHub
            await GitHubAPI.updateAllArticles(initialArticles, '初始化文章数据');
            return initialArticles;
        }
        
        return articles;
        } catch (error) {
            console.error('初始化文章数据失败:', error);
            // 如果GitHub API调用失败，使用localStorage作为后备
            if (!localStorage.getItem('articles')) {
                const initialArticles = [
                    {
                        id: '1',
                        title: '数据可视化在学术研究中的应用',
                        date: '2023-10-15',
                        category: '数据分析',
                        excerpt: '探讨如何利用数据可视化技术更好地展示研究成果，提高论文的可读性和影响力。',
                        content: `<h2>引言</h2>
<p>在当今信息爆炸的时代，数据可视化已成为学术研究中不可或缺的工具。通过将复杂的数据转化为直观的图表和图形，研究者可以更有效地传达研究发现，提高论文的可读性和影响力。</p>

<h2>数据可视化的类型</h2>
<p>学术研究中常用的数据可视化类型包括：</p>
<ul>
<li><strong>折线图</strong>：展示数据随时间的变化趋势</li>
<li><strong>柱状图</strong>：比较不同类别的数据</li>
<li><strong>散点图</strong>：展示两个变量之间的关系</li>
<li><strong>热力图</strong>：展示数据在二维空间中的分布</li>
<li><strong>网络图</strong>：展示实体之间的关系</li>
</ul>

<h2>数据可视化在学术研究中的应用</h2>
<p>数据可视化在学术研究中有广泛的应用，包括但不限于：</p>
<ol>
<li><strong>数据分析</strong>：帮助研究者发现数据中的模式和趋势</li>
<li><strong>结果展示</strong>：清晰地呈现研究发现</li>
<li><strong>论文写作</strong>：提高论文的可读性和吸引力</li>
<li><strong>学术交流</strong>：在会议和研讨会上更有效地传达研究成果</li>
</ol>

<h2>数据可视化的最佳实践</h2>
<p>在学术研究中使用数据可视化时，应遵循以下最佳实践：</p>
<ul>
<li>选择适当的图表类型来展示数据</li>
<li>确保图表清晰、简洁，避免不必要的装饰</li>
<li>提供清晰的标题、标签和图例</li>
<li>使用一致的颜色和样式</li>
<li>确保图表在黑白打印时仍然可读</li>
</ul>

<h2>数据可视化工具</h2>
<p>学术研究中常用的数据可视化工具包括：</p>
<ul>
<li><strong>Python</strong>：Matplotlib, Seaborn, Plotly</li>
<li><strong>R</strong>：ggplot2, lattice</li>
<li><strong>商业软件</strong>：Tableau, Power BI</li>
<li><strong>在线工具</strong>：Datawrapper, Flourish</li>
</ul>

<h2>结论</h2>
<p>数据可视化是学术研究中强大的工具，能够帮助研究者更有效地传达研究发现。通过选择适当的可视化类型和遵循最佳实践，研究者可以创建清晰、有影响力的图表，提高论文的质量和影响力。</p>`
                    }
                ];
                localStorage.setItem('articles', JSON.stringify(initialArticles));
                return initialArticles;
            }
            return JSON.parse(localStorage.getItem('articles')) || [];
        }
    },
    
    // 获取所有文章
    async getAllArticles() {
        try {
            // 尝试从GitHub获取文章数据
            return await GitHubAPI.getAllArticles();
        } catch (error) {
            console.error('获取文章失败:', error);
            // 如果GitHub API调用失败，使用localStorage作为后备
            return JSON.parse(localStorage.getItem('articles')) || [];
        }
    },
    
    // 根据ID获取文章
    getArticleById(id) {
        const articles = this.getAllArticles();
        return articles.find(article => article.id === id);
    },
    
    // 添加文章
    async addArticle(article) {
        try {
            return await GitHubAPI.addArticle(article);
        } catch (error) {
            console.error('添加文章失败:', error);
            // 如果GitHub API调用失败，使用localStorage作为后备
            const articles = await this.getAllArticles();
            articles.unshift(article); // 将新文章添加到开头
            localStorage.setItem('articles', JSON.stringify(articles));
            return article;
        }
    },
    
    // 显示创建文章模态框
    showCreateArticleModal() {
        const createArticleModal = document.createElement('div');
        createArticleModal.className = 'modal';
        createArticleModal.innerHTML = `
            <div class="modal-content article-modal-content">
                <span class="close">&times;</span>
                <h2>创建新文章</h2>
                <form id="create-article-form">
                    <div class="form-group">
                        <label for="article-title">标题</label>
                        <input type="text" id="article-title" required>
                    </div>
                    <div class="form-group">
                        <label for="article-category">分类</label>
                        <select id="article-category" required>
                            <option value="数据分析">数据分析</option>
                            <option value="编程技巧">编程技巧</option>
                            <option value="Web开发">Web开发</option>
                            <option value="技术分享">技术分享</option>
                            <option value="学习笔记">学习笔记</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="article-excerpt">摘要</label>
                        <textarea id="article-excerpt" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>文章内容 (Markdown格式)</label>
                        <div id="markdown-editor-container"></div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="cancel-article-btn" class="btn btn-secondary">取消</button>
                        <button type="submit" class="btn btn-primary">发布文章</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(createArticleModal);
        
        // 初始化Markdown编辑器
        const editor = MarkdownEditor.createEditor('markdown-editor-container', this.getArticleTemplate());
        
        // 关闭模态框
        createArticleModal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(createArticleModal);
        });
        
        // 取消按钮
        createArticleModal.querySelector('#cancel-article-btn').addEventListener('click', () => {
            document.body.removeChild(createArticleModal);
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === createArticleModal) {
                document.body.removeChild(createArticleModal);
            }
        });
        
        // 处理创建文章表单提交
        document.getElementById('create-article-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const articleData = {
                id: Date.now().toString(),
                title: document.getElementById('article-title').value,
                date: new Date().toISOString().split('T')[0],
                category: document.getElementById('article-category').value,
                excerpt: document.getElementById('article-excerpt').value,
                content: editor.getContent()
            };
            
            this.addArticle(articleData);
            this.renderArticles();
            document.body.removeChild(createArticleModal);
            
            // 显示成功消息
            alert('文章创建成功！');
        });
    },
    
    // 获取文章模板
    getArticleTemplate() {
        return `# 文章标题

## 引言

在这里写文章的引言部分...

## 正文

在这里写文章的正文部分...

### 小节标题

在这里写小节内容...

## 结论

在这里写文章的结论部分...

---

*本文由Prophesyzx原创，转载请注明出处。*`;
    },
    
    // 显示编辑文章模态框
    showEditArticleModal(articleId) {
        const article = this.getArticleById(articleId);
        if (!article) {
            alert('文章不存在');
            return;
        }
        
        const editArticleModal = document.createElement('div');
        editArticleModal.className = 'modal';
        editArticleModal.innerHTML = `
            <div class="modal-content article-modal-content">
                <span class="close">&times;</span>
                <h2>编辑文章</h2>
                <form id="edit-article-form">
                    <div class="form-group">
                        <label for="edit-article-title">标题</label>
                        <input type="text" id="edit-article-title" required value="${article.title}">
                    </div>
                    <div class="form-group">
                        <label for="edit-article-category">分类</label>
                        <select id="edit-article-category" required>
                            <option value="数据分析" ${article.category === '数据分析' ? 'selected' : ''}>数据分析</option>
                            <option value="编程技巧" ${article.category === '编程技巧' ? 'selected' : ''}>编程技巧</option>
                            <option value="Web开发" ${article.category === 'Web开发' ? 'selected' : ''}>Web开发</option>
                            <option value="技术分享" ${article.category === '技术分享' ? 'selected' : ''}>技术分享</option>
                            <option value="学习笔记" ${article.category === '学习笔记' ? 'selected' : ''}>学习笔记</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-article-excerpt">摘要</label>
                        <textarea id="edit-article-excerpt" rows="3" required>${article.excerpt}</textarea>
                    </div>
                    <div class="form-group">
                        <label>文章内容 (Markdown格式)</label>
                        <div id="edit-markdown-editor-container"></div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="cancel-edit-article-btn" class="btn btn-secondary">取消</button>
                        <button type="submit" class="btn btn-primary">保存修改</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(editArticleModal);
        
        // 初始化Markdown编辑器
        const editor = MarkdownEditor.createEditor('edit-markdown-editor-container', article.content);
        
        // 关闭模态框
        editArticleModal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(editArticleModal);
        });
        
        // 取消按钮
        editArticleModal.querySelector('#cancel-edit-article-btn').addEventListener('click', () => {
            document.body.removeChild(editArticleModal);
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === editArticleModal) {
                document.body.removeChild(editArticleModal);
            }
        });
        
        // 处理编辑文章表单提交
        document.getElementById('edit-article-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const articleData = {
                id: articleId,
                title: document.getElementById('edit-article-title').value,
                date: article.date,
                category: document.getElementById('edit-article-category').value,
                excerpt: document.getElementById('edit-article-excerpt').value,
                content: editor.getContent()
            };
            
            this.updateArticle(articleData);
            this.renderArticle(articleId);
            document.body.removeChild(editArticleModal);
            
            // 显示成功消息
            alert('文章更新成功！');
        });
    },
    
    // 更新文章
    updateArticle(updatedArticle) {
        const articles = this.getAllArticles();
        const index = articles.findIndex(article => article.id === updatedArticle.id);
        
        if (index !== -1) {
            articles[index] = updatedArticle;
            localStorage.setItem('articles', JSON.stringify(articles));
            return updatedArticle;
        }
        
        return null;
    },
    
    // 删除文章
    deleteArticle(id) {
        let articles = this.getAllArticles();
        articles = articles.filter(article => article.id !== id);
        localStorage.setItem('articles', JSON.stringify(articles));
    },
    
    // 切换文章置顶状态
    togglePinArticle(id) {
        const articles = this.getAllArticles();
        const article = articles.find(article => article.id === id);
        
        if (article) {
            article.isPinned = !article.isPinned;
            localStorage.setItem('articles', JSON.stringify(articles));
            return article;
        }
        
        return null;
    },
    
    // 渲染文章列表到页面
    renderArticles(page = 1) {
        const articles = this.getAllArticles();
        const postsGrid = document.querySelector('.posts-grid');
        
        if (!postsGrid) return;
        
        postsGrid.innerHTML = '';
        
        // 按置顶状态和日期排序文章
        const sortedArticles = [...articles].sort((a, b) => {
            // 置顶文章排在前面
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // 同样置顶状态的文章按日期排序
            return new Date(b.date) - new Date(a.date);
        });

        // 每页显示6篇文章（2行3列）
        const articlesPerPage = 6;
        const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
        
        // 确保页码在有效范围内
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        // 计算当前页的文章范围
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const currentPageArticles = sortedArticles.slice(startIndex, endIndex);

        // 渲染当前页的文章
        currentPageArticles.forEach(article => {
            const postCard = document.createElement('article');
            postCard.className = 'post-card';
            if (article.isPinned) {
                postCard.classList.add('pinned');
            }
            postCard.innerHTML = `
                <div class="post-image"></div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">${article.date}</span>
                        <span class="post-category">${article.category}</span>
                        ${article.isPinned ? '<span class="post-pinned"><i class="fas fa-thumbtack"></i> 置顶</span>' : ''}
                    </div>
                    <h3 class="post-title">${article.title}</h3>
                    <p class="post-excerpt">${article.excerpt}</p>
                    <a href="article.html?id=${article.id}" class="read-more">阅读全文 <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            postsGrid.appendChild(postCard);
        });
        
        // 渲染分页控件
        this.renderPagination(totalPages, page);
    },
    
    // 渲染单篇文章到页面
    renderArticle(id) {
        const article = this.getArticleById(id);
        
        if (!article) {
            document.querySelector('.article-container').innerHTML = '<p>文章不存在</p>';
            return;
        }
        
        // 解析Markdown内容
        let contentHtml = article.content;
        if (typeof marked !== 'undefined') {
            contentHtml = marked.parse(article.content);
        }

        document.querySelector('.article-container').innerHTML = `
            <article class="article">
                <div class="article-header">
                    <h1 class="article-title">${article.title}</h1>
                    <div class="article-meta">
                        <span class="article-date">${article.date}</span>
                        <span class="article-category">${article.category}</span>
                    </div>
                </div>
                <div class="article-content markdown-preview">
                    ${contentHtml}
                </div>
            </article>
        `;
        
        document.title = `${article.title} - Prophesyzx's Blog`;
    },
    
    // 渲染分页控件
    renderPagination(totalPages, currentPage) {
        const section = document.querySelector('#posts');
        let paginationContainer = document.querySelector('.pagination-container');
        
        // 如果分页容器不存在，创建一个
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-container';
            section.appendChild(paginationContainer);
        }
        
        // 如果只有一页，不显示分页控件
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination">';
        
        // 上一页按钮
        paginationHTML += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">上一页</button>`;
        
        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            // 只显示当前页附近的页码
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // 下一页按钮
        paginationHTML += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">下一页</button>`;
        
        paginationHTML += '</div>';
        
        paginationContainer.innerHTML = paginationHTML;
        
        // 添加分页按钮点击事件
        paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (!btn.classList.contains('disabled')) {
                    this.renderArticles(page);
                    // 滚动到文章区域顶部
                    document.querySelector('#posts').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};

// 初始化文章管理器
ArticleManager.init();
