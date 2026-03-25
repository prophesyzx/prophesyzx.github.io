// 编辑文章页面脚本
let editor = null;

document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (articleId) {
        // 加载文章数据
        const article = ArticleManager.getArticleById(articleId);
        if (article) {
            // 填充表单
            document.getElementById('edit-article-title').value = article.title;
            document.getElementById('edit-article-category').value = article.category;
            document.getElementById('edit-article-excerpt').value = article.excerpt;

            // 初始化Markdown编辑器
            editor = MarkdownEditor.createEditor('edit-markdown-editor-container', article.content);
        } else {
            // 文章不存在，重定向到首页
            alert('文章不存在');
            window.location.href = 'index.html';
        }
    } else {
        // 如果没有提供文章ID，重定向到首页
        window.location.href = 'index.html';
    }

    // 绑定取消按钮事件
    document.getElementById('cancel-edit-article-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 绑定表单提交事件
    document.getElementById('edit-article-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const articleData = {
            id: articleId,
            title: document.getElementById('edit-article-title').value,
            date: article.date,
            category: document.getElementById('edit-article-category').value,
            excerpt: document.getElementById('edit-article-excerpt').value,
            content: editor.getContent()
        };

        // 更新文章
        ArticleManager.updateArticle(articleData);

        // 显示成功消息并重定向到首页
        alert('文章更新成功！');
        window.location.href = 'index.html';
    });

    // 添加Ctrl+S快捷键保存功能
    document.addEventListener('keydown', function(e) {
        // 检查是否按下了Ctrl+S或Cmd+S（Mac）
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault(); // 阻止浏览器默认的保存行为
            
            // 触发表单提交事件
            document.getElementById('edit-article-form').dispatchEvent(new Event('submit'));
        }
    });
});
