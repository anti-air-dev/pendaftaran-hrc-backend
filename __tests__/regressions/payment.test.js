const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

describe('Payment & Team Management API Regression Test Suite', () => {
  let adminToken = '';
  let dummyRegistrationId = null;
  let dummyTeamId = null;
  let dummyPaymentId = null;

  beforeAll(async () => {
    // 1. Sterilkan Database isi tabel agar bersih
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    const models = Object.keys(sequelize.models);
    for (const modelName of models) {
      await sequelize.models[modelName].destroy({ where: {}, truncate: true, force: true });
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Seeding User Admin untuk kebutuhan hak akses Admin-Only endpoints
    const adminUser = await sequelize.models.User.create({
      full_name: 'Admin Finansial HRC',
      username: 'admin_finance',
      email: 'finance@hrc.com',
      password: 'password_finance_secure',
      role: 'admin',
      status: 'active'
    });

    // Login Admin untuk mendapatkan token JWT resmi
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin_finance', password: 'password_finance_secure' });
    const bodyLogin = loginRes.body.data ? loginRes.body.data : loginRes.body;
    adminToken = bodyLogin.token || '';

    // 3. Siapkan Data Relasi Dependensi (Competition, SubCompetition, Team, & Registration)
    // Ini penting agar proses penarikan data Payment & Team tidak melempar error Relation Constraint Not Found
    const comp = await sequelize.models.Competition.create({
      title: 'Payment Test Competition 2026',
      slug: 'payment-test-competition-2026',
      status: 'published'
    });

    const subComp = await sequelize.models.SubCompetition.create({
      competition_id: comp.id,
      name: 'Network Olympic',
      slug: 'network-olympic',
      category: 'student',
      registration_fee: 50000.00,
      status: 'open'
    });

    const team = await sequelize.models.Team.create({
      team_name: 'Ganesha Tech Team',
      institution: 'Institut Teknologi HRC'
    });
    dummyTeamId = team.id;

    await sequelize.models.TeamMember.create({
      team_id: team.id,
      full_name: 'Anggota Utama',
      email: 'member1@ganesha.com',
      identity_card_path: 'uploads/cards/dummy.pdf',
      role_in_team: 'member',
      verification_status: 'pending'
    });

    const reg = await sequelize.models.Registration.create({
      team_id: team.id,
      sub_competition_id: subComp.id,
      registration_status: 'awaiting_payment'
    });
    dummyRegistrationId = reg.id;
  });

  // ==========================================
  // 1. KELOMPOK PENGUJIAN PEMBAYARAN (PAYMENT)
  // ==========================================

  it('1. POST /api/payments - Harus berhasil mencatat data transaksi pembayaran baru', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({
        registration_id: dummyRegistrationId,
        transaction_id: 'TRX-HRC-2026-0001',
        amount: 50000.00,
        payment_method: 'bank_transfer',
        payment_status: 'pending'
      });

    expect([200, 201]).toContain(res.statusCode);
    const body = res.body.data ? res.body.data : res.body;
    expect(body).toHaveProperty('id');
    dummyPaymentId = body.id;
  });

  it('2. POST /api/payments - Harus gagal (400) jika payload pembayaran tidak lolos validator', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({
        registration_id: dummyRegistrationId,
        transaction_id: '', // Kosong memicu error payment.validator.js
        amount: -100 // Angka minus memicu validasi nominal finansial
      });

    expect(res.statusCode).toEqual(400);
  });

  it('3. GET /api/payments/:id - Harus berhasil mengambil info detail pembayaran', async () => {
    const res = await request(app)
      .get(`/api/payments/${dummyPaymentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
  });

  // ==========================================
  // 2. KELOMPOK PENGUJIAN MANAJEMEN TIM (TEAM)
  // ==========================================

  it('4. GET /api/teams - Harus berhasil mengambil seluruh daftar tim terdaftar', async () => {
    const res = await request(app)
      .get('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    const body = res.body.data ? res.body.data : res.body;
    expect(Array.isArray(body) || Array.isArray(body.rows)).toBe(true);
  });

  it('5. GET /api/teams/:id - Harus berhasil mengambil detail spesifik suatu tim', async () => {
    const res = await request(app)
      .get(`/api/teams/${dummyTeamId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it('6. GET /api/team-members - Harus berhasil menarik seluruh data anggota kelompok untuk keperluan audit verifikasi', async () => {
    const res = await request(app)
      .get('/api/team-members')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
  });
});