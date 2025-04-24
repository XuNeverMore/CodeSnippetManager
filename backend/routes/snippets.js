const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');

// Get all snippets
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all snippets...');
    const snippets = await Snippet.find();
    console.log(`Found ${snippets.length} snippets`);
    res.json(snippets);
  } catch (err) {
    console.error('Error fetching snippets:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get one snippet
router.get('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (err) {
    console.error('Error fetching snippet:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create snippet
router.post('/', async (req, res) => {
  try {
    console.log('Creating new snippet:', req.body);
    const snippet = new Snippet({
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      language: req.body.language,
      tags: req.body.tags,
    });

    const newSnippet = await snippet.save();
    console.log('Snippet created successfully:', newSnippet);
    res.status(201).json(newSnippet);
  } catch (err) {
    console.error('Error creating snippet:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update snippet
router.put('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    
    res.json(snippet);
  } catch (err) {
    console.error('Error updating snippet:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete snippet
router.delete('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    console.error('Error deleting snippet:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 