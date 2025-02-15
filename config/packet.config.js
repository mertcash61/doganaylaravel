const packetConfig = {
    types: {
        settings: {
            id: 1,
            name: 'Settings',
            maxSize: 1 * 1024 * 1024, // 1MB
            compression: true,
            validation: true
        },
        message: {
            id: 2,
            name: 'Message',
            maxSize: 5 * 1024 * 1024, // 5MB
            compression: true,
            validation: true
        },
        file: {
            id: 3,
            name: 'File',
            maxSize: 100 * 1024 * 1024, // 100MB
            compression: true,
            validation: true,
            allowedTypes: ['.sql', '.js', '.ts', '.cs', '.java', '.cpp', '.c', '.py', '.php']
        },
        command: {
            id: 4,
            name: 'Command',
            maxSize: 1 * 1024 * 1024, // 1MB
            compression: false,
            validation: true
        }
    },

    validation: {
        checksumEnabled: true,
        checksumAlgorithm: 'SHA-256',
        versionCheck: true,
        sizeCheck: true
    },

    processing: {
        maxConcurrent: 5,
        timeout: 30000, // 30 saniye
        retryAttempts: 3,
        retryDelay: 1000 // 1 saniye
    },

    security: {
        encryption: {
            enabled: true,
            algorithm: 'AES-256-GCM',
            keySize: 256
        },
        signing: {
            enabled: true,
            algorithm: 'RSA-SHA256'
        }
    }
};

export default packetConfig; 