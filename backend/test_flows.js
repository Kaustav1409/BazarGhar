const http = require('http');

const baseURL = 'http://localhost:5000/api';
let token = '';
let productId = '';
let orderId = '';
const results = [];

const request = (method, path, data = null, extraHeaders = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(baseURL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json', ...extraHeaders }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        let parsed = body;
        try { parsed = JSON.parse(body); } catch(e) {}
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const pass = (name, detail) => { console.log(`✅ PASS [${name}] ${detail}`); results.push({name, status:'PASS', detail}); };
const fail = (name, detail) => { console.log(`❌ FAIL [${name}] ${detail}`); results.push({name, status:'FAIL', detail}); };

async function runTests() {
  // 1. Register
  const email = `qa_${Date.now()}@test.com`;
  let res = await request('POST', '/auth/register', { name: 'QA Test', email, password: 'password123' });
  if (res.status === 201 && res.data.token) { token = res.data.token; pass('Register', `New user created, token received`); }
  else fail('Register', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 2. Login with registered credentials
  res = await request('POST', '/auth/login', { email, password: 'password123' });
  if (res.status === 200 && res.data.token) { token = res.data.token; pass('Login', 'Token received'); }
  else fail('Login', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 3. Login with wrong password
  res = await request('POST', '/auth/login', { email, password: 'WRONG' });
  if (res.status === 401) pass('Login - Wrong Password', 'Correctly returned 401');
  else fail('Login - Wrong Password', `Expected 401, got ${res.status}: ${JSON.stringify(res.data)}`);

  // 4. Get Profile
  res = await request('GET', '/auth/profile');
  if (res.status === 200 && res.data.email === email) pass('Get Profile', `Profile returned for ${email}`);
  else fail('Get Profile', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 5. Fetch Products (paginated)
  res = await request('GET', '/products');
  const pl = Array.isArray(res.data) ? res.data : res.data?.products;
  if (res.status === 200 && Array.isArray(pl) && pl.length > 0) { productId = pl[0]._id; pass('Get Products', `${pl.length} products returned`); }
  else fail('Get Products', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 6. Fetch Single Product
  if (productId) {
    res = await request('GET', `/products/${productId}`);
    if (res.status === 200 && res.data._id) pass('Get Product By ID', `Product: ${res.data.name}`);
    else fail('Get Product By ID', `Status ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // 7. Fetch Categories
  res = await request('GET', '/products/categories');
  if (res.status === 200 && Array.isArray(res.data)) pass('Get Categories', `${res.data.length} categories: ${res.data.join(', ')}`);
  else fail('Get Categories', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 8. Place Order
  if (productId) {
    res = await request('POST', '/orders', {
      products: [{ productId, quantity: 2 }],
      shippingAddress: { fullName: 'QA Test', address: '99 Test Road', city: 'Testpur', state: 'TN', pincode: '600001', phone: '9876543210' },
      deliveryInstructions: 'Ring doorbell twice',
      paymentMethod: 'Cash on Delivery',
      shippingPrice: 0,
      taxPrice: 100,
      discount: 0
    });
    if (res.status === 201 && res.data._id) { orderId = res.data._id; pass('Place Order', `Order ID: ${orderId}, Status: ${res.data.status}`); }
    else fail('Place Order', `Status ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // 9. Get My Orders
  res = await request('GET', '/orders/my');
  if (res.status === 200 && Array.isArray(res.data)) pass('Get My Orders', `${res.data.length} order(s) returned`);
  else fail('Get My Orders', `Status ${res.status}: ${JSON.stringify(res.data)}`);

  // 10. Get Order By ID
  if (orderId) {
    res = await request('GET', `/orders/${orderId}`);
    if (res.status === 200 && res.data._id === orderId) pass('Get Order By ID', `Order status: ${res.data.status}`);
    else fail('Get Order By ID', `Status ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // 11. Try to get another user's order (auth check)
  res = await request('GET', `/orders/000000000000000000000000`);
  if (res.status === 404 || res.status === 403) pass('Order Auth Guard', `Correctly blocked: status ${res.status}`);
  else fail('Order Auth Guard', `Expected 403/404, got ${res.status}`);

  // 12. Cancel Order
  if (orderId) {
    res = await request('PUT', `/orders/${orderId}/cancel`);
    if (res.status === 200 && res.data.order?.status === 'Cancelled') pass('Cancel Order', `Order status now: ${res.data.order.status}`);
    else fail('Cancel Order', `Status ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // 13. Try to cancel already-cancelled order
  if (orderId) {
    res = await request('PUT', `/orders/${orderId}/cancel`);
    if (res.status === 400) pass('Cancel Already-Cancelled Order', 'Correctly rejected: 400');
    else fail('Cancel Already-Cancelled Order', `Expected 400, got ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // 14. Access protected route without token
  const oldToken = token;
  token = '';
  res = await request('GET', '/orders/my');
  if (res.status === 401) pass('Protected Route Without Token', 'Correctly returned 401');
  else fail('Protected Route Without Token', `Expected 401, got ${res.status}`);
  token = oldToken;

  // Summary
  console.log('\n--- SUMMARY ---');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL');
  console.log(`${passed}/${results.length} tests passed`);
  if (failed.length > 0) {
    console.log('\nFailed tests:');
    failed.forEach(f => console.log(`  ❌ [${f.name}]: ${f.detail}`));
  }
}

runTests().catch(console.error);
