Sanity -> Neon Backup & Sync Service

Project ini bertujuan untuk melakukan backup daata dari Santiy CMS ke dalam databse PostgreSQL(NEON). 

Solsui ini sementara digunakan dikarenakan Backup Data yang disediakan oleh Sanity CMS Berbayar.

Dengan project ini maka seluruh data dari Sanity akan:
- Sync ke Neon PostgreSQL
- Disimpan dalam format JSONB
- Dapat di backup, di query, dan di restore kapan saja

TUJUAN UTAMA
- Untuk menyediakan backup mandiri untuk data sanity 
- Mengurangi resiko kehilangan data
- Memungkinkan query data langsung via PostgreSQL

CARA KERJA
Santiy CSM  (API Fetch) -> Vercel API Route (/api/sync) (sinkronisasi) -> Neon PostgreSQL (sanity_document)

Sanity CMS: Sumber data utama (content management)
Vercel: Untuk menjalankan API Endpoint untuk proses sinkronisasi
Neon PostgreSQL: Menyimpan data backup dalam bentuk JSONB

ENVIRONMENT VARIABLES
Project ini membutuhkan environment variable sebagai berikut: 

-DATABSE_URL=postgresql://....
-SANTIY_TOKEN=sk...

Cara Menjalankan Backup:
- Akses endpoint melalui link deployment vercel dan tambahkan /api/sync
- Response sukses : 
{
    "ok":true,
    "sync":total_data
}

Berikut untuk link untuk dokumentasi : https://jam.dev/c/a7192b49-9b73-4bcf-8cd0-c7ae11bde1a8