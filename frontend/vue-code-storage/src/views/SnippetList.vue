<template>
  <div class="snippet-list">
    <div class="header">
      <h1>Code Snippets</h1>
      <router-link to="/snippets/new" class="btn btn-primary">New Snippet</router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="snippets.length === 0" class="empty">No snippets found</div>
    <div v-else class="snippets">
      <div v-for="snippet in snippets" :key="snippet._id" class="snippet-card">
        <div class="snippet-header">
          <router-link :to="`/snippets/${snippet._id}`" class="title-link">
            <h2>{{ snippet.title }}</h2>
          </router-link>
          <div class="actions">
            <router-link :to="`/snippets/${snippet._id}/edit`" class="btn btn-edit">Edit</router-link>
            <button @click="deleteSnippet(snippet._id)" class="btn btn-delete">Delete</button>
          </div>
        </div>
        <p class="description">{{ snippet.description }}</p>
        <div class="meta">
          <span class="language">{{ snippet.language }}</span>
          <div class="tags">
            <span v-for="tag in snippet.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <router-link :to="`/snippets/${snippet._id}`" class="code-preview">
          <pre class="code"><code>{{ snippet.code }}</code></pre>
          <div class="view-details">View Details →</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSnippetStore } from '../stores/snippet'
import { storeToRefs } from 'pinia'

const store = useSnippetStore()
const { snippets, loading, error } = storeToRefs(store)

onMounted(() => {
  store.fetchSnippets()
})

const deleteSnippet = async (id) => {
  if (confirm('Are you sure you want to delete this snippet?')) {
    await store.deleteSnippet(id)
  }
}
</script>

<style scoped>
.snippet-list {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}

.snippets {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

/* @media (max-width: 480px) {
  .snippets {
    grid-template-columns: 1fr;
  }
} */

.snippet-card {
  height: 100%;
  background: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.snippet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.snippet-header h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin: 0;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.language {
  background: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--background-color);
  color: var(--text-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.title-link {
  text-decoration: none;
}

.title-link h2 {
  color: var(--text-color);
  transition: color 0.2s ease;
}

.title-link:hover h2 {
  color: var(--primary-color);
}

.code-preview {
  display: block;
  text-decoration: none;
  position: relative;
  margin-top: auto;
}

.view-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, var(--background-color));
  color: var(--primary-color);
  font-weight: 500;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.code-preview:hover .view-details {
  opacity: 1;
}

.code-preview:hover .code::after {
  opacity: 0;
}

.code {
  background: var(--background-color);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  max-height: 200px;
  position: relative;
}

.code::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, var(--background-color));
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.loading {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.error {
  color: var(--danger-color);
}

/* @media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header .btn {
    width: 100%;
  }
} */

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-edit {
  background: #2196F3;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}
</style> 