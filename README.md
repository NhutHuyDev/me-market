## MeMarket
## Summary
This project is a simple eCommerce backend application that supports user authentication, product management, seller registration, and order processing.
- RESTful APIs using JSON format, and request validation handled via [Express](https://expressjs.com/) with Typescript

- MongoDB, [mongoose ORM](https://mongoosejs.com/)

- Token-based authentication with JWT

## How to Run
### Prerequisites
- Node v20.12

- ```Docker``` installed

- Linux/MacOS, or Windows with WSL2, should have ```make``` installed

### Launch Mongo container
```
make mongo
```

### Seed Roles and Admin
```
make seed 
```

### Compile Typescript into Javascript
```
make build
```

### Run the Server
**.env**
```
DEV_PORT=<"app port">
ACCESS_TOKEN_EXPIRATION=<"access token expiration duration">
REFESH_TOKEN_EXPIRATION=<"refresh token expiration duration">
MONGO_CONNECTION_STR=<"Mongo connection string">

SUPER_ADMIN_EMAIL=<"admin's email">
SUPER_ADMIN_FIRST_NAME=<"admin's first name">
SUPER_ADMIN_LAST_NAME=<"admin's last name">
SUPER_ADMIN_MOBILE_PHONE=<"admin's mobile phone">
SUPER_ADMIN_CRED_PASSWORD=<"admin's password">

ADMIN_EMAIL_ADDRESS=<"email address for mailing feature">
GOOGLE_MAILER_CLIENT_ID=<"OAuth2 client ID">
GOOGLE_MAILER_CLIENT_SECRET=<"OAuth2 client secret">
GOOGLE_MAILER_REFRESH_TOKEN=<"OAuth2 client refresh token">
```

```
make server
```

### Run the server directly with TypeScript (for development)
```
make dev
```

## API Appendix

### Authentication & Authorization APIs
  
|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/users/request-verify-email|Request to get OTP to verify user's email| No |
|POST|/users/verify-email|Verify user's email by OTP| No |
|POST|/users|Sign up| No |
|POST|/access/sign-in|Sign in| No |
|POST|/access/sign-out|Sign out| Yes |
|POST|/access/refresh|Refresh access token by using refresh token rotation technique| No |
|POST|/credential/request-reset-password|Request to get password reset code to reset user's password| No |
|POST|/credential/reset-password/:userId/:passwordResetCode|Update new password| Yes |

### Seller APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/sellers/register|register for selling| Yes |

### Product APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|GET|/products|Buyers filter, sort, and search products| No |
|GET|/products/:productSlug/:productId|Buyer gets detail information of a specific product| No |
|GET|/products/all|get all products of the seller| Yes |
|GET|/products/draft|get products being drafted of the seller| Yes |
|GET|/products/publish|get published products of the seller| Yes |
|GET|/products/:productId|get detail information of a product| Yes |
|POST|/products|create a new product| Yes |
|PATCH|/products|update a product| Yes |
|PATCH|/products/publish|publish a product| Yes |
|PATCH|/products/unpublish|unpublish a product| Yes |
|DELETE|/products/:productId|delete a product| Yes |

### Discount APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|GET|/discounts|request to get OTP to verify user's email| Yes |
|POST|/discounts|create a discount| Yes |
|PATCH|/discounts|update a discount| Yes |
|PATCH|/discounts/enable|set active for a discount| Yes |
|PATCH|/discounts/disable|set in-active for a discount| Yes |

### Cart APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|GET|/carts|get the cart of the current buyer| Yes |
|POST|/carts|add a product into cart| Yes |
|PATCH|/carts|update quantity of a product in cart| Yes |
|DELETE|/carts|remove products from cart| Yes |

### Order APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/orders/preview|preview an order's information before ordering| Yes |
|POST|/orders/|place an order| Yes |


### Product Attribute APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|GET|/product-attributes|filter, sort, and full-text search product attributes| Yes |
|POST|/product-attributes|create a product attribute| Yes |
|POST|/product-attributes|update a product attribute| Yes |
|PATCH|/product-attributes|update a product attribute| Yes |
|DELETE|/product-attributes|delete a product attribute| Yes |

### Product Category APIs

|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|GET|/categories|filter, sort, and full-text search product categories| Yes |
|GET|/categories/:categoryId|get detail information of a category| Yes |
|POST|/categories|create a product category| Yes |
|PATCH|/categories|update a product category| Yes |
|DELETE|/categories|delete a product category| Yes |

### Notes:
- All responses are in JSON format as well.

- For endpoints marked with "Yes" in the Authentication column, a valid API key is required.

- The API key is sent using the `Authorization` header, formatted as follows: 
    ```
    authorization: bearer <"JWT token">
    ```

- Can use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test these APIs with the given '/client' folder
## References
[1]. Tips Javascript. (2023b, February 14). Course: Node.js Backend Architecture. https://www.youtube.com/watch?v=5keK7PRH9pE&list=PLw0w5s5b9NK4ucXizOF-eKAXKvn9ruCw8