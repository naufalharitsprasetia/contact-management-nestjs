# Architecture Pattern

Project ini menggunakan Feature-Based Modular Architecture dengan pendekatan Layered Pattern (Controller → Service → Validation → Database).

## Setiap fitur utama seperti user, contact, dan address memiliki module-nya sendiri yang berisi:

- Controller — menangani HTTP request & response
- Service — berisi business logic utama
- Validation — memastikan data yang masuk sesuai schema
- Module — mendaftarkan dependency & service ke dalam sistem NestJS

## Selain itu, folder common/ digunakan untuk menampung komponen global seperti:

- PrismaService → koneksi database global
- Auth Middleware / Decorator → untuk proteksi route
- ValidationService → validasi reusable
- Error Filter → menangani error agar format respons seragam

## Alasan Menggunakan Pattern Ini

### Feature-Oriented Structure

Setiap fitur berdiri sendiri. Hal ini memudahkan scaling, refactor, dan kolaborasi antar tim.

### Clear Separation of Concerns

Controller tidak berisi business logic, dan service tidak berurusan dengan HTTP. Semua punya tanggung jawab jelas.

#### Maintainable & Scalable

Mudah menambah fitur baru tanpa merusak struktur lama — cukup tambahkan folder module baru.

### Testability Tinggi

Karena setiap layer terpisah, sangat mudah untuk membuat unit test dan e2e test per module.

### Clean & Consistent Codebase

Struktur modular membuat kode seragam dan mudah dipahami oleh developer baru.
