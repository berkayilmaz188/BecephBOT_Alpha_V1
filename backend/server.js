const app = require('./app'); // Daha önce oluşturduğunuz Express uygulamasını alın
const client = require('./utils/botClient'); // Bot client'ını alın

const PORT = process.env.PORT || 4002; // PORT'u ayarlayın, eğer .env dosyasında PORT belirtmediyseniz 4002 numaralı portu kullanacak

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

