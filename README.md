# WEB SETORAN UANG ONLINE

## Isi proyek
- index.html       = halaman publik/form setoran
- admin.html       = halaman admin
- app.js           = koneksi dan tampilan data publik
- admin.js         = login dan pengelolaan admin
- style.css        = desain
- firebase-config.js = konfigurasi Firebase
- firestore.rules  = aturan keamanan Firestore

## CARA MEMASANG

### 1. Buat Firebase
Buka https://console.firebase.google.com/
Buat project baru.

### 2. Tambahkan Web App
Di Project Overview klik ikon Web (</>), beri nama aplikasi, lalu Register app.
Salin firebaseConfig yang diberikan.

Buka file firebase-config.js di VS Code dan ganti semua nilai GANTI_... dengan konfigurasi milikmu.

### 3. Aktifkan Firestore
Firebase Console -> Build -> Firestore Database -> Create database.
Pilih lokasi database dan selesaikan pembuatan.

### 4. Pasang Rules
Firebase Console -> Firestore Database -> Rules.
Salin isi file firestore.rules ke Rules lalu Publish.

### 5. Aktifkan login admin
Firebase Console -> Build -> Authentication -> Get started.
Aktifkan Sign-in method -> Email/Password.
Buat akun admin di Authentication -> Users -> Add user.

### 6. Upload ke GitHub
Buat repository baru, misalnya:
setoran-uang

Upload semua file proyek ini ke repository.

### 7. Aktifkan GitHub Pages
Repository -> Settings -> Pages.
Pada Build and deployment pilih:
Source: Deploy from a branch
Branch: main
Folder: / (root)
Save.

Setelah proses selesai, GitHub akan memberikan alamat website.
Format umumnya:
https://USERNAME.github.io/setoran-uang/

## CATATAN KEAMANAN
Jangan masukkan password admin ke file HTML/JavaScript.
Konfigurasi Firebase Web boleh berada di frontend; keamanan data ditentukan oleh Firestore Security Rules dan Authentication.

## ALUR PAKAI
Orang lain membuka index.html dari link publik lalu mengisi setoran.
Data masuk ke Firestore.
Admin membuka /admin.html dan login untuk melihat serta menghapus data.
