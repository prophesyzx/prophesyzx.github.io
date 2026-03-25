// 编辑文章页面脚本
let editor = null;

document.addEventListener('DOMContentLoaded', async function() {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const isEditMode = !!articleId; // 是否为编辑模式

    // 更新页面标题
    document.querySelector('.edit-article-container h2').textContent = isEditMode ? '编辑文章' : '创建新文章';
    document.title = isEditMode ? '编辑文章 - Prophesyzx\'s Blog' : '创建新文章 - Prophesyzx\'s Blog';

    if (isEditMode) {
        // 加载文章数据
        const article = await ArticleManager.getArticleById(articleId);
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
        // 创建新文章模式
        // 初始化Markdown编辑器，使用文章模板
        editor = MarkdownEditor.createEditor('edit-markdown-editor-container', ArticleManager.getArticleTemplate());
    }

    // 绑定取消按钮事件
    document.getElementById('cancel-edit-article-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 绑定表单提交事件
    document.getElementById('edit-article-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('表单提交事件触发');
        console.log('是否为编辑模式:', isEditMode);

        if (isEditMode) {
            // 编辑模式：更新现有文章
            const article = await ArticleManager.getArticleById(articleId);
            const articleData = {
                id: articleId,
                title: document.getElementById('edit-article-title').value,
                date: article.date,
                category: document.getElementById('edit-article-category').value,
                excerpt: document.getElementById('edit-article-excerpt').value,
                content: editor.getContent()
            };

            // 更新文章
            console.log('准备更新文章:', articleData);
            await ArticleManager.updateArticle(articleData);
            console.log('文章更新成功');

            // 显示成功消息
            alert('文章更新成功！');
            
            // 通知父页面刷新
            if (window.opener) {
                window.opener.postMessage({ action: 'refreshArticles' }, '*');
            }
            
            // 关闭当前窗口
            window.close();
        } else {
            // 创建模式：创建新文章
            const articleData = {
                id: Date.now().toString(),
                title: document.getElementById('edit-article-title').value,
                date: new Date().toISOString().split('T')[0],
                category: document.getElementById('edit-article-category').value,
                excerpt: document.getElementById('edit-article-excerpt').value,
                content: editor.getContent()
            };

            // 添加文章
            console.log('准备创建文章:', articleData);
            await ArticleManager.addArticle(articleData);
            console.log('文章创建成功');

            // 显示成功消息
            alert('文章创建成功！');
            
            // 通知父页面刷新
            if (window.opener) {
                window.opener.postMessage({ action: 'refreshArticles' }, '*');
            }
            
            // 关闭当前窗口
            window.close();
        }
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
