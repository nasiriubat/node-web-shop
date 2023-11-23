# node-web-shop
This REST API project is done using nodejs, express js, mongodb and JWT .

Features : 
1. JWT authentication/authorization(register,login,logout,profileEdit) --- done
2. user crud --- done
3. product crud --- done
4. place order ---
5. order report ---
6. featured product ---
7. customer old order list ---
8. coupon ---
9. payment gateway ---
10. send email (order status) ---


-----------------------------------------------------

---------------API Endpoint------------------

1. Place order :  {{url}}/order/place-order
Data :
{
  "user_id": "655e7834b0bdc39a29ca9059",
  "products": [
    {
      "product_id": "655e68ba5fafe98a459948f6",
      "quantity": 2
    },
    {
      "product_id": "655e68bc5fafe98a459948f9",
      "quantity": 1
    }
  ]
}


