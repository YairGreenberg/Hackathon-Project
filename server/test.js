const BASE = 'http://localhost:3000';

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function run() {
  console.log('🧪 מתחיל טסטים...\n');

  // בדיקת חיות
  const health = await fetch(`${BASE}/health`).then(r => r.json());
  console.log('✅ health:', health);

  // שמירת תמונה עם כיתוב
  const r1 = await post(`${BASE}/api/photo`, {
    caption: 'תמונה מהחוף',
    sender: '+972501234567',
    source: 'telegram',
  });
  console.log('✅ תמונה 1:', r1.photo.id, '|', r1.photo.caption);

  // שמירת תמונה בלי כיתוב
  const r2 = await post(`${BASE}/api/photo`, {
    sender: '+972501234567',
    source: 'whatsapp',
  });
  console.log('✅ תמונה 2:', r2.photo.id, '| ללא כיתוב');

  // דימוי webhook של טלגרם
const r3 = await fetch(`${BASE}/webhook/telegram`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: {
      from: { username: 'test_user', id: 123 },
      caption: 'תמונה מהבוט',
      photo: [{ file_id: 'abc123' }],
    },
  }),
});
console.log('✅ webhook טלגרם:', r3.status);

  // שליפת כל התמונות
  const all = await fetch(`${BASE}/api/photos`).then(r => r.json());
  console.log(`\n📸 סה"כ: ${all.count}`);
  all.photos.forEach(p => {
    console.log(`  - ${p.source} | ${p.sender} | "${p.caption || 'ללא כיתוב'}"`);
  });
}

run().catch(console.error);
