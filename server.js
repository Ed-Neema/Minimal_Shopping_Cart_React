// sk_test_51MgyHeKi4ZLh3cdgIPrLrtoy1tIF3gGEpZ7JcEL2mXTT1QCYwl43N6Xw0BI0Mt24LJxvVDPpai5upigXQU0cNhV600XqsxlqCu
// Coffee: price_1MgySdKi4ZLh3cdghOFpnRGA
// Sunglasses: price_1MgyU0Ki4ZLh3cdgS13wvovw
// Camera: price_1MgyUiKi4ZLh3cdg2jwIE7rF
require("dotenv").config();
const key = process.env.STRIPE_SECRET_KEY;
const express = require("express");
var cors = require("cors"); //allow any Ip address to access our servers
const stripe = require("stripe")(key); //initialize a stripe client for our account

// create our express server
const app = express();
app.use(cors()); //middleware
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = []; //properly formatted data in a way required by stripe
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });
  const session = await stripe.checkout.sessions.create({
    //since we are using await, our server will wait for stripe to fully create the session
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  // we now have access to a url the user can use to checkout
  res.send(
    JSON.stringify({
      // send object to frontend
      url: session.url, //shows user the session stripe created for them
    })
  );
});

app.listen(4000, () => console.log("listening on port 4000"));
