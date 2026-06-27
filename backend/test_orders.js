(async () => {
  try {
    let token = '';
    let res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'password', phone: '1234567890' })
    });
    
    let data = await res.json();
    if (res.status === 409) {
      console.log('User exists, logging in...');
      res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password' })
      });
      data = await res.json();
    } else if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }
    
    token = data.token;
    console.log('Token:', token ? 'exists' : 'missing');
    
    const res3 = await fetch('http://localhost:5000/api/orders/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data3 = await res3.json();
    console.log('Orders status:', res3.status);
    console.log('Orders response:', data3);
    
  } catch (err) {
    console.error('Error:', err);
  }
})();
