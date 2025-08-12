const express = require('express');
const router = express.Router();
const { hotspringGlobal } = hotspringGlobal


// Get a MenuItem by ID
router.get('/control/:id', async (req, res) => {
  try {
    let thisOne = null;
    if (req.params.id.endsWith('.min.js')) {
      const controlName = req.params.id.substring(0,req.params.id.length-7)
      thisOne = hotspringGlobal. listControls[controlName]
      res.type("application/javascript");
      res.send(thisOne.jsCodeMinified);
    } else if (req.params.id.endsWith('.js')) {
      const controlName = req.params.id.substring(0,req.params.id.length-3)
      thisOne = listControls[controlName]
      res.type("application/javascript");
      res.send(thisOne.jsCode);
    } else if (req.params.id.endsWith('.min.css')) {
      const controlName = req.params.id.substring(0,req.params.id.length-8)
      thisOne = listControls[controlName]
      res.type("text/css");
      res.send(thisOne.cssCodeMinified);
    } else if (req.params.id.endsWith('.css')) {
      const controlName = req.params.id.substring(0,req.params.id.length-4)
      thisOne = listControls[controlName]
      res.type("text/css");
      res.send(thisOne.cssCode);
    } else {
      const controlName = req.params.id
      thisOne = listControls[controlName]      
      res.status(200).json(thisOne);
    }
    if (!thisOne) {
      res.status(404).json({ error: 'Control not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
