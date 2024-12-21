const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//Create a product
router.post('/create', productController.createProduct);

//Get all products by organization ID
router.get('/:organization_id', productController.getProductByOrganizationId);

//Get product with discount by organization ID
router.get('/discount/:organization_id', productController.getProductsWithDiscount);

//Get product detail by product ID
router.get('/detail/:product_id', productController.getProductDetailByProductId);

//Update product by product ID
router.put('/update/:product_id', productController.updateProductDetail);

//Delete product by product ID
router.delete('/delete/:product_id', productController.deleteProduct);

//Decrease stock by product ID
router.put('/decrease-stock/:product_id', productController.decreaseStockOfProduct);

//Get low stock products by organization ID
router.get('/low-stock/:organization_id', productController.getLowStockProducts);

module.exports = router;