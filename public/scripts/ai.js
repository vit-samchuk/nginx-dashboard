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
    write() {
      this.mode = 'write'
      this.textarea.value = ''
      this.modal.show()
    },
    edit() {
      this.mode = 'edit'
      this.textarea.value = ''
      this.modal.show()
    },
    cancel() {
      this.modal.hide();
    },
    send() {
      const prompt = this.textarea.value;
      if (this.mode === 'write') {
        this.sendWrite(prompt)
      } else if (this.mode === 'edit') {
        const raw = this.app.editor.item.getValue();
        const cfg = raw.trim();
        
        this.sendEdit(prompt, cfg)
      }
    },
    async format() {
      this.loading = true;
      const raw = this.app.editor.item.getValue();
      const cfg = raw.trim();
      
      if (!this.checkCfg(cfg)) return;
      
      try {
        const res = await api.ai.format(cfg);
        const result = JSON.parse(res.result);
        this.handleResult(result);
      } catch (err) {
        errorToast(err)
        console.log(err)
      } finally {
        this.loading = false;
      }
    },
    async sendWrite(prompt) {
      this.loading = true;
      try {
        const res = await api.ai.write(prompt);
        const result = JSON.parse(res.result)
        this.handleResult(result);
      } catch (err) {
        errorToast(err)
        console.log(err)
      } finally {
        this.loading = false;
      }
    },
    async sendEdit(prompt, cfg) {
      this.loading = true;
      
      if (!this.checkCfg(cfg)) return;
      
      try {
        const res = await api.ai.edit(cfg, prompt);
        const result = JSON.parse(res.result)
        this.handleResult(result);
      } catch (err) {
        errorToast(err)
        console.log(err)
      } finally {
        this.loading = false;
      }
    },
    checkCfg(cfg) {
      if (cfg.length < 10) {
        alert("Seems you not entered a valid config yet...");
        this.loading = false;
        return false;
      }
      return true;
    },
    handleResult(res) {
      if (res.config) {
          this.app.editor.item.setValue(result.config, 1)
        } else {
          errorToast("Something went wrong. Try again later...")
        }
    }
  }
}