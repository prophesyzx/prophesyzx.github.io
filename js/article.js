// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 创建悬浮目录
function createTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    // 获取所有标题
    const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) return;

    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    
    // 创建目录标题
    const tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = '文章目录';
    tocContainer.appendChild(tocTitle);

    // 创建目录列表
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    // 为每个标题添加目录项
    headings.forEach((heading, index) => {
        // 为标题添加ID（如果没有）
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        // 创建目录项
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        // 创建目录链接
        const tocLink = document.createElement('a');
        tocLink.href = `#${heading.id}`;
        tocLink.textContent = heading.textContent;
        tocLink.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
        
        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });

    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);

    // 监听滚动事件，高亮当前章节
    window.addEventListener('scroll', () => {
        let currentHeading = '';
        
        headings.forEach(heading => {
            const headingTop = heading.offsetTop;
            if (window.scrollY >= headingTop - 100) {
                currentHeading = heading.id;
            }
        });
        
        // 移除所有活动状态
        document.querySelectorAll('.toc-item a').forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加当前活动状态
        const activeLink = document.querySelector(`.toc-item a[href="#${currentHeading}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取文章ID
    const articleId = getUrlParameter('id');
    
    if (articleId) {
        // 渲染文章
        ArticleManager.renderArticle(articleId);
        
        // 创建悬浮目录
        setTimeout(() => {
            createTableOfContents();
        }, 500);
        
        // 添加操作按钮
        const articleContainer = document.querySelector('.article-container');
        if (articleContainer) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'article-actions';
            
            // 编辑按钮
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-edit-article';
            editButton.textContent = '编辑文章';
            editButton.addEventListener('click', function() {
                window.open('edit-article.html?id=' + articleId, '_blank');
            });
            
            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-delete-article';
            deleteButton.textContent = '删除文章';
            deleteButton.addEventListener('click', function() {
                if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
                    ArticleManager.deleteArticle(articleId);
                    window.location.href = 'index.html';
                }
            });
            
            // 置顶按钮
            const pinButton = document.createElement('button');
            pinButton.className = 'btn btn-pin-article';
            const article = ArticleManager.getArticleById(articleId);
            pinButton.textContent = article.isPinned ? '取消置顶' : '置顶文章';
            pinButton.addEventListener('click', function() {
                ArticleManager.togglePinArticle(articleId);
                pinButton.textContent = ArticleManager.getArticleById(articleId).isPinned ? '取消置顶' : '置顶文章';
            });
            
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(pinButton);
            articleContainer.appendChild(buttonContainer);
        }
    } else {
        // 如果没有提供文章ID，重定向到首页
        window.location.href = 'index.html';
    }
    
    // 滚动到顶部按钮事件
    document.getElementById('scroll-to-top').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动到底部按钮事件
    document.getElementById('scroll-to-bottom').addEventListener('click', function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
});
