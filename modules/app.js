import './bootstrap.js'; 

// 1. Impor fungsi setView untuk landing, dan openAuthModal dari auth.js
import { setView } from './navigation.js';
import { openAuthModal } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Kunci tampilan awal agar web membuka seksi 'landing'
        setView('landing');

        // 2. AMBIL TOMBOL LANDING PAGE LANGSUNG BERDASARKAN ID NYA
        const getStartedBtn = document.getElementById('getStartedBtn');
        const landingSignUpBtn = document.getElementById('landingSignUpBtn');
        const landingLoginBtn = document.getElementById('landingLoginBtn');
        const landingHeroLoginBtn = document.getElementById('landingHeroLoginBtn');

        // 3. PASANG EVENT LISTENER UNTUK MEMBUKA POP-UP MODAL SEARA INSTAN
        // Pemicu untuk form Sign Up
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => openAuthModal('signup'));
        }
        if (landingSignUpBtn) {
            landingSignUpBtn.addEventListener('click', () => openAuthModal('signup'));
        }

        // Pemicu untuk form Log In
        if (landingLoginBtn) {
            landingLoginBtn.addEventListener('click', () => openAuthModal('login'));
        }
        if (landingHeroLoginBtn) {
            landingHeroLoginBtn.addEventListener('click', () => openAuthModal('login'));
        }

        console.log('Sistem Tombol Pemicu Modal Auth EngSphere Berhasil Aktif! ✅');
    } catch (error) {
        console.error('Gagal mengaktifkan tombol auth:', error);
    }
});
