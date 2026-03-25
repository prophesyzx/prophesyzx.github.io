// 设置页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const githubTokenInput = document.getElementById('github-token');
    const saveTokenBtn = document.getElementById('save-token-btn');
    const clearTokenBtn = document.getElementById('clear-token-btn');
    const testTokenBtn = document.getElementById('test-token-btn');
    const tokenStatus = document.getElementById('token-status');
    const alertElement = document.getElementById('alert');

    // 初始化令牌状态
    updateTokenStatus();

    // 如果已有令牌，填充到输入框
    if (GitHubAPI.hasToken()) {
        githubTokenInput.value = GitHubAPI.getToken();
    }

    // 保存令牌按钮点击事件
    saveTokenBtn.addEventListener('click', function() {
        const token = githubTokenInput.value.trim();

        if (!token) {
            showAlert('请输入GitHub访问令牌', 'error');
            return;
        }

        // 保存令牌
        GitHubAPI.setToken(token);
        updateTokenStatus();
        showAlert('GitHub访问令牌已保存', 'success');
    });

    // 清除令牌按钮点击事件
    clearTokenBtn.addEventListener('click', function() {
        if (confirm('确定要清除GitHub访问令牌吗？清除后您将无法访问GitHub仓库。')) {
            GitHubAPI.clearToken();
            githubTokenInput.value = '';
            updateTokenStatus();
            showAlert('GitHub访问令牌已清除', 'success');
        }
    });

    // 测试令牌按钮点击事件
    testTokenBtn.addEventListener('click', async function() {
        const token = githubTokenInput.value.trim();

        if (!token) {
            showAlert('请输入GitHub访问令牌', 'error');
            return;
        }

        // 临时设置令牌进行测试
        const originalToken = GitHubAPI.getToken();
        GitHubAPI.setToken(token);

        try {
            // 尝试获取文章数据以测试令牌
            await GitHubAPI.getAllArticles();
            showAlert('GitHub访问令牌有效', 'success');

            // 如果测试成功，保存令牌
            GitHubAPI.setToken(token);
            updateTokenStatus();
        } catch (error) {
            console.error('测试令牌失败:', error);
            showAlert('GitHub访问令牌无效或权限不足: ' + error.message, 'error');

            // 恢复原始令牌
            GitHubAPI.setToken(originalToken);
        }
    });

    // 更新令牌状态显示
    function updateTokenStatus() {
        if (GitHubAPI.hasToken()) {
            tokenStatus.textContent = '已设置';
            tokenStatus.className = 'token-status valid';
        } else {
            tokenStatus.textContent = '未设置';
            tokenStatus.className = 'token-status invalid';
        }
    }

    // 显示提示信息
    function showAlert(message, type) {
        alertElement.textContent = message;
        alertElement.className = 'alert alert-' + type;
        alertElement.style.display = 'block';

        // 3秒后自动隐藏提示信息
        setTimeout(function() {
            alertElement.style.display = 'none';
        }, 3000);
    }
});
