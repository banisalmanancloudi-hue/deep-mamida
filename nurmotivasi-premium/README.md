# NurMotivasi Premium

Versi premium UI dari NurMotivasi Studio, dibuat sebagai direktori terpisah agar proyek asli tetap aman.

## Live test
Workflow GitHub Actions akan:
1. checkout repository;
2. memvalidasi HTML/CSS/JS dan menjalankan `node --check`;
3. membuat Pages artifact;
4. deploy ke GitHub Pages.

Setelah workflow sukses, URL umumnya:
https://banisalmanancloudi-hue.github.io/deep-mamida/nurmotivasi-premium/

Jika GitHub Pages belum aktif untuk repository, buka **Settings → Pages** dan pilih **GitHub Actions** sebagai source.

## AI background
UI AI tetap tersedia. Untuk GitHub Pages murni, endpoint server-side tidak dapat menyimpan `OPENAI_API_KEY`, sehingga tombol AI akan memberi status bahwa endpoint belum aktif. Hubungkan `window.NURMOTIVASI_AI_ENDPOINT` ke serverless endpoint (mis. Vercel) untuk mengaktifkan image generation tanpa membocorkan API key.

## Konten islami
Teks demo adalah copy inspiratif umum, bukan kutipan Al-Qur'an/hadis. Jika menambahkan ayat atau hadis, sertakan sumber yang akurat.
