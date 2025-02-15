class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeKey = 'preferred-theme';
        this.initialize();
        this.setupThemeToggle();
    }

    initialize() {
        // Kayıtlı temayı yükle
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Sistem temasını kontrol et
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            }
        }

        // Tema değişikliği dinleyicisi
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(this.themeKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            // Tema durumuna göre başlangıç görünümünü ayarla
            this.updateToggleAppearance(toggle);

            toggle.addEventListener('click', () => {
                this.toggleTheme();
                this.updateToggleAppearance(toggle);
            });
        }
    }

    updateToggleAppearance(toggle) {
        const icon = toggle.querySelector('.icon') || document.createElement('div');
        icon.className = 'icon';
        
        if (!toggle.querySelector('.icon')) {
            toggle.appendChild(icon);
        }

        // Tema durumuna göre icon pozisyonunu ayarla
        if (this.currentTheme === 'dark') {
            icon.style.transform = 'translateX(30px)';
            icon.innerHTML = '🌙';
        } else {
            icon.style.transform = 'translateX(0)';
            icon.innerHTML = '☀️';
        }
    }

    setTheme(theme) {
        // Eski tema linkini kaldır
        const oldThemeLink = document.getElementById('theme-stylesheet');
        if (oldThemeLink) {
            oldThemeLink.remove();
        }

        // Yeni tema linkini ekle
        const newThemeLink = document.createElement('link');
        newThemeLink.id = 'theme-stylesheet';
        newThemeLink.rel = 'stylesheet';
        newThemeLink.href = `themes/${theme}-theme.css`;
        document.head.appendChild(newThemeLink);

        // Temayı kaydet
        this.currentTheme = theme;
        localStorage.setItem(this.themeKey, theme);

        // Body'ye tema sınıfını ekle
        document.body.className = `theme-${theme}`;

        // Özel olay tetikle
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);

        // Tema değişikliğinde toggle görünümünü güncelle
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            this.updateToggleAppearance(toggle);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Tema yöneticisini oluştur
const themeManager = new ThemeManager();

// Tema değişikliği butonu için örnek kullanım
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Mevcut butonu yeni tasarımla değiştir
        themeToggle.innerHTML = '<div class="icon"></div>';
        themeToggle.classList.add('theme-toggle');
    }

    // Tema değişikliğini dinle
    document.addEventListener('themeChanged', (e) => {
        console.log(`Tema değiştirildi: ${e.detail.theme}`);
        // Burada tema değişikliğine göre ek işlemler yapabilirsiniz
    });
}); 