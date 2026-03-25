// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 导航链接激活状态
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 平滑滚动
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// 表单提交处理
if (document.querySelector('.contact-form')) {
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // 简单验证
        if (!name || !email || !message) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 显示成功消息
        alert('感谢您的留言！我们会尽快回复。');
        
        // 重置表单
        this.reset();
    });
}

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

// 创建文章按钮事件
if (document.getElementById('create-article-btn')) {
    document.getElementById('create-article-btn').addEventListener('click', function() {
        ArticleManager.showCreateArticleModal();
    });
}

// 管理文章按钮事件
if (document.getElementById('manage-articles-btn')) {
    document.getElementById('manage-articles-btn').addEventListener('click', function() {
        window.location.href = 'manage.html';
    });
}

// 设置按钮点击事件
if (document.getElementById('settings-btn')) {
    document.getElementById('settings-btn').addEventListener('click', function() {
        window.location.href = 'settings.html';
    });
}

// 页面加载时渲染文章
window.addEventListener('load', function() {
    ArticleManager.renderArticles();
});
