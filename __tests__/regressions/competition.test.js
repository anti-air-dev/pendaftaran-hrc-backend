const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

describe('Competition & Sub-Competition API Regression Test Suite', () => {
  let adminToken = '';
  let createdCompetitionSlug = '';
  let createdSubCompetitionSlug = '';

  beforeAll(async () => {
    // 1. Bersihkan database agar kembali steril
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    const models = Object.keys(sequelize.models);
    for (const modelName of models) {
      await sequelize.models[modelName].destroy({ where: {}, truncate: true, force: true });
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Buat akun admin langsung di database untuk simulasi hak akses protected route
    const adminUser = await sequelize.models.User.create({
      full_name: 'Admin HRC',
      username: 'admin_hrc',
      email: 'admin@hrc.com',
      password: 'hashed_password_placeholder_atau_asli', // Sesuaikan jika ada enkripsi manual
      role: 'admin',
      status: 'active'
    });

    // 3. Login untuk mengambil token admin resmi dari aplikasi kamu
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        username: 'admin_hrc',
        password: 'hashed_password_placeholder_atau_asli' // Sesuaikan dengan mekanisme login-mu
      });
    
    const body = loginRes.body.data ? loginRes.body.data : loginRes.body;
    adminToken = body.token || '';
  });

  // ==========================================
  // 1. KELOMPOK PENGUJIAN KOMPETISI (COMPETITION)
  // ==========================================

  it('1. POST /api/competitions - Harus berhasil membuat kompetisi baru (Admin)', async () => {
    const res = await request(app)
      .post('/api/competitions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'UI/UX Design Competition HRC 2026',
        slug: 'uiux-design-competition-hrc-2026',
        description: 'Perlombaan mendesain antarmuka aplikasi tingkat nasional.',
        start_date: '2026-07-01',
        end_date: '2026-08-01',
        status: 'published'
      });

    expect([200, 201]).toContain(res.statusCode);
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('slug');
    createdCompetitionSlug = body.slug; // Amankan slug untuk test GET detail
  });

  it('2. POST /api/competitions - Harus gagal (400) jika skema data melanggar validator', async () => {
    const res = await request(app)
      .post('/api/competitions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '', // Judul kosong memicu error validator
        slug: 'slug-invalid-tanpa-title'
      });

    expect(res.statusCode).toEqual(400);
  });

  it('3. GET /api/competitions - Harus berhasil mengambil seluruh daftar kompetisi', async () => {
    const res = await request(app).get('/api/competitions');
    expect(res.statusCode).toEqual(200);
    
    const body = res.body.data ? res.body.data : res.body;
    expect(Array.isArray(body) || Array.isArray(body.rows)).toBe(true);
  });

  it('4. GET /api/competitions/:slug - Harus berhasil mengambil detail kompetisi berdasarkan slug', async () => {
    const res = await request(app).get(`/api/competitions/${createdCompetitionSlug}`);
    expect(res.statusCode).toEqual(200);
    
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('slug', createdCompetitionSlug);
  });

  it('5. GET /api/competitions/:slug - Harus gagal/mengembalikan 404 jika slug tidak eksis', async () => {
    const res = await request(app).get('/api/competitions/slug-palsu-yang-tidak-ada-di-db');
    // Memaksa jalurnya masuk ke penanganan 'Data Not Found' (mengcover baris catch/if-empty)
    expect([404, 500]).toContain(res.statusCode);
  });


  // ==========================================
  // 2. KELOMPOK PENGUJIAN SUB-KOMPETISI (SUB-COMPETITION)
  // ==========================================

  it('6. POST /api/sub-competitions - Harus berhasil membuat sub-kompetisi baru terkait kompetisi utama', async () => {
    // Cari kompetisi yang tadi dibuat untuk mendapatkan ID aslinya
    const comp = await sequelize.models.Competition.findOne({ where: { slug: createdCompetitionSlug } });

    const res = await request(app)
      .post('/api/sub-competitions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        competition_id: comp.id,
        name: 'Mobile UI/UX Design',
        slug: 'mobile-uiux-design',
        category: 'college',
        min_participants: 1,
        max_participants: 3,
        registration_fee: 75000.00,
        status: 'open'
      });

    expect([200, 201]).toContain(res.statusCode);
    const body = res.body.data ? res.body.data : res.body;
    createdSubCompetitionSlug = body.slug || 'mobile-uiux-design';
  });

  it('7. GET /api/sub-competitions - Harus berhasil mengambil seluruh daftar sub-kompetisi', async () => {
    const res = await request(app).get('/api/sub-competitions');
    expect(res.statusCode).toEqual(200);
    
    const body = res.body.data ? res.body.data : res.body;
    expect(Array.isArray(body) || Array.isArray(body.rows)).toBe(true);
  });

  it('8. GET /api/sub-competitions/:slug - Harus berhasil mengambil detail sub-kompetisi', async () => {
    const res = await request(app).get(`/api/sub-competitions/${createdSubCompetitionSlug}`);
    expect(res.statusCode).toEqual(200);
  });
});