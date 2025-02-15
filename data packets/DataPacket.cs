using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace NetworkCommunication
{
    // Paket tiplerini belirten enum
    public enum PacketType
    {
        Settings = 1,
        Message = 2,
        File = 3,
        Command = 4
    }

    public class DataPacket
    {
        // Paketin başlık bilgisi
        public byte[] Header { get; private set; }
        
        // Paketin içerdiği veri
        public byte[] Payload { get; private set; }
        
        // Paketin toplam boyutu
        public int PacketSize => Header.Length + Payload.Length;

        // Ayarlar için yeni özellikler
        public Dictionary<string, object> Settings { get; private set; }

        // Paket tipi özelliği eklendi
        public PacketType Type { get; private set; }
        
        // Paket versiyonu
        public byte Version { get; private set; } = 1;
        
        // Checksum için özellik
        public uint Checksum { get; private set; }

        public DataPacket(PacketType type, byte[] payload)
        {
            Type = type;
            Payload = payload;
            
            // Başlık şimdi 9 byte: 4 (boyut) + 1 (versiyon) + 4 (checksum)
            Header = new byte[9];
            BitConverter.GetBytes(payload.Length).CopyTo(Header, 0);
            Header[4] = Version;
            
            // Checksum hesapla
            Checksum = CalculateChecksum(payload);
            BitConverter.GetBytes(Checksum).CopyTo(Header, 5);
        }

        // Checksum hesaplama
        private uint CalculateChecksum(byte[] data)
        {
            uint sum = 0;
            for (int i = 0; i < data.Length; i++)
            {
                sum += data[i];
            }
            return sum;
        }

        // Paketi doğrula
        public bool ValidatePacket()
        {
            uint calculatedChecksum = CalculateChecksum(Payload);
            return calculatedChecksum == Checksum;
        }

        // Ayarları pakete dönüştürmek için yardımcı metod
        public static DataPacket CreateFromSettings(Dictionary<string, object> settings)
        {
            string jsonSettings = JsonSerializer.Serialize(settings);
            byte[] settingsData = new byte[Payload.Length + 1];
            settingsData[0] = (byte)PacketType.Settings;
            Encoding.UTF8.GetBytes(jsonSettings).CopyTo(settingsData, 1);
            
            return new DataPacket(PacketType.Settings, settingsData);
        }

        // Paketten ayarları almak için yardımcı metod
        public Dictionary<string, object> GetSettings()
        {
            string jsonSettings = Encoding.UTF8.GetString(Payload);
            return JsonSerializer.Deserialize<Dictionary<string, object>>(jsonSettings);
        }

        // Tekil ayar değerini almak için yardımcı metod
        public T GetSettingValue<T>(string key)
        {
            var settings = GetSettings();
            if (settings.ContainsKey(key))
            {
                return (T)settings[key];
            }
            throw new KeyNotFoundException($"'{key}' ayarı bulunamadı.");
        }

        // Ayar değerini güncellemek için yardımcı metod
        public void UpdateSetting(string key, object value)
        {
            var settings = GetSettings();
            settings[key] = value;
            string jsonSettings = JsonSerializer.Serialize(settings);
            Payload = Encoding.UTF8.GetBytes(jsonSettings);
            BitConverter.GetBytes(Payload.Length).CopyTo(Header, 0);
        }

        // String verisini pakete dönüştürmek için yardımcı metod
        public static DataPacket CreateFromString(string message)
        {
            byte[] payload = Encoding.UTF8.GetBytes(message);
            return new DataPacket(PacketType.Message, payload);
        }

        // Paketi byte dizisine dönüştür
        public byte[] ToByteArray()
        {
            byte[] packet = new byte[PacketSize];
            Header.CopyTo(packet, 0);
            Payload.CopyTo(packet, Header.Length);
            return packet;
        }

        // Byte dizisinden paket oluştur
        public static DataPacket FromByteArray(byte[] data)
        {
            if (data.Length < 9)
                throw new ArgumentException("Geçersiz paket verisi - Başlık eksik");

            int payloadLength = BitConverter.ToInt32(data, 0);
            byte version = data[4];
            uint checksum = BitConverter.ToUInt32(data, 5);

            if (data.Length < 9 + payloadLength)
                throw new ArgumentException("Geçersiz paket verisi - Eksik veri");

            byte[] payload = new byte[payloadLength];
            Array.Copy(data, 9, payload, 0, payloadLength);

            // Paket tipini ilk byte'dan belirle
            PacketType type = (PacketType)payload[0];
            
            var packet = new DataPacket(type, payload);
            
            if (!packet.ValidatePacket())
                throw new Exception("Paket doğrulama hatası - Checksum eşleşmiyor");

            return packet;
        }

        // Paketteki veriyi string olarak al
        public string GetMessageAsString()
        {
            return Encoding.UTF8.GetString(Payload);
        }

        // Veriyi paket tipine göre al
        public object GetData()
        {
            // İlk byte'ı atla (paket tipi)
            byte[] actualData = new byte[Payload.Length - 1];
            Array.Copy(Payload, 1, actualData, 0, Payload.Length - 1);

            switch (Type)
            {
                case PacketType.Settings:
                    string jsonSettings = Encoding.UTF8.GetString(actualData);
                    return System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonSettings);
                
                case PacketType.Message:
                    return Encoding.UTF8.GetString(actualData);
                
                case PacketType.File:
                    return actualData;
                
                default:
                    throw new NotSupportedException($"Desteklenmeyen paket tipi: {Type}");
            }
        }
    }
} 