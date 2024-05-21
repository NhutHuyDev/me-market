# MeMarket
## Summary
a simple eCommerce backend application

## Appendix
### List of APIs

### **1. SHARED FEATURES**

### 1.1. Authentication & Authorization
  
||Method|Resource|Description|
|---|---|---|---|
|1.1.1|POST|/users/request-verify-email|request to get OTP to verify user's email|
|1.1.2|POST|/users/verify-email|verify user's email by OTP|
|1.1.3|POST|/users/create|sign up|
|1.1.4|POST|/access/sign-in|sign in|
|1.1.5|POST|/access/sign-out|sign out|
|1.1.6|POST|/access/refresh|refresh access token by using refresh token rotation technique|
|1.1.7|POST|/credential/request-reset-password|request to get password reset code to reset user's password|
|1.1.8|POST|/v1/api/credential/reset-password/:userId/:passwordResetCode|update new password|

### **2. BUYER FEATURES**

### 2.1. Product

||Method|Resource|Description|
|---|---|---|---|
|2.1.1|GET|/products|filter, sort, and full-text search products|
|2.1.2|GET|/products/:productSlug/:productId|get detail information of a product|

### 2.2. Cart

||Method|Resource|Description|
|---|---|---|---|
|2.2.1|GET|/carts|get the cart of the current buyer|
|2.2.2|POST|/carts|add a product into cart|
|2.2.3|PATCH|/carts|update quantity of a product in cart|
|2.2.4|DELETE|/carts|remove products from cart|

### 2.3. Order
||Method|Resource|Description|
|---|---|---|---|
|2.3.1|POST|/orders/preview|preview an order's information before ordering|
|2.3.2|POST|/orders/|place an order|

### **3. SELLER FEATURES**

### 3.1. Seller

||Method|Resource|Description|
|---|---|---|---|
|3.1.1|POST|/sellers/register|register for selling|

### 3.2. Product

||Method|Resource|Description|
|---|---|---|---|
|3.2.1|GET|/products/all|get all products of the seller|
|3.2.2|GET|/products/draft|get products being drafted of the seller|
|3.2.3|GET|/products/publish|get published products of the seller|
|3.2.4|GET|/products/:productId|get detail information of a product|
|3.2.5|POST|/products|create a new product|
|3.2.6|PATCH|/products|update a product|
|3.2.7|PATCH|/products/publish|publish a product|
|3.2.8|PATCH|/products/unpublish|unpublish a product|
|3.2.9|DELETE|/products/:productId|delete a product|

### 3.3. Discount

||Method|Resource|Description|
|---|---|---|---|
|3.3.1|GET|/discounts|request to get OTP to verify user's email|
|3.3.2|POST|/discounts|create a discount|
|3.3.3|PATCH|/discounts|update a discount|
|3.3.4|PATCH|/discounts/enable|set active for a discount|
|3.3.5|PATCH|/discounts/disable|set in-active for a discount|

### **4. SUPER ADMIN FEATURES**

### 4.1. Product Attribute

||Method|Resource|Description|
|---|---|---|---|
|4.1.1|GET|/product-attributes|filter, sort, and full-text search product attributes|
|4.1.2|POST|/product-attributes|create a product attribute|
|4.1.3|POST|/product-attributes|update a product attribute|
|4.1.4|PATCH|/product-attributes|update a product attribute|
|4.1.5|DELETE|/product-attributes|delete a product attribute|

### 4.2. Product Category

||Method|Resource|Description|
|---|---|---|---|
|4.2.1|GET|/categories|filter, sort, and full-text search product categories|
|4.2.2|GET|/categories/:categoryId|get detail information of a category|
|4.2.3|POST|/categories|create a product category|
|4.2.4|PATCH|/categories|update a product category|
|4.2.5|DELETE|/categories|delete a product category|

