const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env.test'),
  quiet: true
});

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const Product = require('../src/models/Product');

console.log('MONGODB_URI:', process.env.MONGODB_URI);

describe('Product CRUD API', () => {
  const product = {
    pid: 'TEST001',
    pname: 'Test Product',
    price: 10000,
    quantity: 50
  };

beforeAll(async () => {
  console.log('1. Đang kết nối MongoDB...');

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  console.log('2. MongoDB connected');

  await Product.deleteMany({});

  console.log('3. Đã xóa dữ liệu test');
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await Product.deleteMany({});
    await mongoose.disconnect();
  }
}, 15000);

  test('POST /api/products - Create Product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send(product);

    expect(response.statusCode).toBe(201);
    expect(response.body.pid).toBe(product.pid);
    expect(response.body.pname).toBe(product.pname);
    expect(response.body.price).toBe(product.price);
    expect(response.body.quantity).toBe(product.quantity);
  });

  test('GET /api/products - Get all Products', async () => {
    const response = await request(app)
      .get('/api/products');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/products/:pid - Get Product by pid', async () => {
    const response = await request(app)
      .get(`/api/products/${product.pid}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.pid).toBe(product.pid);
  });

  test('PUT /api/products/:pid - Update Product', async () => {
    const response = await request(app)
      .put(`/api/products/${product.pid}`)
      .send({
        pname: 'Updated Product',
        price: 15000,
        quantity: 100
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.pname).toBe('Updated Product');
    expect(response.body.price).toBe(15000);
    expect(response.body.quantity).toBe(100);
  });

  test('DELETE /api/products/:pid - Delete Product', async () => {
    const response = await request(app)
      .delete(`/api/products/${product.pid}`);

    expect(response.statusCode).toBe(200);

    const check = await Product.findOne({
      pid: product.pid
    });

    expect(check).toBeNull();
  });
});