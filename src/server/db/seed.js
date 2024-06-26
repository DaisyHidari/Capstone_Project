const db = require("./client");
const { createUser } = require("./users");
const { createShoe } = require("./shoes");
const { createCart } = require("./cart");
const users = [
  {
    is_admin: true,
    username: "ndlorusso",
    email: "nick@gmail.com",
    password: "abc123",
  },
  {
    is_admin: false,
    username: "brendan123",
    email: "brendan@gmail.com",
    password: "qwe123",
  },
  {
    is_admin: false,
    username: "desiree123",
    email: "desiree@gmail.com",
    password: "zxc3",
  },
];

const shoes = [
  { brand: "crocs", size: 10, price: 60, color: "navy", shoe_picture: "https://images.footway.com/02/07944-00_001.png?auto=format&fit=max&w=1200", },
  { brand: "grundens", size: 8, price: 120, color: "shrimp", shoe_picture: "https://www.sportsmans.com/medias/grundens-mens-deck-boss-ankle-fishing-boots-monument-gray-size-9-1538245-1.jpg?context=bWFzdGVyfGltYWdlc3w0NTk1MHxpbWFnZS9qcGVnfGFHRTFMMmhsWkM4eE1USTJNRFEzTVRjd05UWXpNQzh4TWpBd0xXTnZiblpsY25OcGIyNUdiM0p0WVhSZlltRnpaUzFqYjI1MlpYSnphVzl1Um05eWJXRjBYM050ZHkweE5UTTRNalExTFRFdWFuQm58NmY2MzA1ODhkMjE1Mjk0OTJlZDQ5ZGNjYzY3OTM3ZmVlNGJkMzUyZjZhZmNhNTU4Zjk3YmYzZTY4MzE1NzU3MQ", },
  { brand: "jordans", size: 11, price: 220, color: "black", shoe_picture: "https://images.solecollector.com/images/fl_lossy,q_auto/c_crop,h_1099,w_1999,x_0,y_507/drfprzpyn6hskmyscqk9/air-jordan-1-high-lost-and-found-dz5485-612-3", },
];

// how to get uuid for each users cart - use helper reduce function to grab prices and sums them up
// user_id is NULL in postbird
const cart = [
  { total_price: 1000, user_id: users[0].id },
  { total_price: 120, user_id: users[1].id },
  { total_price: 220, user_id: users[2].id },
];
// how to get total price for multiple shoes


// line 68 - NOT NULL?
const createTables = async () => {
  const SQL = `--sql
  DROP TABLE IF EXISTS cart;
  DROP TABLE IF EXISTS shoes;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    is_admin BOOLEAN DEFAULT FALSE,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );

  CREATE TABLE shoes(
    id UUID PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    price INTEGER NOT NULL,
    color VARCHAR(255) NOT NUll,
    shoe_picture VARCHAR(1000) NOT NULL
  );

  CREATE TABLE cart(
    id UUID PRIMARY KEY,
    total_price INTEGER NOT NULL,
    user_id UUID REFERENCES users(id),
    CONSTRAINT unique_user_cart UNIQUE (user_id)
  );
`;
  await db.query(SQL);
};

const insertUsers = async () => {
  try {
    for (const user of users) {
      await createUser({
        is_admin: user.is_admin,
        username: user.username,
        email: user.email,
        password: user.password,
      });
    }
    console.log("Users inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

const insertShoes = async () => {
  try {
    for (const shoe of shoes) {
      await createShoe({
        brand: shoe.brand,
        size: shoe.size,
        price: shoe.price,
        color: shoe.color,
        shoe_picture: shoe.shoe_picture,
      });
    }
    console.log("Shoes inserted successfully.");
    console.log('link to shoe image',shoes[0].shoe_picture);
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

// insert Cart function
const insertCart = async () => {
  try {
    for (const carts of cart) {
      await createCart({
        total_price: carts.total_price,
        user_id: carts.user_id,
      });
    }
    console.log("Cart inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

const seedDatabase = async () => {
  try {
    db.connect();
    await createTables();
    await insertUsers();
    await insertShoes();
    await insertCart();
  } catch (err) {
    throw err;
  } finally {
    db.end();
  }
};

seedDatabase();
