const appConfig = {
    // Uygulama temel ayarları
    app: {
        name: 'Veri Paketleri Yönetimi',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
        apiUrl: process.env.API_URL || 'http://localhost:3000/api'
    },

    // Tema ayarları
    theme: {
        defaultTheme: 'light',
        availableThemes: ['light', 'dark'],
        storageKey: 'preferred-theme'
    },

    // Depolama ayarları
    storage: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedFileTypes: ['.sql', '.js', '.ts', '.cs', '.java', '.cpp', '.c', '.py', '.php'],
        maxTotalStorage: 1024 * 1024 * 1024 * 1024, // 1TB
        autoCleanupEnabled: true,
        backupEnabled: true
    },

    // Paket ayarları
    packets: {
        maxPacketSize: 10 * 1024 * 1024, // 10MB
        compressionEnabled: true,
        encryptionEnabled: true,
        checksumValidation: true
    }
};

export default appConfig; 