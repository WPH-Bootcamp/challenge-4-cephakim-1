# 🎓 Student Management CLI

Aplikasi Command Line Interface (CLI) untuk mengelola data siswa, nilai akademik, statistik kelas, dan export data. Dibangun menggunakan **Node.js**, dengan UI berwarna menggunakan **chalk v5**.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-repo.git
cd CHALLENGE-4-CEPHARIM-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Aplikasi

```bash
node index.js
```

---

## 📂 Struktur Direktori

Struktur folder aplikasi ini adalah sebagai berikut:

```
CHALLENGE-4-CEPHARIM-1
├── data/
│   ├── students.json
│   └── export_students_<timestamp>.json
│
├── node_modules/
│   ├── chalk/
│   └── readline-sync/
│
├── screenshots/
│   └── run-example.png
│
├── src/
│   ├── Student.js
│   └── StudentManager.js
│
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ✨ Fitur Utama

### 🧍 Manajemen Siswa

- Tambah siswa baru
- Lihat semua siswa
- Cari siswa berdasarkan ID
- Update data siswa
- Hapus siswa

### 📝 Manajemen Nilai

- Tambah nilai per mata pelajaran
- Validasi nilai 0–100
- Hitung rata-rata otomatis
- Status kelulusan otomatis (≥ 75 = **Lulus**)

### 🏆 Statistik & Sorting

- Lihat **Top 3** siswa
- Filter siswa berdasarkan kelas
- Statistik kelas (jumlah siswa, rata-rata nilai kelas)

### 💾 Data Persistence

Semua data disimpan otomatis ke:

```
/data/students.json
```

### 📤 Export Data

Export semua siswa ke file JSON otomatis:

```
/data/export_students_<timestamp>.json
```

### 🎨 UI Full Color (chalk v5)

- Output lebih nyaman dibaca
- Error, success, info, dan highlight menggunakan warna yang berbeda

---

## 🖼 Screenshot Hasil Running

screenshot ada di folder:

````
/screenshots/run-example.png

---

## 📘 Dokumentasi Kode

Untuk memudahkan pembacaan & penilaian, seluruh source code menggunakan dokumentasi **JSDoc**.

Contoh:

```js
/**
 * Class Student
 * Representasi dari seorang siswa dan nilai akademiknya.
 *
 * @property {string} id - ID unik siswa
 * @property {string} name - Nama siswa
 * @property {string} class - Kelas siswa
 * @property {Object.<string, number>} grades - Map nilai: {subject: score}
 */
````

Contoh pada method:

```js
/**
 * Menghitung rata-rata nilai siswa
 * @returns {number}
 */
getAverage() { ... }
```

---

## 🧪 Contoh Data

File default:

```
/data/students.json
```

Berisi contoh struktur:

```json
[
  {
    "id": "SF001",
    "name": "Sumayyah Al-Muwahhidah",
    "class": "XII-A",
    "grades": { "Pendidikan Agama": 98 }
  }
]
```

---

## 📄 Lisensi

Free to use — untuk kebutuhan submission, belajar, dan pengembangan pribadi.
