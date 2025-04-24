<template>
  <div class="snippet-form">
    <h1>{{ isEdit ? 'Edit Snippet' : 'New Snippet' }}</h1>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          required
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="language">Language</label>
        <input
          type="text"
          id="language"
          v-model="form.language"
          required
        >
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          v-model="tagsInput"
          placeholder="e.g. javascript, vue, frontend"
        >
      </div>

      <div class="form-group">
        <label for="code">Code</label>
        <div class="code-editor-container">
          <textarea
            id="code"
            v-model="form.code"
            required
            class="code-editor"
            @input="updatePreview"
          ></textarea>
          <div class="code-preview">
            <h3>Preview</h3>
            <pre v-highlight><code :class="form.language.toLowerCase()">{{ form.code }}</code></pre>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <router-link to="/" class="btn btn-cancel">Cancel</router-link>
        <button type="submit" class="btn btn-submit" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnippetStore } from '../stores/snippet'

const route = useRoute()
const router = useRouter()
const store = useSnippetStore()

const isEdit = computed(() => route.params.id)
const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  language: '',
  code: '',
  tags: []
})

const tagsInput = ref('')

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchSnippet(route.params.id)
    const snippet = store.currentSnippet
    if (snippet) {
      form.value = {
        title: snippet.title,
        description: snippet.description,
        language: snippet.language,
        code: snippet.code,
        tags: snippet.tags
      }
      tagsInput.value = snippet.tags.join(', ')
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const snippetData = {
      ...form.value,
      tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    if (isEdit.value) {
      await store.updateSnippet(route.params.id, snippetData)
    } else {
      await store.createSnippet(snippetData)
    }
    router.push('/')
  } catch (error) {
    console.error('Error saving snippet:', error)
  } finally {
    loading.value = false
  }
}

const updatePreview = () => {
  // 触发代码高亮更新
  const event = new Event('highlight')
  document.dispatchEvent(event)
}
</script>

<style scoped>
.snippet-form {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.snippet-form h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.95rem;
}

.code-editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 0.5rem;
  min-height: calc(100vh - 400px);
}

@media (max-width: 768px) {
  .code-editor-container {
    grid-template-columns: 1fr;
    min-height: 400px;
  }
}

.code-editor {
  font-family: 'Fira Code', monospace;
  height: 100%;
  min-height: 400px;
  padding: 1rem;
  line-height: 1.5;
  font-size: 0.9rem;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
}

.code-preview {
  background: var(--card-background);
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: var(--shadow);
  height: 100%;
  overflow: auto;
}

.code-preview h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
  position: sticky;
  top: 0;
  background: var(--card-background);
  padding: 0.5rem 0;
  z-index: 1;
}

.code-preview pre {
  margin: 0;
  padding: 1rem;
  background: var(--background-color);
  border-radius: 4px;
  overflow-x: auto;
  height: calc(100% - 3rem);
}

.code-preview code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  position: sticky;
  bottom: 0;
  background: var(--background-color);
  padding: 1rem 0;
  z-index: 1;
}

.btn-cancel {
  background: var(--background-color);
  color: var(--text-color);
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  min-width: 100px;
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style> 