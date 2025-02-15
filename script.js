const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Dosya yükleme işlemleri
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');
const progressBar = document.getElementById('progressBar');
const progressText = document.querySelector('.progress-text');
const packageGrid = document.getElementById('packageGrid');

// Depolama alanı yönetimi için değişkenler
const totalStorage = 1024 * 1024 * 1024; // 1 GB toplam alan
let usedStorage = 0;

function updateStorageInfo() {
    const storageInfo = document.createElement('div');
    storageInfo.className = 'storage-info';
    storageInfo.innerHTML = `
        <div class="storage-details">
            <h3>Depolama Alanı</h3>
            <div class="storage-bar">
                <div class="storage-used" style="width: ${(usedStorage / totalStorage) * 100}%"></div>
            </div>
            <div class="storage-text">
                <span>Kullanılan: ${formatFileSize(usedStorage)}</span>
                <span>Toplam: ${formatFileSize(totalStorage)}</span>
            </div>
        </div>
    `;
    
    // Eğer zaten varsa güncelle, yoksa ekle
    const existingInfo = document.querySelector('.storage-info');
    if (existingInfo) {
        existingInfo.replaceWith(storageInfo);
    } else {
        document.querySelector('.packages-section').insertBefore(
            storageInfo, 
            document.querySelector('.package-grid')
        );
    }
}

// Sürükle-bırak olayları
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// Dosya seçme butonu
const browseBtn = document.querySelector('.browse-btn');

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
});

// Dosya seçildiğinde animasyon
browseBtn.addEventListener('mousedown', () => {
    browseBtn.style.transform = 'scale(0.95)';
});

browseBtn.addEventListener('mouseup', () => {
    browseBtn.style.transform = 'scale(1)';
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!isValidFileType(file)) {
            showNotification('Geçersiz dosya türü!', 'error');
            return;
        }

        if (usedStorage + file.size > totalStorage) {
            showNotification('Yetersiz depolama alanı!', 'error');
            return;
        }

        const li = createFileListItem(file);
        uploadedFiles.appendChild(li);
        simulateFileUpload(file, li);
    });
}

function createFileListItem(file) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="file-name">${file.name}</span>
        <span class="file-size">${formatFileSize(file.size)}</span>
        <span class="file-status pending">
            <span class="status-icon">⏳</span>
            <span class="status-text">Yükleniyor...</span>
        </span>
        <div class="file-actions">
            <button class="remove-btn" onclick="removeFile(this)">Sil</button>
        </div>
    `;
    return li;
}

function simulateFileUpload(file, li) {
    const statusSpan = li.querySelector('.file-status');
    const progressBar = document.getElementById('storageProgress');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 10;
        
        if (progress >= 100) {
            clearInterval(interval);
            statusSpan.className = 'file-status success';
            statusSpan.innerHTML = `
                <span class="status-icon">✅</span>
                <span class="status-text">Tamamlandı</span>
            `;
            usedStorage += file.size;
            updateStorageInfo();
        } else if (progress === 50 && Math.random() < 0.1) { // %10 hata olasılığı
            clearInterval(interval);
            statusSpan.className = 'file-status error';
            statusSpan.innerHTML = `
                <span class="status-icon">❌</span>
                <span class="status-text">Hata</span>
            `;
            const actions = li.querySelector('.file-actions');
            actions.innerHTML = `
                <button class="retry-btn" onclick="retryUpload(this)">Tekrar Dene</button>
                <button class="remove-btn" onclick="removeFile(this)">Sil</button>
            `;
        }
        
        progressBar.style.width = `${(usedStorage / totalStorage) * 100}%`;
    }, 300);
}

function removeFile(button) {
    const li = button.closest('li');
    const fileSize = parseFileSize(li.querySelector('.file-size').textContent);
    usedStorage -= fileSize;
    updateStorageInfo();
    li.remove();
}

function retryUpload(button) {
    const li = button.closest('li');
    const fileName = li.querySelector('.file-name').textContent;
    const fileSize = parseFileSize(li.querySelector('.file-size').textContent);
    
    li.querySelector('.file-status').className = 'file-status pending';
    li.querySelector('.file-status').innerHTML = `
        <span class="status-icon">⏳</span>
        <span class="status-text">Yükleniyor...</span>
    `;
    
    simulateFileUpload({ name: fileName, size: fileSize }, li);
}

function parseFileSize(sizeStr) {
    const units = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024
    };
    const [size, unit] = sizeStr.split(' ');
    return parseFloat(size) * units[unit];
}

function isValidFileType(file) {
    const validTypes = ['.sql', '.js', '.ts', '.cs', '.java'];
    return validTypes.some(type => file.name.toLowerCase().endsWith(type));
}

function addPackageToGrid(file) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.innerHTML = `
        <h3>${file.name}</h3>
        <p>Boyut: ${formatFileSize(file.size)}</p>
        <p>Yüklenme Tarihi: ${new Date().toLocaleDateString()}</p>
        <div class="package-actions">
            <button class="download-btn">İndir</button>
            <button class="delete-btn" onclick="deletePackage(this, ${file.size})">Sil</button>
        </div>
    `;
    packageGrid.appendChild(card);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function deletePackage(button, fileSize) {
    if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
        button.closest('.package-card').remove();
        usedStorage -= fileSize;
        updateStorageInfo();
    }
}

// Sayfa yüklendiğinde depolama bilgisini göster
document.addEventListener('DOMContentLoaded', updateStorageInfo);

// Veri paketleri yönetimi için değişkenler ve fonksiyonlar
const packageTypes = {
    SQL: { icon: '📁', color: '#FF6B6B' },
    JavaScript: { icon: '📜', color: '#4ECDC4' },
    TypeScript: { icon: '📘', color: '#45B7D1' },
    CSharp: { icon: '📗', color: '#96CEB4' },
    Java: { icon: '📙', color: '#FFEEAD' }
};

// Örnek veri paketleri
const initialPackages = [
    {
        id: 1,
        name: 'database.mysql.sql',
        type: 'SQL',
        size: 1024 * 512, // 512 KB
        lastModified: new Date('2024-01-15'),
        downloads: 45
    },
    {
        id: 2,
        name: 'models.ts',
        type: 'TypeScript',
        size: 1024 * 128, // 128 KB
        lastModified: new Date('2024-01-16'),
        downloads: 32
    },
    {
        id: 3,
        name: 'Models.cs',
        type: 'CSharp',
        size: 1024 * 256, // 256 KB
        lastModified: new Date('2024-01-17'),
        downloads: 28
    }
];

function initializePackageGrid() {
    const packageGrid = document.getElementById('packageGrid');
    packageGrid.innerHTML = ''; // Grid'i temizle

    initialPackages.forEach(pkg => {
        const card = createPackageCard(pkg);
        packageGrid.appendChild(card);
    });

    updateTotalStats();
}

function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.style.borderLeft = `4px solid ${packageTypes[pkg.type].color}`;
    
    card.innerHTML = `
        <div class="package-header">
            <span class="package-icon">${packageTypes[pkg.type].icon}</span>
            <h3 class="package-name">${pkg.name}</h3>
        </div>
        <div class="package-info">
            <p class="package-type">${pkg.type}</p>
            <p class="package-size">${formatFileSize(pkg.size)}</p>
            <p class="package-date">Son güncelleme: ${pkg.lastModified.toLocaleDateString()}</p>
            <p class="package-downloads">İndirilme: ${pkg.downloads}</p>
        </div>
        <div class="package-actions">
            <button class="download-btn" onclick="downloadPackage(${pkg.id})">
                <span class="icon">⬇️</span> İndir
            </button>
            <button class="delete-btn" onclick="deletePackage(${pkg.id})">
                <span class="icon">🗑️</span> Sil
            </button>
        </div>
    `;
    
    return card;
}

function updateTotalStats() {
    const totalSize = initialPackages.reduce((acc, pkg) => acc + pkg.size, 0);
    const totalDownloads = initialPackages.reduce((acc, pkg) => acc + pkg.downloads, 0);
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'package-stats';
    statsDiv.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <h4>Toplam Paket</h4>
                <p>${initialPackages.length}</p>
            </div>
            <div class="stat-item">
                <h4>Toplam Boyut</h4>
                <p>${formatFileSize(totalSize)}</p>
            </div>
            <div class="stat-item">
                <h4>Toplam İndirme</h4>
                <p>${totalDownloads}</p>
            </div>
        </div>
    `;
    
    const packagesSection = document.querySelector('.packages-section');
    const existingStats = packagesSection.querySelector('.package-stats');
    
    if (existingStats) {
        existingStats.replaceWith(statsDiv);
    } else {
        packagesSection.insertBefore(statsDiv, packageGrid);
    }
}

function downloadPackage(id) {
    const pkg = initialPackages.find(p => p.id === id);
    if (pkg) {
        // İndirme sayacını artır
        pkg.downloads++;
        updateTotalStats();

        // Dosya türüne göre içerik oluştur
        let content = '';
        switch (pkg.type) {
            case 'SQL':
                content = generateSQLContent(pkg);
                break;
            case 'JavaScript':
                content = generateJSContent(pkg);
                break;
            case 'TypeScript':
                content = generateTSContent(pkg);
                break;
            case 'CSharp':
                content = generateCSContent(pkg);
                break;
            case 'Java':
                content = generateJavaContent(pkg);
                break;
        }

        // Dosyayı indir
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pkg.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Kullanıcıya bilgi ver
        showDownloadNotification(pkg.name);
    }
}

// İndirme bildirimi göster
function showDownloadNotification(fileName) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="icon">✅</span>
            <span>${fileName} başarıyla indirildi</span>
        </div>
    `;
    document.body.appendChild(notification);

    // 3 saniye sonra bildirimi kaldır
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Örnek içerik oluşturma fonksiyonları
function generateSQLContent(pkg) {
    return `-- ${pkg.name}
-- Created: ${pkg.lastModified.toLocaleDateString()}

CREATE TABLE example (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
}

function generateJSContent(pkg) {
    return `// ${pkg.name}
// Created: ${pkg.lastModified.toLocaleDateString()}

class Example {
    constructor() {
        this.name = "Example";
    }
}

module.exports = Example;`;
}

function generateTSContent(pkg) {
    return `// ${pkg.name}
// Created: ${pkg.lastModified.toLocaleDateString()}

interface IExample {
    name: string;
}

class Example implements IExample {
    name: string;

    constructor() {
        this.name = "Example";
    }
}

export default Example;`;
}

function generateCSContent(pkg) {
    return `// ${pkg.name}
// Created: ${pkg.lastModified.toLocaleDateString()}

using System;

namespace Example {
    public class ExampleClass {
        public string Name { get; set; }

        public ExampleClass() {
            Name = "Example";
        }
    }
}`;
}

function generateJavaContent(pkg) {
    return `// ${pkg.name}
// Created: ${pkg.lastModified.toLocaleDateString()}

package example;

public class Example {
    private String name;

    public Example() {
        this.name = "Example";
    }

    public String getName() {
        return name;
    }
}`;
}

function deletePackage(id) {
    if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
        const index = initialPackages.findIndex(p => p.id === id);
        if (index !== -1) {
            initialPackages.splice(index, 1);
            initializePackageGrid();
        }
    }
}

// Sayfa yüklendiğinde paketleri göster
document.addEventListener('DOMContentLoaded', initializePackageGrid);

// Ayarlar yönetimi
let settings = {
    autoBackup: false,
    darkMode: false,
    storageLimit: 1,
    autoClean: false,
    emailNotif: true,
    desktopNotif: true
};

// Sayfa yüklendiğinde ayarları yükle
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initializeSettings();
});

function loadSettings() {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }
}

function initializeSettings() {
    // Checkbox'ları ayarla
    document.getElementById('autoBackup').checked = settings.autoBackup;
    document.getElementById('darkMode').checked = settings.darkMode;
    document.getElementById('autoClean').checked = settings.autoClean;
    document.getElementById('emailNotif').checked = settings.emailNotif;
    document.getElementById('desktopNotif').checked = settings.desktopNotif;

    // Select box'ı ayarla
    document.getElementById('storageLimit').value = settings.storageLimit;

    // Karanlık mod kontrolü
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function saveSettings() {
    // Ayarları güncelle
    settings.autoBackup = document.getElementById('autoBackup').checked;
    settings.darkMode = document.getElementById('darkMode').checked;
    settings.storageLimit = document.getElementById('storageLimit').value;
    settings.autoClean = document.getElementById('autoClean').checked;
    settings.emailNotif = document.getElementById('emailNotif').checked;
    settings.desktopNotif = document.getElementById('desktopNotif').checked;

    // LocalStorage'a kaydet
    localStorage.setItem('settings', JSON.stringify(settings));

    // Karanlık mod kontrolü
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Bildirim göster
    showNotification('Ayarlar başarıyla kaydedildi!');
}

function resetSettings() {
    if (confirm('Tüm ayarları varsayılana döndürmek istediğinizden emin misiniz?')) {
        settings = {
            autoBackup: false,
            darkMode: false,
            storageLimit: 1,
            autoClean: false,
            emailNotif: true,
            desktopNotif: true
        };

        localStorage.setItem('settings', JSON.stringify(settings));
        initializeSettings();
        showNotification('Ayarlar varsayılana döndürüldü!');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `settings-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="icon">✅</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
