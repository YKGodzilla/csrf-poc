const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let user = {
  name: 'Alice Smith',
  email: 'alice@example.com',
  account: '1234 5678 9012 3456',
  balance: '$12,345.67'
};

function pageLayout(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Beta Banker</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="site-shell">
    <header>
      <div class="brand">Beta Banker</div>
      <nav>
        <a href="/">Home</a>
        <a href="/accounts">Accounts</a>
        <a href="/transfer">Transfer</a>
        <a href="/profile">Profile</a>
        <a href="/csrf-attack.html">CSRF Attack</a>
      </nav>
    </header>
    <main>
      <h1>${title}</h1>
      ${content}
    </main>
    <footer>Simple CSRF demo site — no CSRF protection enabled.</footer>
  </div>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const content = `
    <p>Welcome to the Beta Banker website. Explore the pages and test the vulnerable profile email change form.</p>
    <p>This demo intentionally does not protect the profile email update route against CSRF attacks.</p>
    <div class="card-row">
      <div class="card">
        <h2>Your account</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Balance: ${user.balance}</p>
      </div>
      <div class="card">
        <h2>Test CSRF</h2>
        <p>Visit the <a href="/profile">Profile</a> page to change the email.</p>
        <p>Then open the <a href="/csrf-attack.html">malicious CSRF page</a> to simulate an attack.</p>
      </div>
    </div>`;
  res.send(pageLayout('Home', content));
});

app.get('/accounts', (req, res) => {
  const content = `
    <section class="panel">
      <h2>Primary Checking</h2>
      <p>Account number: ${user.account}</p>
      <p>Balance: ${user.balance}</p>
    </section>
    <section class="panel">
      <h2>Recent activity</h2>
      <ul>
        <li>Payment to Utilities - $120.00</li>
        <li>Salary deposit +$3,200.00</li>
        <li>Coffee shop -$8.45</li>
      </ul>
    </section>`;
  res.send(pageLayout('Accounts', content));
});

app.get('/transfer', (req, res) => {
  const content = `
    <p>This is a demo transfers page. The form is not connected to any back-end transfer logic.</p>
    <form class="small-form">
      <label>Recipient</label>
      <input type="text" value="Jane Doe" disabled />
      <label>Amount</label>
      <input type="text" value="$100.00" disabled />
      <button type="button" disabled>Send</button>
    </form>`;
  res.send(pageLayout('Transfer', content));
});

app.get('/profile', (req, res) => {
  const content = `
    <section class="panel">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Account:</strong> ${user.account}</p>
    </section>
    <section class="panel">
      <h2>Change email address</h2>
      <form method="POST" action="/profile/email">
        <label for="email">New email</label>
        <input id="email" name="email" type="email" value="${user.email}" required />
        <button type="submit">Update email</button>
      </form>
      <p class="warning">This form is intentionally vulnerable to CSRF because no token or origin validation is used.</p>
    </section>`;
  res.send(pageLayout('Profile', content));
});

app.post('/profile/email', (req, res) => {
  const newEmail = String(req.body.email || '').trim();
  if (!newEmail || !newEmail.includes('@')) {
    return res.status(400).send(pageLayout('Profile', '<p>Invalid email address.</p>'));
  }

  user.email = newEmail;
  return res.redirect('/profile');
});

app.get('*', (req, res) => {
  res.status(404).send(pageLayout('Not Found', '<p>Page not found.</p>'));
});

app.listen(PORT, () => {
  console.log(`Demo Bank site running at http://localhost:${PORT}`);
});
