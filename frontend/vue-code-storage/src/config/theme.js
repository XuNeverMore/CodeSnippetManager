export const themes = {
  light: {
    '--primary-color': '#4CAF50',
    '--primary-hover': '#45a049',
    '--secondary-color': '#2196F3',
    '--danger-color': '#f44336',
    '--text-color': '#333',
    '--text-secondary': '#666',
    '--border-color': '#ddd',
    '--background-color': '#f5f5f5',
    '--card-background': '#fff',
    '--code-background': '#f8f9fa',
    '--shadow': '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  dark: {
    '--primary-color': '#66bb6a',
    '--primary-hover': '#4caf50',
    '--secondary-color': '#42a5f5',
    '--danger-color': '#ef5350',
    '--text-color': '#e0e0e0',
    '--text-secondary': '#b0b0b0',
    '--border-color': '#424242',
    '--background-color': '#1e1e1e',
    '--card-background': '#2d2d2d',
    '--code-background': '#252525',
    '--shadow': '0 2px 4px rgba(0, 0, 0, 0.2)'
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  Object.entries(themes[theme]).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}; 