<template>
  <div class="snippet-detail">
    <div class="header">
      <div class="title-section">
        <h1>{{ store.currentSnippet?.title }}</h1>
        <div class="meta">
          <span class="language">{{ store.currentSnippet?.language }}</span>
          <div class="tags">
            <span v-for="tag in store.currentSnippet?.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <router-link :to="`/snippets/${route.params.id}/edit`" class="btn btn-secondary">Edit</router-link>
        <button @click="handleDelete" class="btn btn-danger">Delete</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="description">
        {{ store.currentSnippet?.description }}
      </div>

      <div class="code-section">
        <div class="code-header">
          <h2>Code</h2>
          <button @click="copyCode" class="btn btn-copy">
            {{ copied ? 'Copied!' : 'Copy Code' }}
          </button>
        </div>
        <pre class="code-block" v-highlight>
          <code :class="store.currentSnippet?.language.toLowerCase()">{{ store.currentSnippet?.code }}</code>
        </pre>
      </div>
    </template>

    <div class="back-link">
      <router-link to="/" class="btn btn-text">
        ← Back to List
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSnippetStore } from '../stores/snippet';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const store = useSnippetStore();
const { loading, error } = storeToRefs(store);
const copied = ref(false);

onMounted(async () => {
  await store.fetchSnippet(route.params.id);
});

const copyCode = async () => {
  if (store.currentSnippet?.code) {
    await navigator.clipboard.writeText(store.currentSnippet.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this snippet?')) {
    await store.deleteSnippet(route.params.id);
    router.push('/');
  }
};
</script>

<style scoped>
.snippet-detail {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.title-section {
  flex: 1;
}

h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 2rem;
  background: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.code-section {
  background: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.code-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-color);
}

.btn-copy {
  background: var(--background-color);
  color: var(--text-color);
  min-width: 100px;
}

.btn-copy:hover {
  background: #e0e0e0;
}

.code-block {
  margin: 0;
  padding: 1.5rem;
  background: var(--background-color);
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.code-block code {
  display: block;
  min-width: 100%;
}

.back-link {
  margin-top: 2rem;
}

.btn-text {
  background: none;
  color: var(--text-color);
  padding: 0;
}

.btn-text:hover {
  color: var(--primary-color);
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  background: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.loading {
  color: var(--primary-color);
}

.error {
  color: var(--danger-color);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    width: 100%;
  }

  .actions .btn {
    flex: 1;
  }
}
</style> 