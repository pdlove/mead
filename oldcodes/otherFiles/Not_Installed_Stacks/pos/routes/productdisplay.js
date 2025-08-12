const express = require('express');
const router = express.Router();
const db = require('../../system/models');

router.get('/:tabletype/:filter', async (req, res) => {
    let products = null;
    switch(req.params.filter) {
        case 'all':
            products = await db.Products.findAll();
            break;
        default:
            res.status(404).json({ error: 'Product Filter not found' });
            return;
            break;
    }
    
    
    switch (req.params.tabletype) {
        case 'categorytree':
            let items = [];

            //Create product-like rows for categories. We're using a negative ID to differentiate them from products.
            const myCategories = await db.Categories.findAll({where: { tabletype: 'products'}});
            for (let myCategory of myCategories) {
                items.push({ productID: myCategory.categoryID*-1, 
                             categoryID: myCategory.parent_categoryID*-1, 
                             name: myCategory.name, 
                             rowType: 'c'
                            });
            }

            //Add products to our item array. Make sure the make the categoryID negative and set a rowType of 'p' for product
            const myProducts = await db.Products.findAll();
            for (let myProduct of myProducts) {                
                myProduct.dataValues.categoryID*=-1;
                myProduct.dataValues.rowType="p";                
                items.push(myProduct.dataValues);
            }

            res.json(items);
            break;
        default:
            res.status(404).json({ error: 'Table Type not found' });
            return;
            break;
    }
    
});

module.exports = router;

