const { eq } = require('drizzle-orm');
const db = require('../db/db');
const { snippets } = require('../db/schema');

const getSnippetById = (id) => {
  const snippet = db.select().from(snippets).where(eq(snippets.id, id)).get();
  if (!snippet) {
    const err = new Error('Snippet not found');
    err.status = 404;
    throw err;
  }
  return snippet;
}

const getAllSnippets = () => {
  return db.select().from(snippets).all();
}

const createSnippet = (name, content) => {
  const res = db.insert(snippets).values({
    name,
    content,
  }).run();

  return { snippet: getSnippetById(res.lastInsertRowid) };
}

const updateSnippet = (id, { name, content }) => {
  getSnippetById(id);
  
  db.update(snippets)
    .set({ name, content })
    .where(eq(snippets.id, id))
    .run();

  return { snippet: getSnippetById(id) };
}

const deleteSnippet = (id) => {
  getSnippetById(id);

  db.delete(snippets)
    .where(eq(snippets.id, id))
    .run();

  return { success: true };
}

module.exports = {
  getSnippetById,
  getAllSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet
};
