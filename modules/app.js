
import './bootstrap.js'; 


import { bindNavigation, setView } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
       
        setView('landing');

        
        bindNavigation((viewName) => {
            setView(viewName);
        });
        console.log('Sistem Navigasi EngSphere SPA Berhasil Diaktifkan lewat app.js! ✅');
    } catch (error) {
        console.error('Gagal memuat navigasi:', error);
    }
});

