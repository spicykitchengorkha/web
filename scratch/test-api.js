const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://api.spicykitchengorkha.com/api/menu');
    console.log("Categories and Items:");
    res.data.forEach(cat => {
      console.log(`\nCategory: ${cat.title} (${cat.slug}) - Image: ${cat.image_url}`);
      if (cat.items) {
        cat.items.forEach(item => {
          console.log(`  - Item: ${item.name} (${item.featured_image_url})`);
        });
      }
    });
  } catch (err) {
    console.error("Error fetching menu:", err.message);
  }
}

test();
