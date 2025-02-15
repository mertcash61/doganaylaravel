// Varsayılan ayarlar yapılandırması
const defaultSettings = {
    // Genel Ayarlar
    general: {
        autoBackup: {
            enabled: false,
            interval: 24, // saat cinsinden
            maxBackups: 5,
            location: 'local' // 'local' veya 'cloud'
        },
        darkMode: {
            enabled: false,
            autoSwitch: false, // sistem saatine göre otomatik değiştirme
            startTime: '20:00', // karanlık mod başlangıç saati
            endTime: '06:00' // karanlık mod bitiş saati
        },
        language: 'tr',
        timezone: 'Europe/Istanbul'
    },

    // Depolama Ayarları
    storage: {
        limit: {
            size: 1, // GB cinsinden başlangıç değeri
            maxSize: 1024, // Maksimum 1 TB (1024 GB)
            unit: 'GB',
            warning: 80 // yüzde cinsinden uyarı seviyesi
        },
        autoClean: {
            enabled: false,
            threshold: 90, // yüzde cinsinden temizleme eşiği
            minAge: 30, // gün cinsinden minimum dosya yaşı
            excludedTypes: ['.sql', '.config'] // temizlemeden hariç tutulacak dosya türleri
        },
        compression: {
            enabled: true,
            method: 'gzip',
            level: 6 // 1-9 arası sıkıştırma seviyesi
        }
    },

    // Bildirim Ayarları
    notifications: {
        email: {
            enabled: true,
            frequency: 'daily', // 'instant', 'daily', 'weekly'
            types: ['backup', 'security', 'storage']
        },
        desktop: {
            enabled: true,
            sound: true,
            types: ['upload', 'download', 'warning']
        },
        security: {
            loginAlert: true,
            failedAttempts: true,
            updateNotifications: true
        }
    },

    // Performans Ayarları
    performance: {
        caching: {
            enabled: true,
            duration: 3600, // saniye cinsinden
            maxSize: 100 // MB cinsinden
        },
        optimization: {
            autoOptimize: true,
            compressionLevel: 'medium', // 'low', 'medium', 'high'
            imageQuality: 85 // yüzde cinsinden
        }
    },

    // Güvenlik Ayarları
    security: {
        autoLock: {
            enabled: true,
            timeout: 30 // dakika cinsinden
        },
        twoFactor: {
            enabled: false,
            method: 'email' // 'email', 'sms', 'authenticator'
        },
        encryption: {
            enabled: true,
            method: 'AES-256',
            passwordProtection: false
        }
    }
};

// Ayarları sıfırlama fonksiyonu
function resetToDefaults() {
    return JSON.parse(JSON.stringify(defaultSettings));
}

// Ayarları doğrulama fonksiyonu
function validateSettings(settings) {
    const errors = [];

    // Depolama limiti kontrolü (1 GB ile 1 TB arası)
    if (settings.storage.limit.size < 1 || settings.storage.limit.size > 1024) {
        errors.push('Depolama limiti 1 GB ile 1 TB arasında olmalıdır.');
    }

    // Sıkıştırma seviyesi kontrolü
    if (settings.storage.compression.level < 1 || settings.storage.compression.level > 9) {
        errors.push('Sıkıştırma seviyesi 1-9 arasında olmalıdır.');
    }

    // Bildirim türleri kontrolü
    if (!Array.isArray(settings.notifications.email.types)) {
        errors.push('E-posta bildirim türleri dizi olmalıdır.');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Ayarları dışa aktarma fonksiyonu
function exportSettings() {
    const settings = localStorage.getItem('settings');
    if (settings) {
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `settings_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Ayarları içe aktarma fonksiyonu
function importSettings(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                const validation = validateSettings(settings);
                
                if (validation.isValid) {
                    localStorage.setItem('settings', JSON.stringify(settings));
                    resolve(settings);
                } else {
                    reject(validation.errors);
                }
            } catch (error) {
                reject(['Geçersiz ayar dosyası formatı']);
            }
        };
        reader.onerror = () => reject(['Dosya okuma hatası']);
        reader.readAsText(file);
    });
}

// Modülü dışa aktar
export {
    defaultSettings,
    resetToDefaults,
    validateSettings,
    exportSettings,
    importSettings
}; 