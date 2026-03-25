// 文章管理页面脚本
const ManageArticles = {
    // 当前页码
    currentPage: 1,
    
    // 每页显示的文章数量
    articlesPerPage: 10,
    
    // 当前筛选和排序条件
    filters: {
        search: '',
        category: '',
        sortBy: 'date-desc'
    },
    
    // 初始化
    init() {
        this.bindEvents();
        this.renderArticles();
    },
    
    // 绑定事件
    bindEvents() {
        // 搜索框事件
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.currentPage = 1;
            this.renderArticles();
        });
        
        // 分类筛选事件
        document.getElementById('filter-category').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.currentPage = 1;
            this.renderArticles();
        });
        
        // 排序事件
        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.renderArticles();
        });
        
        // 全选事件
        document.getElementById('select-all').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.article-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
        
        // 创建文章按钮事件
        document.getElementById('create-article-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
            setTimeout(() => {
                ArticleManager.showCreateArticleModal();
            }, 500);
        });
    },
    
    // 获取筛选后的文章
    getFilteredArticles() {
        let articles = ArticleManager.getAllArticles();
        
        // 搜索过滤
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            articles = articles.filter(article => 
                article.title.toLowerCase().includes(searchTerm) ||
                article.excerpt.toLowerCase().includes(searchTerm)
            );
        }
        
        // 分类过滤
        if (this.filters.category) {
            articles = articles.filter(article => article.category === this.filters.category);
        }
        
        // 排序
        articles = [...articles].sort((a, b) => {
            switch (this.filters.sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
        
        return articles;
    },
    
    // 渲染文章列表
    renderArticles() {
        const articles = this.getFilteredArticles();
        const tableBody = document.getElementById('articles-table-body');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // 如果没有文章，显示空状态
        if (articles.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <p>没有找到符合条件的文章</p>
                    </td>
                </tr>
            `;
            document.getElementById('pagination-container').innerHTML = '';
            return;
        }
        
        // 计算分页
        const totalPages = Math.ceil(articles.length / this.articlesPerPage);
        
        // 确保页码在有效范围内
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        
        // 计算当前页的文章范围
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const currentPageArticles = articles.slice(startIndex, endIndex);
        
        // 渲染文章列表
        currentPageArticles.forEach(article => {
            const row = document.createElement('tr');
            
            // 状态标签
            let statusClass = 'published';
            let statusText = '已发布';
            if (article.isPinned) {
                statusClass = 'pinned';
                statusText = '已置顶';
            }
            
            row.innerHTML = `
                <td class="checkbox-column">
                    <input type="checkbox" class="article-checkbox" data-id="${article.id}">
                </td>
                <td class="title-column">
                    <a href="article.html?id=${article.id}" class="article-title-link">${article.title}</a>
                </td>
                <td class="date-column">${article.date}</td>
                <td class="category-column">${article.category}</td>
                <td class="status-column">
                    <span class="article-status ${statusClass}">${statusText}</span>
                </td>
                <td class="actions-column">
                    <div class="article-actions">
                        <button class="btn-edit" data-id="${article.id}" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-pin" data-id="${article.id}" title="${article.isPinned ? '取消置顶' : '置顶'}">
                            <i class="fas fa-thumbtack"></i>
                        </button>
                        <button class="btn-delete" data-id="${article.id}" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // 渲染分页控件
        this.renderPagination(totalPages);
        
        // 绑定操作按钮事件
        this.bindActionEvents();
    },
    
    // 绑定操作按钮事件
    bindActionEvents() {
        // 编辑按钮
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.dataset.id;
                window.location.href = `article.html?id=${articleId}`;
                setTimeout(() => {
                    ArticleManager.showEditArticleModal(articleId);
                }, 500);
            });
        });
        
        // 置顶按钮
        document.querySelectorAll('.btn-pin').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.dataset.id;
                ArticleManager.togglePinArticle(articleId);
                this.renderArticles();
            });
        });
        
        // 删除按钮
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.dataset.id;
                if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
                    ArticleManager.deleteArticle(articleId);
                    this.renderArticles();
                }
            });
        });
    },
    
    // 渲染分页控件
    renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination-container');
        
        if (!paginationContainer) return;
        
        // 如果只有一页，不显示分页控件
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination">';
        
        // 上一页按钮
        paginationHTML += `<button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" data-page="${this.currentPage - 1}">上一页</button>`;
        
        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            // 只显示当前页附近的页码
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // 下一页按钮
        paginationHTML += `<button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" data-page="${this.currentPage + 1}">下一页</button>`;
        
        paginationHTML += '</div>';
        
        paginationContainer.innerHTML = paginationHTML;
        
        // 添加分页按钮点击事件
        paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (!btn.classList.contains('disabled')) {
                    this.currentPage = page;
                    this.renderArticles();
                    // 滚动到表格顶部
                    document.querySelector('.manage-header').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ManageArticles.init();
});