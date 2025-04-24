const mongoose = require('mongoose');
const Snippet = require('./models/Snippet');

const testSnippets = [
  {
    title: "Vue 3 Composition API Example",
    description: "A basic example of Vue 3 Composition API with ref and computed",
    language: "javascript",
    code: `import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubleCount,
      increment
    }
  }
}`,
    tags: ["vue", "composition-api", "javascript"]
  },
  {
    title: "Express Error Handling Middleware",
    description: "Custom error handling middleware for Express.js applications",
    language: "javascript",
    code: `app.use((err, req, res, next) => {
  // Log error message in our server's console
  console.error(err.stack);

  // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});`,
    tags: ["express", "nodejs", "error-handling"]
  }
];

async function addTestData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/code-snippets');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Snippet.deleteMany({});
    console.log('Cleared existing snippets');

    // Insert test data
    const result = await Snippet.insertMany(testSnippets);
    console.log('Added test snippets:', result);

    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addTestData(); 