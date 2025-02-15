const storageConfig = {
    local: {
        // LocalStorage ayarları
        prefix: 'veri-paketleri-',
        maxSize: 5 * 1024 * 1024, // 5MB
        compression: true
    },

    session: {
        // SessionStorage ayarları
        prefix: 'veri-paketleri-session-',
        maxSize: 1 * 1024 * 1024 // 1MB
    },

    cache: {
        // Önbellek ayarları
        enabled: true,
        maxAge: 60 * 60 * 1000, // 1 saat
        maxItems: 100
    },

    files: {
        // Dosya depolama ayarları
        basePath: './storage',
        temp: './storage/temp',
        uploads: './storage/uploads',
        backups: './storage/backups',
        
        cleanup: {
            enabled: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            schedule: '0 0 * * *' // Her gün gece yarısı
        },

        backup: {
            enabled: true,
            schedule: '0 0 * * 0', // Her pazar gece yarısı
            maxBackups: 10,
            compression: true
        }
    }
};

export default storageConfig; 