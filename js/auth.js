// 用户认证管理
const Auth = {
    // 检查用户是否已登录
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // 登录
    login(username, password) {
        // 在实际应用中，这里应该调用后端API验证用户名和密码
        // 这里简化处理，使用硬编码的用户名和密码
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        return false;
    },
    
    // 登出
    logout() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    },
    
    // 显示登录表单
    showLoginForm() {
        const loginModal = document.createElement('div');
        loginModal.className = 'modal';
        loginModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>管理员登录</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">登录</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(loginModal);
        
        // 关闭模态框
        loginModal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(loginModal);
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                document.body.removeChild(loginModal);
            }
        });
        
        // 处理登录表单提交
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.login(username, password)) {
                document.body.removeChild(loginModal);
                this.showAdminPanel();
            } else {
                alert('用户名或密码错误');
            }
        });
    },
    
    // 显示管理员面板
    showAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h2>管理员面板</h2>
                <button id="logout-btn" class="btn btn-secondary">退出登录</button>
            </div>
            <div class="admin-content">
                <div class="admin-section">
                    <h3>文章管理</h3>
                    <button id="add-article-btn" class="btn btn-primary">添加新文章</button>
                    <div id="articles-list" class="articles-list"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
        
        // 退出登录
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        // 添加新文章
        document.getElementById('add-article-btn').addEventListener('click', () => {
            this.showArticleForm();
        });
        
        // 加载文章列表
        this.loadArticlesList();
    },
    
    // 加载文章列表
    loadArticlesList() {
        const articlesList = document.getElementById('articles-list');
        const articles = ArticleManager.getAllArticles();
        
        articlesList.innerHTML = '';
        
        articles.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.innerHTML = `
                <h4>${article.title}</h4>
                <p>${article.date} | ${article.category}</p>
                <div class="article-actions">
                    <button class="btn btn-secondary edit-article-btn" data-id="${article.id}">编辑</button>
                    <button class="btn btn-danger delete-article-btn" data-id="${article.id}">删除</button>
                </div>
            `;
            
            articlesList.appendChild(articleItem);
        });
        
        // 编辑文章
        document.querySelectorAll('.edit-article-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.getAttribute('data-id');
                this.showArticleForm(articleId);
            });
        });
        
        // 删除文章
        document.querySelectorAll('.delete-article-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.getAttribute('data-id');
                if (confirm('确定要删除这篇文章吗？')) {
                    ArticleManager.deleteArticle(articleId);
                    this.loadArticlesList();
                }
            });
        });
    },
    
    // 显示文章表单
    showArticleForm(articleId = null) {
        const articleForm = document.createElement('div');
        articleForm.className = 'modal';
        
        let article = null;
        if (articleId) {
            article = ArticleManager.getArticleById(articleId);
        }
        
        articleForm.innerHTML = `
            <div class="modal-content article-form-content">
                <span class="close">&times;</span>
                <h2>${articleId ? '编辑文章' : '添加新文章'}</h2>
                <form id="article-form">
                    <div class="form-group">
                        <label for="article-title">标题</label>
                        <input type="text" id="article-title" required value="${article ? article.title : ''}">
                    </div>
                    <div class="form-group">
                        <label for="article-date">日期</label>
                        <input type="date" id="article-date" required value="${article ? article.date : ''}">
                    </div>
                    <div class="form-group">
                        <label for="article-category">分类</label>
                        <select id="article-category" required>
                            <option value="数据分析" ${article && article.category === '数据分析' ? 'selected' : ''}>数据分析</option>
                            <option value="编程技巧" ${article && article.category === '编程技巧' ? 'selected' : ''}>编程技巧</option>
                            <option value="Web开发" ${article && article.category === 'Web开发' ? 'selected' : ''}>Web开发</option>
                            <option value="技术分享" ${article && article.category === '技术分享' ? 'selected' : ''}>技术分享</option>
                            <option value="学习笔记" ${article && article.category === '学习笔记' ? 'selected' : ''}>学习笔记</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="article-excerpt">摘要</label>
                        <textarea id="article-excerpt" rows="3" required>${article ? article.excerpt : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="article-content">内容</label>
                        <textarea id="article-content" rows="10" required>${article ? article.content : ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">${articleId ? '保存修改' : '发布文章'}</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(articleForm);
        
        // 关闭模态框
        articleForm.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(articleForm);
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === articleForm) {
                document.body.removeChild(articleForm);
            }
        });
        
        // 处理文章表单提交
        document.getElementById('article-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const articleData = {
                id: articleId || Date.now().toString(),
                title: document.getElementById('article-title').value,
                date: document.getElementById('article-date').value,
                category: document.getElementById('article-category').value,
                excerpt: document.getElementById('article-excerpt').value,
                content: document.getElementById('article-content').value
            };
            
            if (articleId) {
                ArticleManager.updateArticle(articleData);
            } else {
                ArticleManager.addArticle(articleData);
            }
            
            document.body.removeChild(articleForm);
            this.loadArticlesList();
        });
    }
};

// 初始化
if (Auth.isLoggedIn()) {
    Auth.showAdminPanel();
}
