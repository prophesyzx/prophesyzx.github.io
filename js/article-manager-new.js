// 文章管理模块
const ArticleManager = {
    // 初始化文章数据
    async init() {
        // 首先尝试从data/articles.json读取数据
        try {
            const response = await fetch('data/articles.json');
            if (response.ok) {
                const articles = await response.json();
                console.log('从data/articles.json加载文章:', articles);
                // 保存到localStorage
                localStorage.setItem('articles', JSON.stringify(articles));
                return articles;
            }
        } catch (error) {
            console.log('无法从data/articles.json读取数据，尝试从GitHub获取:', error);
        }

        // 如果data/articles.json不存在，尝试从GitHubAPI获取文章数据
        try {
            const articles = await GitHubAPI.getAllArticles();
            console.log('初始化文章数据:', articles);
            
            // 如果没有文章，初始化一些示例文章
            if (articles.length === 0) {
                const initialArticles = [
                    {
                        id: '1',
                        title: '数据可视化在学术研究中的应用',
                        date: '2023-10-15',
                        category: '数据分析',
                        excerpt: '探讨如何利用数据可视化技术更好地展示研究成果，提高论文的可读性和影响力。',
                        content: `<h2>引言</h2>
<p>在当今信息爆炸的时代，数据可视化已成为学术研究中不可或缺的工具。通过将复杂的数据转化为直观的图表和图形，研究者可以更有效地传达研究发现，提高论文的可读性和影响力。</p>`
                    }
                ];
                localStorage.setItem('articles', JSON.stringify(initialArticles));
                console.log('初始化文章数据:', initialArticles);
                return initialArticles;
            }
            
            return articles;
        } catch (error) {
            console.error('初始化文章数据失败:', error);
            return [];
        }
    },

    // 获取所有文章
    async getAllArticles() {
        // 优先从GitHub API获取文章数据
        try {
            const articles = await GitHubAPI.getAllArticles();
            console.log('从GitHub API加载文章:', articles);
            // 保存到localStorage，以便下次快速加载
            localStorage.setItem('articles', JSON.stringify(articles));
            return articles;
        } catch (error) {
            console.log('无法从GitHub API获取文章，尝试从localStorage获取:', error);
            
            // 如果GitHub API获取失败，尝试从localStorage获取
            const localArticles = localStorage.getItem('articles');
            if (localArticles) {
                try {
                    const articles = JSON.parse(localArticles);
                    console.log('从localStorage加载文章:', articles);
                    return articles;
                } catch (error) {
                    console.error('解析本地文章数据失败:', error);
                }
            }
            
            return [];
        }
    },

    // 根据ID获取文章
    async getArticleById(id) {
        const articles = await this.getAllArticles();
        return articles.find(article => article.id === id);
    },

    // 添加文章
    async addArticle(article) {
        console.log('添加文章:', article);
        try {
            // 获取当前文章列表
            const articles = await this.getAllArticles();
            articles.unshift(article); // 将新文章添加到开头
            
            // 立即保存到localStorage，以便快速显示
            localStorage.setItem('articles', JSON.stringify(articles));
            console.log('文章已保存到localStorage');
            
            // 立即渲染文章列表，以便快速显示
            this.renderArticles();
            
            // 异步同步到GitHub，不阻塞UI
            if (GitHubAPI.hasToken()) {
                GitHubAPI.addArticle(article)
                    .then(() => {
                        console.log('文章已同步到GitHub');
                        alert('文章已成功保存到GitHub！');
                    })
                    .catch(error => {
                        console.log('无法同步到GitHub，但文章已保存到本地:', error);
                        alert('文章已保存到本地，但无法同步到GitHub。请检查您的GitHub Token配置。');
                    });
            } else {
                alert('文章已保存到本地。要同步到GitHub，请在设置中配置GitHub Token。');
            }
            
            return article;
        } catch (error) {
            console.error('添加文章失败:', error);
            throw error;
        }
    },

    // 更新文章
    async updateArticle(updatedArticle) {
        console.log('更新文章:', updatedArticle);
        try {
            // 获取当前文章列表
            const articles = await this.getAllArticles();
            const index = articles.findIndex(article => article.id === updatedArticle.id);

            if (index !== -1) {
                articles[index] = updatedArticle;
                
                // 立即保存到localStorage，以便快速显示
                localStorage.setItem('articles', JSON.stringify(articles));
                console.log('文章已保存到localStorage');
                
                // 立即渲染文章列表，以便快速显示
                this.renderArticles();
                
                // 异步同步到GitHub，不阻塞UI
                if (GitHubAPI.hasToken()) {
                    GitHubAPI.updateArticle(updatedArticle)
                        .then(() => {
                            console.log('文章已同步到GitHub');
                            alert('文章已成功保存到GitHub！');
                        })
                        .catch(error => {
                            console.log('无法同步到GitHub，但文章已保存到本地:', error);
                            alert('文章已保存到本地，但无法同步到GitHub。请检查您的GitHub Token配置。');
                        });
                } else {
                    alert('文章已保存到本地。要同步到GitHub，请在设置中配置GitHub Token。');
                }
                
                return updatedArticle;
            }

            return null;
        } catch (error) {
            console.error('更新文章失败:', error);
            throw error;
        }
    },

    // 删除文章
    async deleteArticle(id) {
        try {
            // 获取当前文章列表
            const articles = await this.getAllArticles();
            const index = articles.findIndex(article => article.id === id);

            if (index !== -1) {
                articles.splice(index, 1);
                
                // 立即保存到localStorage，以便快速显示
                localStorage.setItem('articles', JSON.stringify(articles));
                console.log('文章已保存到localStorage');
                
                // 立即渲染文章列表，以便快速显示
                this.renderArticles();
                
                // 异步同步到GitHub，不阻塞UI
                if (GitHubAPI.hasToken()) {
                    GitHubAPI.deleteArticle(id)
                        .then(() => {
                            console.log('文章已同步到GitHub');
                            alert('文章已成功从GitHub删除！');
                        })
                        .catch(error => {
                            console.log('无法同步到GitHub，但文章已保存到本地:', error);
                            alert('文章已从本地删除，但无法从GitHub删除。请检查您的GitHub Token配置。');
                        });
                } else {
                    alert('文章已从本地删除。要从GitHub删除，请在设置中配置GitHub Token。');
                }
                
                return true;
            }

            return false;
        } catch (error) {
            console.error('删除文章失败:', error);
            throw error;
        }
    },

    // 切换文章置顶状态
    async togglePinArticle(id) {
        try {
            // 获取当前文章列表
            const articles = await this.getAllArticles();
            const article = articles.find(article => article.id === id);

            if (article) {
                article.isPinned = !article.isPinned;
                
                // 立即保存到localStorage，以便快速显示
                localStorage.setItem('articles', JSON.stringify(articles));
                console.log('文章已保存到localStorage');
                
                // 立即渲染文章列表，以便快速显示
                this.renderArticles();
                
                // 异步同步到GitHub，不阻塞UI
                if (GitHubAPI.hasToken()) {
                    GitHubAPI.togglePinArticle(id)
                        .then(() => {
                            console.log('文章已同步到GitHub');
                            alert('文章置顶状态已成功保存到GitHub！');
                        })
                        .catch(error => {
                            console.log('无法同步到GitHub，但文章已保存到本地:', error);
                            alert('文章置顶状态已保存到本地，但无法同步到GitHub。请检查您的GitHub Token配置。');
                        });
                } else {
                    alert('文章置顶状态已保存到本地。要同步到GitHub，请在设置中配置GitHub Token。');
                }
                
                return article;
            }

            return null;
        } catch (error) {
            console.error('切换置顶状态失败:', error);
            throw error;
        }
    },

    // 渲染所有文章到首页
    async renderArticles() {
        const articles = await this.getAllArticles();
        const articlesContainer = document.getElementById('articles-container');

        if (!articlesContainer) return;

        // 清空容器
        articlesContainer.innerHTML = '';

        // 如果没有文章，显示提示信息
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<div class="no-articles">暂无文章，点击"创建文章"开始写作吧！</div>';
            return;
        }

        // 先按置顶状态排序，然后按创建时间排序（最新的在前）
        const sortedArticles = [...articles].sort((a, b) => {
            // 如果一个置顶，一个不置顶，置顶的在前
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            
            // 如果都置顶或都不置顶，按创建时间排序（最新的在前）
            return new Date(b.date) - new Date(a.date);
        });

        // 渲染文章卡片
        sortedArticles.forEach(article => {
            const articleCard = this.createArticleCard(article);
            articlesContainer.appendChild(articleCard);
        });
    },

    // 创建文章卡片
    createArticleCard(article) {
        const articleCard = document.createElement('article');
        articleCard.className = 'post-card';
        articleCard.dataset.id = article.id;

        const articleContent = `
            <div class="post-image"></div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-date">${article.date}</span>
                    <span class="post-category">${article.category}</span>
                    ${article.isPinned ? '<span class="post-pinned"><i class="fas fa-thumbtack"></i> 已置顶</span>' : ''}
                </div>
                <h3 class="post-title">${article.title}</h3>
                <p class="post-excerpt">${article.excerpt}</p>
                <a href="article.html?id=${article.id}" class="read-more">阅读全文 <i class="fas fa-arrow-right"></i></a>
            </div>
        `;

        articleCard.innerHTML = articleContent;
        return articleCard;
    },

    // 渲染单篇文章到文章详情页
    async renderArticle(id) {
        const article = await this.getArticleById(id);

        if (!article) {
            window.location.href = 'index.html';
            return;
        }

        // 设置文章内容
        const articleContainer = document.querySelector('.article-container');
        if (articleContainer) {
            const articleContent = `
                <article class="article">
                    <header class="article-header">
                        <h1 class="article-title">${article.title}</h1>
                        <div class="article-meta">
                            <span class="article-category">${article.category}</span>
                            <span class="article-date">${article.date}</span>
                        </div>
                    </header>
                    <div class="article-content">
                        ${marked.parse(article.content)}
                    </div>
                </article>
            `;
            articleContainer.innerHTML = articleContent;
            document.title = `${article.title} - Prophesyzx's Blog`;
        }
    },

    // 获取文章模板
    getArticleTemplate() {
        return `# 文章标题

## 引言
在这里写文章的引言部分...

## 正文
在这里写文章的正文部分...

## 结论
在这里写文章的结论部分...
`;
    }
};

// 页面加载时初始化文章数据
ArticleManager.init().catch(error => {
    console.error('初始化文章数据失败:', error);
});
