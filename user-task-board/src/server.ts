import 'dotenv/config';
import app from './app';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Task board API listening on port ${port}`));
