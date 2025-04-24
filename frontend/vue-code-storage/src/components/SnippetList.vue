<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSnippetStore } from '@/stores/snippet';
import { Filter } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const snippetStore = useSnippetStore();

const showFilter = ref(false);
const loading = ref(false);
const error = ref(null);

const filteredSnippets = computed(() => snippetStore.filteredSnippets);

onMounted(async () => {
  loading.value = true;
  try {
    await snippetStore.fetchSnippets();
  } catch (err) {
    error.value = err.message || t('snippet.fetchError');
    console.error('Failed to fetch snippets:', err);
  } finally {
    loading.value = false;
  }
});

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const selectedLanguage = computed({
  get: () => route.query.language || '',
  set: (value) => {
    router.push({
      query: {
        ...route.query,
        language: value || undefined,
      },
    });
  },
});

const languages = computed(() => snippetStore.languages);
const tags = computed(() => snippetStore.tags);

const isTagSelected = (tag) => {
  const currentTags = route.query.tags ? route.query.tags.split(',') : [];
  return currentTags.includes(tag);
};

const handleTagFilter = (tag) => {
  const currentTags = route.query.tags ? route.query.tags.split(',') : [];
  const newTags = currentTags.includes(tag)
    ? currentTags.filter((t) => t !== tag)
    : [...currentTags, tag];
  
  router.push({
    query: {
      ...route.query,
      tags: newTags.length ? newTags.join(',') : undefined,
    },
  });
};

const handleLanguageFilter = () => {
  // The language filter is handled by the computed property
};
</script>

<template>
  <div class="snippet-list">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    <template v-else>
      <div class="filter-container">
        <div class="filter-trigger" @click="toggleFilter" @mouseenter="showFilter = true">
          <el-button type="primary" :icon="Filter">
            {{ $t('snippet.filter') }}
          </el-button>
        </div>
        <div class="filter-area" v-show="showFilter" @mouseleave="showFilter = false">
          <div class="filter-content">
            <div class="filter-section">
              <h3>{{ $t('snippet.filterByLanguage') }}</h3>
              <el-select
                v-model="selectedLanguage"
                :placeholder="$t('snippet.selectLanguage')"
                clearable
                @change="handleLanguageFilter"
              >
                <el-option
                  v-for="lang in languages"
                  :key="lang"
                  :label="lang"
                  :value="lang"
                />
              </el-select>
            </div>

            <div class="filter-section">
              <h3>{{ $t('snippet.filterByTag') }}</h3>
              <div class="tag-list">
                <el-tag
                  v-for="tag in tags"
                  :key="tag"
                  :type="isTagSelected(tag) ? '' : 'info'"
                  class="tag-item"
                  @click="handleTagFilter(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <el-alert
          :title="error"
          type="error"
          show-icon
        />
      </div>

      <div v-else-if="filteredSnippets.length === 0" class="empty-message">
        <el-empty :description="$t('snippet.noSnippets')" />
      </div>

      <div v-else class="snippets-grid">
        <el-card
          v-for="snippet in filteredSnippets"
          :key="snippet._id"
          class="snippet-card"
        >
          <template #header>
            <div class="card-header">
              <span class="title">{{ snippet.title }}</span>
              <el-tag size="small">{{ snippet.language }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <pre><code>{{ snippet.code }}</code></pre>
          </div>
          <div class="card-footer">
            <div class="tags">
              <el-tag
                v-for="tag in snippet.tags"
                :key="tag"
                size="small"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.snippet-list {
  padding: 20px;
}

.filter-container {
  position: relative;
  margin-bottom: 20px;
}

.filter-trigger {
  display: inline-block;
}

.filter-area {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  min-width: 300px;
}

.filter-content {
  padding: 16px;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-section h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  transform: scale(1.05);
}

.loading-container {
  padding: 20px;
}

.error-message {
  margin: 20px 0;
}

.empty-message {
  margin: 40px 0;
  text-align: center;
}

.snippets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.snippet-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.card-content {
  margin: 10px 0;
}

.card-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.card-footer {
  margin-top: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  margin-right: 5px;
}
</style> 