<script setup>
import ThemeToggle from './components/ThemeToggle.vue';
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="logo">Code Snippets</router-link>
        <ThemeToggle />
      </div>
    </nav>
    <main class="main-content">
      <div class="main-content-inner">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #4caf50;
  --primary-hover: #45a049;
  --secondary-color: #2196f3;
  --danger-color: #f44336;
  --text-color: #333;
  --border-color: #ddd;
  --background-color: #f5f5f5;
  --card-background: #fff;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --max-content-width: 1400px;
  --header-height: 64px;
}

html,
body {
  height: 100%;
  min-height: 100vh;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: var(--card-background);
  box-shadow: var(--shadow);
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.navbar-content {
  width: 100%;
  max-width: var(--max-content-width);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.container {
  width: 100%;
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.main-content {
  flex: 1;
  padding-top: calc(var(--header-height) + 2rem);
  padding-bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.main-content-inner {
  width: 100%;
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .container,
  .navbar-content,
  .main-content-inner {
    padding: 0 1rem;
  }
}

/* Global button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

/* Form styles */
input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background-color: var(--card-background);
  color: var(--text-color);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

/* Code highlighting theme adjustments */
pre code.hljs {
  background-color: var(--code-background) !important;
  transition: background-color 0.3s ease;
}
</style>
