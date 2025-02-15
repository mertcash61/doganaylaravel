<?php

namespace DataPackets;

class FileManager
{
    private $storageBasePath;
    private $allowedTypes;
    private $maxFileSize;
    private $totalStorageLimit;

    public function __construct()
    {
        $this->storageBasePath = dirname(__DIR__) . '/storage';
        $this->allowedTypes = [
            'sql'    => 'application/sql',
            'js'     => 'application/javascript',
            'ts'     => 'application/typescript',
            'cs'     => 'text/x-csharp',
            'java'   => 'text/x-java-source',
            'pas'    => 'text/x-pascal',
            'bas'    => 'text/x-basic',
            'c'      => 'text/x-c',
            'cpp'    => 'text/x-c++',
            'cbl'    => 'text/x-cobol',
            'pl'     => 'text/x-perl',
            'php'    => 'application/x-php',
            'py'     => 'text/x-python',
            'ada'    => 'text/x-ada',
            'f'      => 'text/x-fortran',
            'dpr'    => 'text/x-delphi',
            'swift'  => 'text/x-swift'
        ];
        $this->maxFileSize = 1024 * 1024 * 1024; // 1 GB maksimum dosya boyutu
        $this->totalStorageLimit = 1024 * 1024 * 1024 * 1024; // 1 TB toplam depolama limiti
    }

    public function uploadFile($file)
    {
        try {
            $this->validateFile($file);
            
            $fileName = $this->sanitizeFileName($file['name']);
            $filePath = $this->storageBasePath . '/' . $fileName;
            
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                throw new \Exception('Dosya yüklenirken bir hata oluştu.');
            }

            return [
                'success' => true,
                'message' => 'Dosya başarıyla yüklendi.',
                'data' => [
                    'name' => $fileName,
                    'size' => $file['size'],
                    'type' => $file['type'],
                    'path' => $filePath
                ]
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function validateFile($file)
    {
        // Dosya yükleme hatası kontrolü
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception('Dosya yüklenirken bir hata oluştu: ' . $this->getUploadErrorMessage($file['error']));
        }

        // Dosya boyutu kontrolü (1 GB limit)
        if ($file['size'] > $this->maxFileSize) {
            throw new \Exception('Dosya boyutu çok büyük. Maksimum dosya boyutu: 1 GB');
        }

        // Dosya türü kontrolü
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!array_key_exists($extension, $this->allowedTypes)) {
            throw new \Exception('Geçersiz dosya türü. İzin verilen türler: ' . implode(', ', array_keys($this->allowedTypes)));
        }

        // Toplam depolama alanı kontrolü (1 TB limit)
        if ($this->getCurrentStorageSize() + $file['size'] > $this->totalStorageLimit) {
            throw new \Exception('Yetersiz depolama alanı. Maksimum depolama alanı: 1 TB');
        }
    }

    public function deleteFile($fileName)
    {
        $filePath = $this->storageBasePath . '/' . $fileName;
        
        if (!file_exists($filePath)) {
            return [
                'success' => false,
                'message' => 'Dosya bulunamadı.'
            ];
        }

        if (unlink($filePath)) {
            return [
                'success' => true,
                'message' => 'Dosya başarıyla silindi.'
            ];
        }

        return [
            'success' => false,
            'message' => 'Dosya silinirken bir hata oluştu.'
        ];
    }

    public function getStorageInfo()
    {
        $currentSize = $this->getCurrentStorageSize();
        
        return [
            'used' => $currentSize,
            'total' => $this->totalStorageLimit,
            'available' => $this->totalStorageLimit - $currentSize,
            'usedFormatted' => $this->formatFileSize($currentSize),
            'totalFormatted' => $this->formatFileSize($this->totalStorageLimit),
            'percentage' => round(($currentSize / $this->totalStorageLimit) * 100, 2)
        ];
    }

    private function getCurrentStorageSize()
    {
        $totalSize = 0;
        foreach (glob($this->storageBasePath . '/*') as $file) {
            if (is_file($file)) {
                $totalSize += filesize($file);
            }
        }
        return $totalSize;
    }

    private function sanitizeFileName($fileName)
    {
        // Güvenli dosya adı oluştur
        $fileName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $fileName);
        $fileName = time() . '_' . $fileName;
        return $fileName;
    }

    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    private function getUploadErrorMessage($errorCode)
    {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'Dosya boyutu PHP yapılandırma limitini aşıyor.',
            UPLOAD_ERR_FORM_SIZE => 'Dosya boyutu form limitini aşıyor.',
            UPLOAD_ERR_PARTIAL => 'Dosya kısmen yüklendi.',
            UPLOAD_ERR_NO_FILE => 'Dosya yüklenmedi.',
            UPLOAD_ERR_NO_TMP_DIR => 'Geçici klasör bulunamadı.',
            UPLOAD_ERR_CANT_WRITE => 'Dosya diske yazılamadı.',
            UPLOAD_ERR_EXTENSION => 'Bir PHP uzantısı dosya yüklemesini durdurdu.'
        ];
        
        return isset($errorMessages[$errorCode]) 
            ? $errorMessages[$errorCode] 
            : 'Bilinmeyen bir hata oluştu.';
    }
} 