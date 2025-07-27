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
        this.err = false;
      } catch (err) {
        this.list = []
        this.err = true;
        //errorToast(err)
      } finally {
        this.loading = false;
      }
    },
    add() {
      this.app.editor.mode = 'snippet';
      this.app.editor.show()
    },
    click(id) {
      alert(id)
    },
    edit(snippet) {
      console.log('edit', snippet)
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
        this.editor.hide()
      } catch (err) {
        errorToast(err)
      }
    },
    delete(snippet) {
      consolw.log('delete', snippet)
    }
  },
};