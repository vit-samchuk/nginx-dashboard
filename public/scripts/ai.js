const aiModule = {
  ai: {
    get app() {
      return Alpine.store('app');
    },
    loading: false,
    err: null,
    list: [],
    active: [],
    modal: null,
    textarea: null,
    mode: null,
    init() {
      this.modal = document.getElementById('aiModal');
      this.textarea = document.getElementById('aiTextarea')
    },
    async write() {
      this.mode = 'write'
      this.textarea.value = ''
      this.modal.show()
      return;
      const prompt = "Write basic nginx config for vue app. App directory is www/app. domain do-code.com"
      this.loading = true;
      try {
        const res = await api.ai.write(prompt);
        const result = JSON.parse(res.result)
        if (result.config) {
          console.log(result.config)
          this.app.editor.item.setValue(result.config, 1)
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false;
      }
    },
    edit() {
      this.mode = 'edit'
      this.textarea.value = ''
      this.modal.show()
    },
    async format() {
      this.loading = true;
      const raw = this.app.editor.item.getValue();
      const cfg = raw.trim();

      if (cfg.length < 10) {
        alert("Seems you not entered a valid config yet...");
        this.loading = false;
        return;
      }
      try {
        const res = await api.ai.format(cfg);
        const result = JSON.parse(res.result)
        if (result.config) {
          this.app.editor.item.setValue(result.config, 1)
        } else {
          // todo: handle no config...
          
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.modal.hide();
    },
    send() {
      const prompt = this.textarea.value;
      alert(prompt);
    },
  }
}