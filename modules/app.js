
import './bootstrap.js'; 

// Impor fungsi inti agar bisa ditempelkan ke window global
import { bindNavigation, setView } from './navigation.js';
import { openAuthModal } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Tempelkan fungsi ke window agar file auth.js bisa membacanya tanpa eror
        window.setView = setView;
        window.openAuthModal = openAuthModal;

        // Setel tampilan awal aplikasi
        setView('landing');

        // Ambil tombol berdasarkan ID asli dari index.html
        const getStartedBtn = document.getElementById('getStartedBtn');
        const landingSignUpBtn = document.getElementById('landingSignUpBtn');
        const landingLoginBtn = document.getElementById('landingLoginBtn');
        const landingHeroLoginBtn = document.getElementById('landingHeroLoginBtn');

        // Kaitkan klik tombol langsung ke fungsi pembuka modal di auth.js
        if (getStartedBtn) getStartedBtn.addEventListener('click', () => openAuthModal('signup'));
        if (landingSignUpBtn) landingSignUpBtn.addEventListener('click', () => openAuthModal('signup'));
        if (landingLoginBtn) landingLoginBtn.addEventListener('click', () => openAuthModal('login'));
        if (landingHeroLoginBtn) landingHeroLoginBtn.addEventListener('click', () => openAuthModal('login'));

        console.log('Sistem Navigasi Global EngSphere Berhasil Diaktifkan! ✅');
    } catch (error) {
        console.error('Gagal mengaktifkan navigasi global:', error);
    }
});
