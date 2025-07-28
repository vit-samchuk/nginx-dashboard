const snippetsModule = {
  snippets: {
    get app() {
      return Alpine.store('app');
    },
    loading: true,
    err: null,
    list: [],
    active: [],
    async load() {
      try {
        this.loading = true;
        const data = await api.snippets.list();
        this.list = data.list || []
        this.list = [...this.list, ...this.mock()]
        this.err = false;
      } catch (err) {
        this.list = []
        this.err = true;
        errorToast(err)
      } finally {
        this.loading = false;
      }
    },
    mock() {
      return [
      {
        id: 101,
        name: "test1",
        content: "Test snippet content for dev"
      },
      {
        id: 102,
        name: "SSL redirect",
        content: `if ($scheme != "https") {
  return 301 https://$host$request_uri;
}`
      },
      {
        id: 103,
        name: "Static cache control",
        content: `location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 30d;
  access_log off;
}`
      },
      {
        id: 104,
        name: "Basic auth protection for admin",
        content: `location /admin {
  auth_basic "Restricted";
  auth_basic_user_file /etc/nginx/.htpasswd;
}`
      },
      {
        id: 105,
        name: "Proxy to Node.js backend",
        content: `location /api {
  proxy_pass http://localhost:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}`
      }];
    },
    
    add() {
      this.app.editor.mode = 'snippet';
      this.app.editor.show()
    },
    click(id) {
      this.active.includes(id) ?
        this.active.splice(this.active.indexOf(id), 1) :
        this.active.push(id);
    },
    edit(snippet) {
      this.app.editor.snippet = snippet;
      this.app.editor.mode = 'snippet';
      this.app.editor.item.setValue(snippet.content, 1);
      this.app.editor.name = snippet.name;
      this.app.editor.show()
    },
    async save() {
      const content = this.app.editor.item.getValue()
      const edit = !!this.app.editor.snippet;
      
      if (!edit && !this.app.editor.name.length) {
        return errorToast('Snippet name not specified!')
      }
      
      const snippet = edit ? this.app.editor.snippet.id : this.app.editor.name;
      try {
        const res = await (edit ?
          api.snippets.update(snippet, this.app.editor.snippet.name, content) :
          api.snippets.create(snippet, content)
        )
        
        if (!res.snippet) return errorToast('Unknown error while creating anippet...')
        
        toast('Snippet saved!', 'success')
        
        this.list = [
          ...this.list.filter(s => s.id !== res.snippet.id),
          res.snipped
        ];
        this.app.editor.hide()
      } catch (err) {
        errorToast(err)
      }
    },
    async delete(snippet) {
      try {
        await api.snippets.delete(snippet.id);
        this.list = this.list.filter(s => s.id !== snippet.id);
        this.active = this.active.filter(s => s.id !== snippet.id);
      } catch (err) {
        errorToast(err)
      }
    }
  },
};