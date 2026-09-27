/* Browser entry point for the EngSphere ES module application. */
import './bootstrap.js'; 

// === TAMBAHKAN LOGIKA NAVIGASI DI BAWAH INI (100% AMAN TANPA POTONG KODE) ===
import { bindNavigation, setView } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Setel seksi awal yang muncul pertama kali saat web dibuka
        setView('landing');

        // Hidupkan pendeteksi klik pada semua tombol data-view / data-goto Anda
        bindNavigation((viewName) => {
            setView(viewName);
        });
        console.log('Sistem Navigasi EngSphere SPA Berhasil Diaktifkan lewat app.js! ✅');
    } catch (error) {
        console.error('Gagal memuat navigasi:', error);
    }
});

