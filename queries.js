require('dotenv').config();
const { Pool } = require('pg');

const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'jewels';
const DB_PORT = process.env.DB_PORT || 5432;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    allowExitOnIdle: true,
});

const getData = async (tableName, limits = 10, order_by = 'id_ASC', page = 1) => {
    const fields = ['id', 'price', 'stock', 'name'];
    if (page < 1 || limits < 1) throw new Error('Invalid query parameters');
    if (limits > 50) limits = 50;
    
    const [field, dir] = order_by.split('_');

    if (!fields.find(entry => entry === field)) throw new Error(`Invalid field: ${field}`);

    const offset = (page - 1) * limits;

    const query = `SELECT (SELECT COUNT(*) FROM ${tableName} AS total_rows), (SELECT SUM(stock) FROM ${tableName} AS total_stock), ${tableName}.* FROM ${tableName} ORDER BY ${field} ${dir} LIMIT ${limits} OFFSET ${offset}`

    let { rows } = await pool.query(query);
    console.log(rows);
    const totalRows = parseInt(rows[0].count);
    const totalStock = parseInt(rows[0].sum);
    rows = rows.map((entry) => {
        const { count, sum, ...item } = entry;
        return item;
    });
    return [rows, totalRows, totalStock];
};

const getDataByFilters = async (tableName, params) => {
    let filters = [];
    let values = [];

    const addFilter = (field, opr, value) => {
        values.push(value);
        filters.push(`${field} ${opr} $${values.length}`);
    };

    if (params) {
        const { price_min, price_max, category, material } = params;
        if (price_min) addFilter('price', '>=', price_min);
        if (price_max) addFilter('price', '<=', price_max);
        if (category) addFilter('category', '=', category);
        if (material) addFilter('material', '=', material);
    }

    let query = `SELECT * FROM ${tableName}`;

    if (filters.length > 0) {
        filters = filters.join(' AND ');
        query += ` WHERE ${filters}`;
    }

    return { rows } = await pool.query(query, values);
};

const getJewels = async ({ limits, order_by, page }) => {
    return await getData('inventory', limits, order_by, page);
};

const getJewelsByFilter = async (params) => {
    return await getDataByFilters('inventory', params);
};

const getDataByID = async (tableName, id) => {
    const query = `SELECT * FROM ${tableName} WHERE id = ${id}`
    return { rows } = await pool.query(query);
}

const getJewel = (id) => {
    return getDataByID('inventory', id);
}

module.exports = { getJewel, getJewels, getJewelsByFilter };
