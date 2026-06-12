const request = require('supertest');
const app = require('../../src/app'); 
const { sequelize } = require('../../src/models');

describe('Auth & User API Regression Test Suite', () => {
  let authToken = '';

  beforeAll(async () => {
    // Bersihkan database secara aman sebelum tes dimulai
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    const models = Object.keys(sequelize.models);
    for (const modelName of models) {
      await sequelize.models[modelName].destroy({ where: {}, truncate: true, force: true });
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  // --- KELOMPOK REGISTRASI ---
  it('1. POST /api/users/register - Harus berhasil mendaftarkan pengguna baru', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        full_name: 'Damaru Administrator',
        username: 'damaru_admin',
        email: 'admin@hrc.com',
        password: 'PasswordSuper123!',
        password_confirmation: 'PasswordSuper123!',
        role: 'admin'
      });

    expect(res.statusCode).toEqual(201);
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('username', 'damaru_admin');
  });

  it('2. POST /api/users/register - Harus gagal (400) jika field tidak lengkap / validator memicu error', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        full_name: 'Damaru Gagal',
        username: '', // Username kosong memicu validator
        email: 'email-tidak-valid', // Format email salah memicu validator
        password: '123'
      });

    expect(res.statusCode).toEqual(400);
  });

  // --- KELOMPOK LOGIN ---
  it('3. POST /api/users/login - Harus berhasil login dan mengembalikan token JWT', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'damaru_admin',
        password: 'PasswordSuper123!'
      });

    expect(res.statusCode).toEqual(200);
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('token');
    
    // Simpan token untuk pengujian auth middleware di test case berikutnya
    authToken = body.token;
  });

  it('4. POST /api/users/login - Harus gagal jika password salah', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'damaru_admin',
        password: 'PasswordYangSalah!'
      });

    // Menghandle Uncovered Lines di blok catch/kondisi error service login
    expect([400, 401]).toContain(res.statusCode); 
  });

  // --- KELOMPOK PROTECTED ROUTES (Menguji Auth Middleware) ---
  it('5. GET /api/users/me - Harus berhasil mengakses profil jika membawa token valid', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`); // Menguji auth.middleware lewat headers

    expect(res.statusCode).toEqual(200);
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('email', 'admin@hrc.com');
  });

  it('6. GET /api/users/me - Harus gagal (401) jika tidak membawa token Authorization', async () => {
    const res = await request(app)
      .get('/api/users/me');

    expect(res.statusCode).toEqual(401);
  });
});