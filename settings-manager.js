// Ayarlar yönetimi için yeni bir modül
class SettingsManager {
    constructor() {
        this.settings = defaultSettings;
        this.loadSettings();
        this.initializeListeners();
    }

    // Ayarları yükle
    loadSettings() {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            try {
                this.settings = JSON.parse(savedSettings);
                this.updateUI();
            } catch (error) {
                console.error('Ayarlar yüklenirken hata:', error);
                this.resetSettings();
            }
        }
    }

    // UI elemanlarını güncelle
    updateUI() {
        // Genel Ayarlar
        document.getElementById('autoBackup').checked = this.settings.general.autoBackup.enabled;
        document.getElementById('darkMode').checked = this.settings.general.darkMode.enabled;

        // Depolama Ayarları
        const storageLimitSelect = document.getElementById('storageLimit');
        storageLimitSelect.value = this.settings.storage.limit.size;
        document.getElementById('autoClean').checked = this.settings.storage.autoClean.enabled;

        // Bildirim Ayarları
        document.getElementById('emailNotif').checked = this.settings.notifications.email.enabled;
        document.getElementById('desktopNotif').checked = this.settings.notifications.desktop.enabled;

        // Karanlık mod kontrolü
        if (this.settings.general.darkMode.enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Event listener'ları başlat
    initializeListeners() {
        // Ayarları kaydet butonu
        document.querySelector('.save-btn').addEventListener('click', () => this.saveSettings());

        // Ayarları sıfırla butonu
        document.querySelector('.reset-btn').addEventListener('click', () => this.resetSettings());

        // Depolama limiti değişikliği
        document.getElementById('storageLimit').addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            // TB'a çevir (GB cinsinden)
            this.settings.storage.limit.size = value * 1024; // 1 TB = 1024 GB
            this.saveSettings();
        });

        // Switch'lerin değişiklik dinleyicileri
        const switches = {
            'autoBackup': 'general.autoBackup.enabled',
            'darkMode': 'general.darkMode.enabled',
            'autoClean': 'storage.autoClean.enabled',
            'emailNotif': 'notifications.email.enabled',
            'desktopNotif': 'notifications.desktop.enabled'
        };

        Object.entries(switches).forEach(([id, path]) => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.updateSettingValue(path, e.target.checked);
                this.saveSettings();
            });
        });
    }

    // Ayarları kaydet
    saveSettings() {
        try {
            const validation = validateSettings(this.settings);
            if (validation.isValid) {
                localStorage.setItem('settings', JSON.stringify(this.settings));
                this.showNotification('Ayarlar başarıyla kaydedildi!', 'success');
                this.updateUI();
            } else {
                this.showNotification(validation.errors.join('\n'), 'error');
            }
        } catch (error) {
            console.error('Ayarlar kaydedilirken hata:', error);
            this.showNotification('Ayarlar kaydedilirken bir hata oluştu!', 'error');
        }
    }

    // Ayarları sıfırla
    resetSettings() {
        if (confirm('Tüm ayarları varsayılana döndürmek istediğinizden emin misiniz?')) {
            this.settings = resetToDefaults();
            this.saveSettings();
            this.updateUI();
            this.showNotification('Ayarlar varsayılana döndürüldü!', 'success');
        }
    }

    // Nested ayar değerini güncelle
    updateSettingValue(path, value) {
        const keys = path.split('.');
        let current = this.settings;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

    // Bildirim göster
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="icon">${type === 'success' ? '✅' : '❌'}</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Sayfa yüklendiğinde ayarlar yöneticisini başlat
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
}); 