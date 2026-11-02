# ML Squad — Forum Cari Squad & Cari Member

## Fitur
- Postingan forum dapat dibaca siapa saja, walaupun belum login.
- Login dan daftar memakai Firebase Authentication Email/Password. Anonymous Auth tidak dipakai.
- Forum dipisah menjadi **Cari Squad** dan **Cari Member**.
- Cari Squad mempunyai nama singkatan dan nama lengkap squad.
- Tag komunitas: `kompe`, `lucu`, dan `havefun`.
- Form rank, role, syarat/kriteria, catatan, dan ID game (untuk Cari Squad).
- Pengguna yang login dapat memberi like dan membalas/chat pada postingan.
- Email pemberitahuan otomatis kepada pemilik postingan saat ada balasan baru (Cloud Functions + EmailJS).
- Batas membuat postingan: satu kali setiap 5 menit per akun, divalidasi melalui transaksi dan Firestore Rules.
- Panel admin: ringkasan jumlah postingan dan kemampuan menghapus postingan yang melanggar aturan.
- Donasi DANA dan Saweria.

## 1. Firebase Authentication
Firebase Console → Authentication → Sign-in method → aktifkan **Email/Password**. Anonymous tetap nonaktif.

## 2. Firestore Rules
Firebase Console → Firestore Database → Rules. Ganti seluruh isi dengan `firestore.rules`, lalu klik **Publish**.
Postingan dan balasan boleh dibaca publik. Membuat postingan, like, dan membalas tetap wajib login. Akses admin memerlukan custom claim `admin: true`.

## 3. Jadikan akun sebagai admin dengan aman
Akun admin yang dituju: `qurosuyoch219@gmail.com`.
Jangan menaruh password admin di HTML, JavaScript, atau GitHub. Pastikan akun dengan email tersebut sudah dibuat di Firebase Authentication dan kamu dapat login ke akun itu.

Custom claim tidak boleh diberikan dari browser karena dapat dipalsukan. Jalankan script Admin SDK satu kali dari komputer yang memiliki Node.js:

1. Firebase Console → Project settings → Service accounts → Generate new private key. Simpan file JSON secara aman di komputer. **Jangan upload file JSON ini ke GitHub dan jangan kirim ke siapa pun.**
2. Dari folder project, masuk ke folder `functions`, lalu jalankan `npm install`.
3. Atur environment variable `GOOGLE_APPLICATION_CREDENTIALS` agar menunjuk ke lokasi file JSON service account tadi.
4. Dari root project, jalankan perintah: `node functions/set-admin.js qurosuyoch219@gmail.com`.
5. Logout lalu login kembali di website. Panel Admin akan muncul pada akun tersebut.

Jika memakai Android saja, langkah pemberian custom claim lebih mudah dilakukan dari komputer atau bantuan orang tepercaya yang mengelola Firebase. Jangan pernah memberikan password akun atau service-account JSON.

## 4. Upload ke GitHub Pages
Upload `index.html`, `style.css`, `app.js`, `firestore.rules`, `firebase.json`, folder `functions/`, dan folder `scripts/`. Aktifkan GitHub Pages dari Settings → Pages.
Jangan upload file service-account JSON.

## 5. Notifikasi email balasan
1. Buat template EmailJS dengan field `to_email`, `owner_name`, `reply_name`, `reply_text`, `post_title`, dan `post_id`.
2. Isi `SERVICE_ID`, `TEMPLATE_ID`, dan `PUBLIC_KEY` di `functions/index.js` dengan nilai milikmu.
3. Simpan EmailJS Private Key sebagai Firebase Secret: `firebase functions:secrets:set EMAILJS_PRIVATE_KEY`.
4. Jalankan `firebase deploy --only functions` dari root project. Deploy Cloud Functions memerlukan paket Firebase Blaze dan penagihan aktif; periksa biaya dan kuota.

## 6. Uji fitur
- Buka website tanpa login: postingan dan balasan lama harus terlihat.
- Logout: like dan kirim balasan harus meminta login.
- Login: buat Cari Squad dengan nama singkatan dan nama lengkap; tes juga Cari Member.
- Coba like, balas, dan pastikan email pemilik postingan menerima notifikasi.
- Tes batas posting kedua dalam waktu kurang dari 5 menit.
- Login dengan akun admin setelah custom claim aktif: panel Admin dan tombol moderasi harus muncul.

## Keamanan
Jangan pernah membagikan password, OTP, token, atau file service-account. ID game dan kode invite boleh dibagikan; jangan kirim data pemulihan akun.
