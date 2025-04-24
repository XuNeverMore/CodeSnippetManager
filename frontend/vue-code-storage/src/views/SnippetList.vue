<template>
  <div class="snippet-list">
    <div class="header">
      <h1>Code Snippets</h1>
      <div class="header-actions">
        <div class="dropdown">
          <button @click="toggleFilters" class="btn btn-filter">
            <span class="icon">☰</span>
            <span class="filter-count" v-if="activeFilterCount > 0">{{ activeFilterCount }}</span>
          </button>
          <transition name="fade">
            <div 
              v-if="isFiltersOpen" 
              class="dropdown-content"
              @mouseleave="handleMouseLeave"
              @mouseenter="handleMouseEnter"
            >
              <div class="filters">
                <div class="filter-section">
                  <h4>Languages</h4>
                  <div class="checkbox-group">
                    <label v-for="lang in store.availableLanguages" :key="lang" class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="lang"
                        v-model="selectedLanguages"
                        @change="updateLanguageFilter"
                      >
                      <span class="checkbox-text">{{ lang }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-section">
                  <h4>Tags</h4>
                  <div class="checkbox-group">
                    <label v-for="tag in store.availableTags" :key="tag" class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="tag"
                        v-model="selectedTags"
                        @change="updateTagsFilter"
                      >
                      <span class="checkbox-text">{{ tag }}</span>
                    </label>
                  </div>
                </div>

                <button @click="clearFilters" class="btn btn-clear">Clear Filters</button>
              </div>
            </div>
          </transition>
        </div>
        <router-link to="/snippets/new" class="btn btn-primary">New Snippet</router-link>
      </div>
    </div>

    <div class="content-wrapper">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredSnippets.length === 0" class="empty">No snippets found</div>
      <div v-else class="snippets">
        <div v-for="snippet in filteredSnippets" :key="snippet._id" class="snippet-card">
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { useSnippetStore } from '../stores/snippet'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useSnippetStore()
const { snippets, loading, error } = storeToRefs(store)
const selectedLanguages = ref([])
const selectedTags = ref([])
const isFiltersOpen = ref(false)
let closeTimeout = null

const filteredSnippets = computed(() => store.filteredSnippets)

const activeFilterCount = computed(() => {
  return selectedLanguages.value.length + selectedTags.value.length
})

// Update filters from route query
const updateFiltersFromQuery = () => {
  const { languages, tags } = route.query
  if (languages) {
    selectedLanguages.value = Array.isArray(languages) ? languages : [languages]
    store.setLanguageFilter(selectedLanguages.value)
  }
  if (tags) {
    selectedTags.value = Array.isArray(tags) ? tags : [tags]
    store.setTagsFilter(selectedTags.value)
  }
}

// Update route query when filters change
const updateRouteQuery = () => {
  const query = {}
  if (selectedLanguages.value.length > 0) {
    query.languages = selectedLanguages.value
  }
  if (selectedTags.value.length > 0) {
    query.tags = selectedTags.value
  }
  router.replace({ query })
}

const updateLanguageFilter = () => {
  store.setLanguageFilter(selectedLanguages.value)
  updateRouteQuery()
}

const updateTagsFilter = () => {
  store.setTagsFilter(selectedTags.value)
  updateRouteQuery()
}

const clearFilters = () => {
  store.clearFilters()
  selectedLanguages.value = []
  selectedTags.value = []
  router.replace({ query: {} })
}

const toggleFilters = () => {
  isFiltersOpen.value = !isFiltersOpen.value
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const handleMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    isFiltersOpen.value = false
  }, 1000)
}

const handleMouseEnter = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    isFiltersOpen.value = false
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      closeTimeout = null
    }
  }
}

// Watch for route changes to update filters
watch(() => route.query, () => {
  updateFiltersFromQuery()
}, { immediate: true })

onMounted(() => {
  store.fetchSnippets()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
  max-width: 1200px;
  margin: 0 auto;
}

.snippets:has(> :only-child) {
  max-width: 800px;
}

.snippets:has(> :only-child) .snippet-card {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .snippets {
    grid-template-columns: 1fr;
  }
}

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
  max-height: 350px;
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-filter {
  background: var(--secondary-color);
  color: white;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.filters {
  background: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section h4 {
  margin: 0 0 0.75rem 0;
  color: var(--text-color);
  font-size: 1rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.9rem;
  color: var(--text-color);
}

.btn-clear {
  background: var(--danger-color);
  color: white;
  margin-top: 1rem;
}

.btn-clear:hover {
  background: var(--danger-hover);
}

.content-wrapper {
  display: flex;
  position: relative;
  min-height: calc(100vh - 100px);
}

.sidebar {
  width: 300px;
  background: var(--card-background);
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  padding: 1.5rem;
  padding-top: 100px;
  overflow-y: auto;
  z-index: 10;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-open {
  margin-left: 300px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-300px);
}

.btn-filter {
  background: var(--secondary-color);
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.icon {
  font-size: 1.5rem;
  line-height: 1;
}

.filters h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .main-content.sidebar-open {
    margin-left: 0;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--card-background);
  min-width: 300px;
  box-shadow: var(--shadow);
  border-radius: 8px;
  margin-top: 0.5rem;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.filter-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filters {
  padding: 1rem;
}

.filters h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-section h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 0.9rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.9rem;
  color: var(--text-color);
}

.btn-clear {
  width: 100%;
  margin-top: 1rem;
  background: var(--danger-color);
  color: white;
}

.btn-clear:hover {
  background: var(--danger-hover);
}
</style> 