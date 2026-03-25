// GitHub API管理模块
const GitHubAPI = {
    // 配置信息
    config: {
        owner: 'prophesyzx', // 仓库所有者
        repo: 'prophesyzx.github.io', // 仓库名称
        branch: 'main', // 分支名称
        dataPath: 'data/articles.json', // 文章数据存储路径
        token: localStorage.getItem('github_token') || '' // GitHub访问令牌
    },

    // 设置GitHub访问令牌
    setToken(token) {
        this.config.token = token;
        localStorage.setItem('github_token', token);
    },

    // 获取GitHub访问令牌
    getToken() {
        return this.config.token;
    },

    // 清除GitHub访问令牌
    clearToken() {
        this.config.token = '';
        localStorage.removeItem('github_token');
    },

    // 检查是否已设置令牌
    hasToken() {
        return !!this.config.token;
    },

    // 获取文件内容
    async getFile(path) {
        const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${this.config.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`获取文件失败: ${response.statusText}`);
            }

            const data = await response.json();

            // 解码base64内容
            const content = atob(data.content);

            return {
                content: content,
                sha: data.sha
            };
        } catch (error) {
            console.error('获取文件失败:', error);
            throw error;
        }
    },

    // 更新文件内容
    async updateFile(path, content, sha, message) {
        const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${this.config.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    content: btoa(unescape(encodeURIComponent(content))),
                    sha: sha,
                    branch: this.config.branch
                })
            });

            if (!response.ok) {
                throw new Error(`更新文件失败: ${response.statusText}`);
            }

            const data = await response.json();
            return data.content.sha;
        } catch (error) {
            console.error('更新文件失败:', error);
            throw error;
        }
    },

    // 保存数据到本地文件
    async saveToLocalFile(data) {
        // 注意：由于浏览器安全限制，直接写入本地文件需要服务器支持
        // 这里我们使用localStorage作为本地存储的后备方案
        localStorage.setItem('articles', JSON.stringify(data));
        console.log('数据已保存到localStorage');
        
        // 如果需要真正的文件写入功能，需要后端API支持
        // 例如：
        // const response = await fetch('data/articles.json', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });
        // if (!response.ok) throw new Error('保存文件失败');
    },

    // 获取所有文章
    async getAllArticles() {
        // 优先尝试从GitHub获取文章数据
        try {
            const response = await fetch(this.config.dataPath);
            if (response.ok) {
                const data = await response.json();
                console.log('从本地文件加载文章:', data);
                return data;
            }
        } catch (error) {
            console.log('无法从本地文件读取文章，尝试从GitHub获取:', error);
        }
        
        // 如果本地文件不存在或读取失败，尝试从GitHub获取
        try {
            const fileData = await this.getFile(this.config.dataPath);
            return JSON.parse(fileData.content);
        } catch (error) {
            console.error('获取文章失败:', error);
            // 如果文件不存在，返回空数组
            if (error.message.includes('Not Found')) {
                return [];
            }
            throw error;
        }
    },

    // 更新所有文章
    async updateAllArticles(articles, message = '更新文章数据') {
        try {
            // 先获取当前文件的SHA
            let sha;
            try {
                const fileData = await this.getFile(this.config.dataPath);
                sha = fileData.sha;
            } catch (error) {
                // 如果文件不存在，SHA为null
                if (error.message.includes('Not Found')) {
                    sha = null;
                } else {
                    throw error;
                }
            }

            // 更新文件
            const content = JSON.stringify(articles, null, 2);
            await this.updateFile(this.config.dataPath, content, sha, message);

            return true;
        } catch (error) {
            console.error('更新文章失败:', error);
            throw error;
        }
    },

    // 添加文章
    async addArticle(article) {
        try {
            const articles = await this.getAllArticles();
            articles.unshift(article); // 将新文章添加到开头
            
            // 尝试保存到本地文件
            try {
                await this.saveToLocalFile(articles);
                console.log('文章已保存到本地文件');
            } catch (error) {
                console.log('无法保存到本地文件，尝试保存到GitHub:', error);
            }
            
            // 如果配置了token，尝试保存到GitHub
            if (this.hasToken()) {
                try {
                    await this.updateAllArticles(articles, `添加新文章: ${article.title}`);
                    console.log('文章已同步到GitHub');
                } catch (error) {
                    console.log('无法同步到GitHub，但文章已保存到本地:', error);
                }
            }
            
            return article;
        } catch (error) {
            console.error('添加文章失败:', error);
            throw error;
        }
    },

    // 更新文章
    async updateArticle(updatedArticle) {
        try {
            const articles = await this.getAllArticles();
            const index = articles.findIndex(article => article.id === updatedArticle.id);

            if (index !== -1) {
                articles[index] = updatedArticle;
                
                // 尝试保存到本地文件
                try {
                    await this.saveToLocalFile(articles);
                    console.log('文章已保存到本地文件');
                } catch (error) {
                    console.log('无法保存到本地文件，尝试保存到GitHub:', error);
                }
                
                // 如果配置了token，尝试保存到GitHub
                if (this.hasToken()) {
                    try {
                        await this.updateAllArticles(articles, `更新文章: ${updatedArticle.title}`);
                        console.log('文章已同步到GitHub');
                    } catch (error) {
                        console.log('无法同步到GitHub，但文章已保存到本地:', error);
                    }
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
            const articles = await this.getAllArticles();
            const article = articles.find(a => a.id === id);
            const filteredArticles = articles.filter(article => article.id !== id);
            
            // 尝试保存到本地文件
            try {
                await this.saveToLocalFile(filteredArticles);
                console.log('文章已保存到本地文件');
            } catch (error) {
                console.log('无法保存到本地文件，尝试保存到GitHub:', error);
            }
            
            // 如果配置了token，尝试保存到GitHub
            if (this.hasToken()) {
                try {
                    await this.updateAllArticles(filteredArticles, `删除文章: ${article ? article.title : id}`);
                    console.log('文章已同步到GitHub');
                } catch (error) {
                    console.log('无法同步到GitHub，但文章已保存到本地:', error);
                }
            }
            
            return true;
        } catch (error) {
            console.error('删除文章失败:', error);
            throw error;
        }
    },

    // 切换文章置顶状态
    async togglePinArticle(id) {
        try {
            const articles = await this.getAllArticles();
            const article = articles.find(article => article.id === id);

            if (article) {
                article.isPinned = !article.isPinned;
                
                // 尝试保存到本地文件
                try {
                    await this.saveToLocalFile(articles);
                    console.log('文章已保存到本地文件');
                } catch (error) {
                    console.log('无法保存到本地文件，尝试保存到GitHub:', error);
                }
                
                // 如果配置了token，尝试保存到GitHub
                if (this.hasToken()) {
                    try {
                        await this.updateAllArticles(articles, `${article.isPinned ? '置顶' : '取消置顶'}文章: ${article.title}`);
                        console.log('文章已同步到GitHub');
                    } catch (error) {
                        console.log('无法同步到GitHub，但文章已保存到本地:', error);
                    }
                }
                
                return article;
            }

            return null;
        } catch (error) {
            console.error('切换文章置顶状态失败:', error);
            throw error;
        }
    }
};
