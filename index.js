/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 *
 * TODO: Implementasikan CLI interface yang interaktif dengan menu:
 * 1. Tambah Siswa Baru
 * 2. Lihat Semua Siswa
 * 3. Cari Siswa (by ID)
 * 4. Update Data Siswa
 * 5. Hapus Siswa
 * 6. Tambah Nilai Siswa
 * 7. Lihat Top 3 Siswa
 * 8. Keluar
 */

import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import Student from './src/Student.js';
import StudentManager from './src/StudentManager.js';

// Inisialisasi StudentManager
const manager = new StudentManager();

// PATH data
const DATA_DIR = path.resolve('./data');
const DATA_FILE = path.join(DATA_DIR, 'students.json');

/**
 * --- IMPLEMENTASI BONUS: helper untuk persistence & export ---
 * - auto create folder data
 * - loadFromFile()
 * - saveToFile()
 * - exportToJSON()
 */

// pastikan folder data ada (user izinkan auto-create)
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
} catch (err) {
  console.error(chalk.red('Gagal membuat folder data:'), err.message);
}

// load data dari file jika ada
function loadFromFile() {
  if (!fs.existsSync(DATA_FILE)) {
    // buat file kosong awal jika belum ada
    try {
      fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
    } catch (err) {
      console.error(chalk.red('Gagal membuat file data awal:'), err.message);
    }
    return;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const arr = JSON.parse(raw || '[]');
    // isi manager dengan instance Student
    arr.forEach((s) => {
      try {
        // Pastikan property grades tetap dipetakan
        const st = new Student(s.id, s.name, s.class);
        if (s.grades && typeof s.grades === 'object') {
          for (const [sub, score] of Object.entries(s.grades)) {
            // gunakan addGrade untuk validasi
            try {
              st.addGrade(sub, Number(score));
            } catch (_) {
              /* skip invalid */
            }
          }
        }
        manager.addStudent(st);
      } catch (err) {
        // skip satu record jika error
        console.warn(
          chalk.yellow(`Warning: gagal memuat siswa id=${s.id}: ${err.message}`)
        );
      }
    });
  } catch (err) {
    console.error(chalk.red('Gagal membaca data siswa:'), err.message);
  }
}

// simpan seluruh students ke file JSON
function saveToFile() {
  try {
    const arr = manager.getAllStudents().map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      grades: s.grades,
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error(chalk.red('Gagal menyimpan data:'), err.message);
  }
}

// export semua data ke JSON file (timestamped)
function exportToJSON() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outPath = path.join(DATA_DIR, `export_students_${timestamp}.json`);
    const arr = manager.getAllStudents().map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      grades: s.grades,
      average: Number(s.getAverage().toFixed(2)),
      status: s.getGradeStatus(),
    }));
    fs.writeFileSync(outPath, JSON.stringify(arr, null, 2), 'utf-8');
    console.log(chalk.green(`Export berhasil: ${outPath}`));
  } catch (err) {
    console.error(chalk.red('Gagal export data:'), err.message);
  }
}

/**
 * Menampilkan menu utama
 */
function displayMenu() {
  // header full-color
  console.log(
    '\n' +
      chalk.hex('#4EE1A0').bold('===========================================')
  );
  console.log(
    chalk
      .bgHex('#1F2937')
      .white.bold('   SISTEM MANAJEMEN NILAI SISWA — SMK FARMASI   ')
  );
  console.log(
    chalk.hex('#4EE1A0').bold('===========================================')
  );
  console.log(chalk.cyan('1.') + ' ' + chalk.white('Tambah Siswa Baru'));
  console.log(chalk.cyan('2.') + ' ' + chalk.white('Lihat Semua Siswa'));
  console.log(chalk.cyan('3.') + ' ' + chalk.white('Cari Siswa'));
  console.log(chalk.cyan('4.') + ' ' + chalk.white('Update Data Siswa'));
  console.log(chalk.cyan('5.') + ' ' + chalk.white('Hapus Siswa'));
  console.log(chalk.cyan('6.') + ' ' + chalk.white('Tambah Nilai Siswa'));
  console.log(chalk.cyan('7.') + ' ' + chalk.white('Lihat Top 3 Siswa'));
  console.log(chalk.cyan('8.') + ' ' + chalk.white('Keluar'));
  // bonus menu tambahan (nomor setelah 8)
  console.log(
    chalk.magenta('9.') +
      ' ' +
      chalk.white('Filter by Kelas (lihat siswa per kelas)')
  );
  console.log(chalk.magenta('10.') + ' ' + chalk.white('Statistik Kelas'));
  console.log(
    chalk.magenta('11.') + ' ' + chalk.white('Export Semua Data ke JSON')
  );
  console.log(
    chalk.hex('#4EE1A0').bold('===========================================')
  );
}

/**
 * Handler untuk menambah siswa baru
 * TODO: Implementasikan function ini
 */
function addNewStudent() {
  console.log('\n--- Tambah Siswa Baru ---');

  const id = readlineSync.question(chalk.yellow('Masukkan ID: '));
  const name = readlineSync.question(chalk.yellow('Masukkan Nama: '));
  const studentClass = readlineSync.question(chalk.yellow('Masukkan Kelas: '));

  // Validasi sederhana
  if (!id.trim() || !name.trim() || !studentClass.trim()) {
    console.log(chalk.red('❌ ID, Nama, dan Kelas wajib diisi!'));
    return;
  }

  const student = new Student(id.trim(), name.trim(), studentClass.trim());
  const success = manager.addStudent(student);

  if (success) {
    saveToFile(); // simpan setelah perubahan
    console.log(chalk.green('✅ Siswa berhasil ditambahkan!'));
  } else {
    console.log(chalk.red('❌ Gagal! ID sudah digunakan.'));
  }
}

/**
 * Handler untuk melihat semua siswa
 * TODO: Implementasikan function ini
 * - Panggil method displayAllStudents dari manager
 * - Jika tidak ada siswa, tampilkan pesan
 */
function viewAllStudents() {
  console.log('\n--- Daftar Semua Siswa ---');
  manager.displayAllStudents();
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 * TODO: Implementasikan function ini
 * - Minta input ID
 * - Cari siswa menggunakan manager
 * - Tampilkan info siswa jika ditemukan
 */
function searchStudent() {
  console.log('\n--- Cari Siswa ---');
  const id = readlineSync.question(chalk.yellow('Masukkan ID: '));

  const student = manager.findStudent(id.trim());

  if (student) {
    student.displayInfo();
    // tawarkan export single siswa
    const exp = readlineSync.question(
      chalk.gray('Export data siswa ini ke JSON? (y/n): ')
    );
    if (exp.toLowerCase() === 'y') {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outPath = path.join(
          DATA_DIR,
          `student_${student.id}_${timestamp}.json`
        );
        const obj = {
          id: student.id,
          name: student.name,
          class: student.class,
          grades: student.grades,
          average: Number(student.getAverage().toFixed(2)),
          status: student.getGradeStatus(),
        };
        fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf-8');
        console.log(chalk.green(`Export siswa berhasil: ${outPath}`));
      } catch (err) {
        console.error(chalk.red('Gagal export siswa:'), err.message);
      }
    }
  } else {
    console.log(chalk.red('❌ Siswa tidak ditemukan.'));
  }
}

/**
 * Handler untuk update data siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data saat ini
 * - Minta input data baru (nama, kelas)
 * - Update menggunakan manager
 */
function updateStudent() {
  console.log('\n--- Update Data Siswa ---');

  const id = readlineSync.question(chalk.yellow('Masukkan ID siswa: '));
  const student = manager.findStudent(id.trim());

  if (!student) {
    console.log(chalk.red('❌ Siswa tidak ditemukan.'));
    return;
  }

  student.displayInfo();

  const newName = readlineSync.question(
    chalk.yellow('Nama baru (kosongkan jika tidak diubah): ')
  );
  const newClass = readlineSync.question(
    chalk.yellow('Kelas baru (kosongkan jika tidak diubah): ')
  );

  const success = manager.updateStudent(id.trim(), {
    name: newName.trim() || undefined,
    class: newClass.trim() || undefined,
  });

  if (success) {
    saveToFile();
    console.log(chalk.green('✅ Data berhasil diupdate.'));
  } else {
    console.log(chalk.red('❌ Gagal update data.'));
  }
}

/**
 * Handler untuk menghapus siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Konfirmasi penghapusan
 * - Hapus menggunakan manager
 */
function deleteStudent() {
  console.log('\n--- Hapus Siswa ---');

  const id = readlineSync.question(chalk.yellow('Masukkan ID siswa: '));
  const confirm = readlineSync.question(
    chalk.gray('Yakin ingin menghapus? (y/n): ')
  );

  if (confirm.toLowerCase() !== 'y') {
    console.log(chalk.yellow('Dibatalkan.'));
    return;
  }

  const success = manager.removeStudent(id.trim());
  if (success) {
    saveToFile();
    console.log(chalk.green('✅ Siswa berhasil dihapus.'));
  } else {
    console.log(chalk.red('❌ Siswa tidak ditemukan.'));
  }
}

/**
 * Handler untuk menambah nilai siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data siswa
 * - Minta input mata pelajaran dan nilai
 * - Tambahkan nilai menggunakan method addGrade
 */
function addGradeToStudent() {
  console.log('\n--- Tambah Nilai Siswa ---');

  const id = readlineSync.question(chalk.yellow('Masukkan ID siswa: '));
  const student = manager.findStudent(id.trim());

  if (!student) {
    console.log(chalk.red('❌ Siswa tidak ditemukan.'));
    return;
  }

  student.displayInfo();

  const subject = readlineSync.question(chalk.yellow('Mata pelajaran: '));
  const scoreInput = readlineSync.question(chalk.yellow('Nilai (0-100): '));
  const score = Number(scoreInput);

  if (Number.isNaN(score)) {
    console.log(chalk.red('❌ Nilai harus berupa angka.'));
    return;
  }

  const success = student.addGrade(subject.trim(), score);

  if (success) {
    saveToFile();
    console.log(chalk.green('✅ Nilai berhasil ditambahkan.'));
  } else {
    console.log(chalk.red('❌ Gagal menambah nilai.'));
  }
}

/**
 * Handler untuk melihat top students
 * TODO: Implementasikan function ini
 * - Panggil getTopStudents(3) dari manager
 * - Tampilkan informasi siswa
 */
function viewTopStudents() {
  console.log('\n--- Top 3 Siswa ---');

  const list = manager.getTopStudents(3);

  if (list.length === 0) {
    console.log(chalk.yellow('Belum ada siswa.'));
    return;
  }

  list.forEach((s, idx) => {
    console.log(
      chalk.bgBlue.white.bold(
        `\n#${idx + 1} — ${s.name} (${s.id}) — Kelas: ${s.class}`
      )
    );
    console.log(
      `Rata-rata: ${s.getAverage().toFixed(2)} | Status: ${s.getGradeStatus()}`
    );
  });
}

/**
 * BONUS: Handler filter by class
 */
function filterByClass() {
  console.log('\n--- Filter: Tampilkan Siswa per Kelas ---');
  // kumpulkan kelas unik
  const kelasSet = new Set(manager.getAllStudents().map((s) => s.class));
  const kelasList = Array.from(kelasSet).sort();
  if (kelasList.length === 0) {
    console.log(chalk.yellow('Belum ada data siswa.'));
    return;
  }
  console.log(chalk.cyan('Kelas tersedia:'), kelasList.join(', '));
  const classChoice = readlineSync.question(
    chalk.yellow('Masukkan nama kelas yang ingin ditampilkan: ')
  );
  const filtered = manager.getStudentsByClass(classChoice.trim());
  if (filtered.length === 0) {
    console.log(chalk.red('Tidak ditemukan siswa di kelas tersebut.'));
    return;
  }
  filtered.forEach((s) => s.displayInfo());
}

/**
 * BONUS: Handler statistik kelas
 */
function classStatistics() {
  console.log('\n--- Statistik Kelas ---');
  const className = readlineSync.question(
    chalk.yellow('Masukkan nama kelas untuk statistik: ')
  );
  const stats = manager.getClassStatistics(className.trim());
  if (!stats) {
    console.log(chalk.red('Tidak ada data untuk kelas tersebut.'));
    return;
  }
  console.log(chalk.green(`Statistik Kelas ${className.trim()}:`));
  console.log(`Jumlah siswa: ${stats.totalStudents}`);
  console.log(`Rata-rata kelas: ${Number(stats.averageClassScore.toFixed(2))}`);
  // cari tertinggi & terendah
  const list = manager.getStudentsByClass(className.trim());
  const sorted = list.slice().sort((a, b) => b.getAverage() - a.getAverage());
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  if (top)
    console.log(
      `Nilai tertinggi: ${top.getAverage().toFixed(2)} (ID: ${top.id}, Nama: ${
        top.name
      })`
    );
  if (bottom)
    console.log(
      `Nilai terendah: ${bottom.getAverage().toFixed(2)} (ID: ${
        bottom.id
      }, Nama: ${bottom.name})`
    );
}

/**
 * Handler export semua data
 */
function handleExportAll() {
  console.log('\n--- Export Semua Data ke JSON ---');
  exportToJSON();
}

/**
 * Main program loop
 * TODO: Implementasikan main loop
 * - Tampilkan menu
 * - Baca input pilihan
 * - Panggil handler yang sesuai
 * - Ulangi sampai user pilih keluar
 */
function main() {
  console.log(
    chalk.bold.hex('#60A5FA')('Selamat datang di Sistem Manajemen Nilai Siswa!')
  );

  // load data awal
  loadFromFile();

  let running = true;

  while (running) {
    displayMenu();
    const choice = readlineSync.question(chalk.green('Pilih menu: '));

    switch (choice) {
      case '1':
        addNewStudent();
        break;
      case '2':
        viewAllStudents();
        break;
      case '3':
        searchStudent();
        break;
      case '4':
        updateStudent();
        break;
      case '5':
        deleteStudent();
        break;
      case '6':
        addGradeToStudent();
        break;
      case '7':
        viewTopStudents();
        break;
      case '8':
        running = false;
        break;
      // bonus menu
      case '9':
        filterByClass();
        break;
      case '10':
        classStatistics();
        break;
      case '11':
        handleExportAll();
        break;
      default:
        console.log(chalk.red('❌ Pilihan tidak valid!'));
    }
  }

  console.log(chalk.blue('\nTerima kasih telah menggunakan aplikasi ini!'));
}

// Jalankan aplikasi
main();
