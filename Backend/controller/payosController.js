import express from 'express';
import PayOS from '@payos/node';

const payos = new PayOS(
  '165040ef-2353-4643-9378-c897156a5bb8',
  '696628be-b9ee-4965-94b1-e694dc8157de',
  'd9e4c705b499d53fad53c5a42ca385a2153a632042f0c9ca4182b9e59eb4a4d4'
);

const app = express();
app.use(express.static('public'));
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:3000';

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trang chủ</title>
    </head>
    <body>
      <h1>Chào mừng đến với trang thanh toán</h1>
      <form action="/create-payment-link" method="post">
        <button type="submit">Tạo liên kết thanh toán</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/create-payment-link', async (req, res) => {
  try {
    const order = {
      amount: 1000,
      description: 'Thanh toán',
      orderCode: 11, // Sửa thành orderCode
      returnUrl: `${YOUR_DOMAIN}/success.html`,
      cancelUrl: `${YOUR_DOMAIN}/cancel.html`
    };

    const paymentLink = await payos.createPaymentLink(order);

    res.redirect(303, paymentLink.checkoutUrl);
  } catch (error) {
    console.error('Error creating payment link:', error);
    res.status(500).send('Lỗi khi tạo liên kết thanh toán');
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
