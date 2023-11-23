# node-web-shop
This REST API project is done using nodejs, express js, mongodb and JWT .

Features : 
* JWT authentication/authorization(register,login,logout,profileEdit) --- done
* user crud --- done
* product crud --- done
* place order --- done
* customer can see order list --- done
* admin can see order order list --- done
* admin can update order status --- done
* order details --- done
* order fikter by status --- done
* order report ---
* featured product ---
* coupon ---
* payment gateway ---
* send email (order status) ---


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


