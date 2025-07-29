const aiModule = {
  ai: {
    get app() {
      return Alpine.store('app');
    },
    loading: true,
    err: null,
    list: [],
    active: [],
    async write() {
      const prompt = "Write basic nginx config for vue app. App directory is www/app. domain do-code.com"
      try {
        const res = await api.ai.write(prompt);
        cconsole.log(res)
      } catch (err) {
        console.log(err)
      }
    },
  }
}