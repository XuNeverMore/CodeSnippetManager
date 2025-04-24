import { defineStore } from "pinia";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';

export const useSnippetStore = defineStore("snippet", {
  state: () => ({
    snippets: [],
    currentSnippet: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSnippets(params = {}) {
      this.loading = true;
      try {
        const response = await axios.get(API_ENDPOINTS.SNIPPETS, { params });
        this.snippets = response.data;
      } catch (error) {
        console.log("get list:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchSnippet(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_ENDPOINTS.SNIPPETS}/${id}`);
        this.currentSnippet = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createSnippet(snippet) {
      this.loading = true;
      try {
        const response = await axios.post(API_ENDPOINTS.SNIPPETS, snippet);
        this.snippets.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSnippet(id, snippet) {
      this.loading = true;
      try {
        const response = await axios.put(`${API_ENDPOINTS.SNIPPETS}/${id}`, snippet);
        const index = this.snippets.findIndex((s) => s._id === id);
        if (index !== -1) {
          this.snippets[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSnippet(id) {
      this.loading = true;
      try {
        await axios.delete(`${API_ENDPOINTS.SNIPPETS}/${id}`);
        this.snippets = this.snippets.filter((s) => s._id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
