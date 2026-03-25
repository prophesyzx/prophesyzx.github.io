// Markdown编辑器模块
const MarkdownEditor = {
    // 初始化编辑器
    init() {
        // 检查是否需要加载marked库
        if (typeof marked === 'undefined') {
            this.loadMarkedLibrary();
        }
    },
    
    // 加载marked库
    loadMarkedLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => {
            console.log('Marked库加载成功');
        };
        document.head.appendChild(script);
    },
    
    // 创建编辑器
    createEditor(containerId, initialContent = '') {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        container.innerHTML = `
            <div class="markdown-editor">
                <div class="editor-toolbar">
                    <button class="toolbar-btn" data-command="bold"><i class="fas fa-bold"></i></button>
                    <button class="toolbar-btn" data-command="italic"><i class="fas fa-italic"></i></button>
                    <button class="toolbar-btn" data-command="heading"><i class="fas fa-heading"></i></button>
                    <button class="toolbar-btn" data-command="quote"><i class="fas fa-quote-right"></i></button>
                    <button class="toolbar-btn" data-command="code"><i class="fas fa-code"></i></button>
                    <button class="toolbar-btn" data-command="link"><i class="fas fa-link"></i></button>
                    <button class="toolbar-btn" data-command="image"><i class="fas fa-image"></i></button>
                    <button class="toolbar-btn" data-command="list"><i class="fas fa-list"></i></button>
                    <button class="toolbar-btn" data-command="numbered-list"><i class="fas fa-list-ol"></i></button>
                    <div class="editor-mode-toggle">
                        <button class="mode-btn active" data-mode="edit">编辑</button>
                        <button class="mode-btn" data-mode="preview">预览</button>
                        <button class="mode-btn" data-mode="split">分屏</button>
                    </div>
                </div>
                <div class="editor-container split-mode">
                    <div class="editor-pane editor-textarea">
                        <textarea class="markdown-textarea" placeholder="在此输入Markdown内容...">${initialContent}</textarea>
                    </div>
                    <div class="editor-pane editor-preview">
                        <div class="markdown-preview"></div>
                    </div>
                </div>
            </div>
        `;
        
        // 绑定工具栏按钮事件
        container.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.executeCommand(btn.dataset.command);
            });
        });
        
        // 绑定模式切换按钮事件
        container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchMode(btn.dataset.mode);
            });
        });
        
        // 绑定文本区域输入事件
        const textarea = container.querySelector('.markdown-textarea');
        textarea.addEventListener('input', () => {
            this.updatePreview();
        });
        
        // 初始更新预览
        this.updatePreview();
        
        return {
            getContent: () => textarea.value,
            setContent: (content) => {
                textarea.value = content;
                this.updatePreview();
            }
        };
    },
    
    // 执行工具栏命令
    executeCommand(command) {
        const textarea = document.querySelector('.markdown-textarea');
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        
        let replacement = '';
        let cursorOffset = 0;
        
        switch (command) {
            case 'bold':
                replacement = `**${selectedText || '粗体文本'}**`;
                cursorOffset = selectedText ? 0 : -2;
                break;
            case 'italic':
                replacement = `*${selectedText || '斜体文本'}*`;
                cursorOffset = selectedText ? 0 : -1;
                break;
            case 'heading':
                replacement = `## ${selectedText || '标题'}\n`;
                cursorOffset = -1;
                break;
            case 'quote':
                replacement = `> ${selectedText || '引用文本'}\n`;
                cursorOffset = -1;
                break;
            case 'code':
                replacement = `\`\`\`\n${selectedText || '代码块'}\n\`\`\`\n`;
                cursorOffset = -4;
                break;
            case 'link':
                replacement = `[${selectedText || '链接文本'}](url)`;
                cursorOffset = -1;
                break;
            case 'image':
                replacement = `![${selectedText || '图片描述'}](image_url)`;
                cursorOffset = -1;
                break;
            case 'list':
                replacement = `- ${selectedText || '列表项'}\n`;
                cursorOffset = -1;
                break;
            case 'numbered-list':
                replacement = `1. ${selectedText || '列表项'}\n`;
                cursorOffset = -1;
                break;
        }
        
        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        textarea.focus();
        
        // 设置光标位置
        const newPosition = start + replacement.length + cursorOffset;
        textarea.setSelectionRange(newPosition, newPosition);
        
        // 更新预览
        this.updatePreview();
    },
    
    // 切换编辑器模式
    switchMode(mode) {
        const editorContainer = document.querySelector('.editor-container');
        const modeButtons = document.querySelectorAll('.mode-btn');
        
        // 更新按钮状态
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // 更新模式
        editorContainer.classList.remove('edit-mode', 'preview-mode', 'split-mode');
        editorContainer.classList.add(`${mode}-mode`);
    },
    
    // 更新预览
    updatePreview() {
        const textarea = document.querySelector('.markdown-textarea');
        const preview = document.querySelector('.markdown-preview');
        
        if (!textarea || !preview) return;
        
        try {
            if (typeof marked !== 'undefined') {
                preview.innerHTML = marked.parse(textarea.value);
            } else {
                preview.innerHTML = `<p>Marked库尚未加载，请稍候...</p>`;
            }
        } catch (error) {
            console.error('Markdown解析错误:', error);
            preview.innerHTML = `<p>Markdown解析错误: ${error.message}</p>`;
        }
    }
};

// 初始化Markdown编辑器
MarkdownEditor.init();
