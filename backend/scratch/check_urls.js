import fetch from 'node-fetch';

const testUrls = [
  // Croma
  { name: 'iPhone 16 Pro Croma', url: 'https://www.croma.com/searchB?q=Apple%20iPhone%2016%20Pro%3Arelevance&text=Apple%20iPhone%2016%20Pro' },
  { name: 'S25 Ultra Croma', url: 'https://www.croma.com/searchB?q=Samsung%20Galaxy%20S25%20Ultra%3Arelevance&text=Samsung%20Galaxy%20S25%20Ultra' },
  { name: 'MacBook Air M3 Croma', url: 'https://www.croma.com/searchB?q=MacBook%20Air%20M3%3Arelevance&text=MacBook%20Air%20M3' },
  { name: 'Sony WH-1000XM5 Croma', url: 'https://www.croma.com/searchB?q=Sony%20WH-1000XM5%3Arelevance&text=Sony%20WH-1000XM5' },
  { name: 'PS5 Slim Croma', url: 'https://www.croma.com/searchB?q=PlayStation%205%20Slim%3Arelevance&text=PlayStation%205%20Slim' },
  { name: 'LG C3 Croma', url: 'https://www.croma.com/searchB?q=LG%20C3%2055%20inch%20OLED%3Arelevance&text=LG%20C3%2055%20inch%20OLED' },

  // Vijay Sales
  { name: 'iPhone 16 Pro Vijay Sales', url: 'https://www.vijaysales.com/search/apple-iphone-16-pro' },
  { name: 'S25 Ultra Vijay Sales', url: 'https://www.vijaysales.com/search/samsung-galaxy-s25-ultra' },
  { name: 'MacBook Air M3 Vijay Sales', url: 'https://www.vijaysales.com/search/macbook-air-m3' },
  { name: 'Sony WH-1000XM5 Vijay Sales', url: 'https://www.vijaysales.com/search/sony-wh-1000xm5' },
  { name: 'PS5 Slim Vijay Sales', url: 'https://www.vijaysales.com/search/playstation-5-slim' },
  { name: 'LG C3 Vijay Sales', url: 'https://www.vijaysales.com/search/lg-c3-55-inch-oled' },

  // Reliance Digital
  { name: 'iPhone 16 Pro Reliance', url: 'https://www.reliancedigital.in/search?q=Apple%20iPhone%2016%20Pro' },
  { name: 'S25 Ultra Reliance', url: 'https://www.reliancedigital.in/search?q=Samsung%20Galaxy%20S25%20Ultra' },
  { name: 'MacBook Air M3 Reliance', url: 'https://www.reliancedigital.in/search?q=MacBook%20Air%20M3' },
  { name: 'Sony WH-1000XM5 Reliance', url: 'https://www.reliancedigital.in/search?q=Sony%20WH-1000XM5' },
  { name: 'PS5 Slim Reliance', url: 'https://www.reliancedigital.in/search?q=PlayStation%205%20Slim' },
  { name: 'LG C3 Reliance', url: 'https://www.reliancedigital.in/search?q=LG%20C3%2055%20inch%20OLED' }
];

async function check(item) {
  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    });
    console.log(`[${item.name}] status:${res.status}`);
  } catch (e) {
    console.log(`[${item.name}] ERR: ${e.message}`);
  }
}

for (const item of testUrls) {
  await check(item);
}
