const aiModule = {
  ai: {
    get app() {
      return Alpine.store('app');
    },
    loading: false,
    err: null,
    list: [],
    active: [],
    async write() {
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
  }
}