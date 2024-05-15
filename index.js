require('dotenv').config();
const PORT = process.env.API_PORT;

const express = require('express');
const cors = require('cors');
const { getJewels } = require('./queries');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/jewels', async (req, res) => {
    try {
        const [data, count, stock] = await getJewels(req.query);

        let { page, limits } = req.query;

        !page ? page = 1 : page = parseInt(page);
        !limits ? limits = 10 : limits = parseInt(limits);

        const results = data.map((item) => {
            return { name: item.name, href: `/jewels/jewel/${item.id}` };
        });

        let previous = null
        let next = null

        if (page > 1) {
            previous = `/jewels&limits=${limits}&page=${page - 1}`
        }

        if (page < Math.ceil(count / limits)) {
            next = `/jewels&limits=${limits}&page=${page + 1}`
        }

        const hateoas = {
            limits: limits,
            page: page,
            previous: previous,
            next: next,
            totalJewels: count,
            totalStock: stock,
            results: results,
        }

        res.status(200).send(JSON.stringify(hateoas));
    } catch (err) {
        console.log(err);
        res.send(400).send({ 'error': err });
    }
});

app.listen(PORT, () => console.log(new Date().toString(), 'Server Running!'));
