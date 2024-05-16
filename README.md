# NodeJS and Express.js

## Challenge 5

### Context

There is a jewelry store that needs to change their desktop app to a dynamic and modern one. We were tasked with the important quest of building the API for this app.

#### Requirements

* Have the ability to limit the results.
* Have the ability to filter the results by using a query strings.
* Have the ability to paginate the results.
* Have the ability to sort the results.
* Use HATEOAS constraint.

#### Prerequisites

You need to have installed `nodemon` globally.

### How can I see this?

Well, first of all you need to have installed `node` before running anything. Also, you need to clone this repo.

Once you have cloned this repo, `cd` into it. To start the backend, you need to:

```bash
npm install && nodemon index.js localhost PORT
```

Now, you're ready to play with the app. Have fun!

#### Available Endpoints:

You have the following endpoints:

* `/jewels`: returns the jewels in inventory. Can retrieve up to 50 jewels each time, but when called without any parameter will set `limits=10`. To access other results, you need to use the `page` parameter, e.g. `/jewels&limits=2&page=3`. You can sort the output using the parameter `sort_by`, which can accept the following values: `id_ASC`, `id_DESC`, `price_ASC`, `price_DESC`, `stock_ASC`, `stock_DESC`, `name_ASC`, and `name_DESC`. The default value is `sort_by=id_ASC`.
* `/jewels/filters`: returns the jewels in inventory that matches certain conditions. There are the following filters available: `price_min`, `price_max`, `category`, `material`, and `stock`. `price_min` and `price_max` can be used to match the customer budget. `category` is used to filter between the different types of jewels, whose are `necklace`, `rings`, and `earrings`. `material` can filter by jewel's material, and the options right now are `gold` and `silver`. For `stock`, this filter allow customer to filter for the minimum stock number of each jewel.
* `/jewels/jewel/:id`: returns all the information related to a certain jewel in the catalogue, in this case the one that matches the `id` param. 

#### Logs Middleware

There is also a middle that log all the calls made to the API. The logs will be stored in the same directory where `index.js` lives, inside a file called `logs.json`.

### About the DB

This app expects a database called `jewels`, and the following table:
```sql
CREATE TABLE inventory (
    id INT GENERATED ALWAYS AS IDENTITY, 
    name VARCHAR(50) NOT NULL, 
    category VARCHAR(50) NOT NULL, 
    material VARCHAR(50) NOT NULL,
    price INT NOT NULL CHECK (price > 0),
    stock INT NOT NULL CHECK (stock >= 0)
);
```

You can populate this table with the following values:
```sql
INSERT INTO inventory (name, category, material, price, stock) VALUES
    ('Heart Necklace', 'necklace', 'gold', 20000, 2),
    ('History Necklace', 'necklace', 'silver', 15000, 5),
    ('Berry Earrings', 'earrings', 'gold', 12000, 10),
    ('Hook Blue Earrings', 'earrings', 'gold', 25000, 4),
    ('Wish Ring', 'ring', 'silver', 30000, 4),
    ('Greece Rock Crystal Ring', 'ring', 'gold', 40000, 2);
```

---

### Author

* [Patricio Parada](https://github.com/pelafustan)

### Acknowledgement

* Black coffee.
* Green tea (when tummy hurt).
* [Desafío Latam](https://desafiolatam.com/)
