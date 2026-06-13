const request = require('supertest');
const app = require('../../src/app');
const { sequelize, SubCompetition } = require('../../src/models');

describe('Registration Complete REST API Regression Test Suite', () => {
  let subCompId = null;
  let createdRegistrationId = null;

  beforeAll(async () => {
    try {
      // 1. Matikan sementara foreign key check untuk membersihkan data lama
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      for (const modelName of Object.keys(sequelize.models)) {
        await sequelize.models[modelName].destroy({ where: {}, truncate: true, force: true });
      }
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      // 2. Buat data sub kompetisi tiruan
      const sub = await SubCompetition.create({
        name: 'Robotic Competition',
        slug: 'robotic-competition',
        category: 'student',
        registration_fee: 80000.00,
        status: 'open'
      });
      subCompId = sub.id;

    } catch (error) {
      // KUNCI UTAMA: Memaksa log menampilkan detail error validasi/database asli dari MySQL
      console.error("\n🚨 LOG ERROR DATABASE ASLI DI BEFOREALL:\n", error);
      throw error; 
    }
  });

  // Tambahkan ini di paling bawah suite (sebelum penutup describe) untuk fix Jest Open Handles
  afterAll(async () => {
    await sequelize.close();
  });

  // ==========================================
  // SCENARIO 1: POST ENDPOINT (3 TEST CASES)
  // ==========================================

  it('1. POST /api/registrations - Harus sukses mendaftarkan Tim Baru beserta File Lengkap', async () => {
    const payloadData = {
      subCompetitionId: subCompId,
      team: { teamName: 'Sriwijaya Cyber', institution: 'Universitas Sriwijaya' },
      leader: { fullName: 'Budi Utomo', email: 'budi@hrc.com', phoneNumber: '0852110000', identityNumber: '110200000' },
      members: [
        { fullName: 'Siti Aminah', email: 'siti@hrc.com', phoneNumber: '0852120000', identityNumber: '110300000' }
      ]
    };

    const res = await request(app)
      .post('/api/registrations')
      .field('payload', JSON.stringify(payloadData))
      .attach('leaderIdentityCard', Buffer.from('PDF_KETUA_BUFFER'), 'leader_card.pdf')
      .attach('memberIdentityCards', Buffer.from('PDF_ANGGOTA_BUFFER'), 'member_card1.pdf');

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    
    createdRegistrationId = res.body.data.id;
  });

  it('2. POST /api/registrations - Harus gagal (400) jika skema data melanggar validator', async () => {
    const badPayload = {
      subCompetitionId: subCompId,
      team: { teamName: '' },
      leader: { email: 'bukan-email-valid' }
    };

    const res = await request(app)
      .post('/api/registrations')
      .field('payload', JSON.stringify(badPayload));

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('fail');
    expect(res.body).toHaveProperty('errors');
  });

  it('3. POST /api/registrations - Harus gagal (404) jika data valid tapi sub-kompetisi ID tidak ada di DB', async () => {
    const validPayloadWithBadId = {
      subCompetitionId: 99999,
      team: { teamName: 'Phantom Tech', institution: 'Institut Teknologi' },
      leader: { 
        fullName: 'Ghost User', 
        email: 'ghost@hrc.com', 
        phoneNumber: '081234567890',
        identityNumber: '320100000' 
      },
      members: []
    };

    const res = await request(app)
      .post('/api/registrations')
      .field('payload', JSON.stringify(validPayloadWithBadId))
      .attach('leaderIdentityCard', Buffer.from('PDF_KETUA_BUFFER'), 'leader_card.pdf');

    expect(res.statusCode).toEqual(404);
  });

  // ==========================================
  // SCENARIO 2: GET ENDPOINT (3 TEST CASES)
  // ==========================================

  it('4. GET /api/registrations - Harus sukses mengambil seluruh daftar pendaftaran', async () => {
    const res = await request(app).get('/api/registrations');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('5. GET /api/registrations/:id - Harus sukses mengembalikan detail objek berdasarkan ID valid', async () => {
    const res = await request(app).get(`/api/registrations/${createdRegistrationId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('id', createdRegistrationId);
  });

  it('6. GET /api/registrations/:id - Harus gagal (404) jika ID pendaftaran tidak ditemukan', async () => {
    const res = await request(app).get('/api/registrations/888888');
    expect(res.statusCode).toEqual(404);
  });

  // ==========================================
  // SCENARIO 3: PUT ENDPOINT (2 TEST CASES)
  // ==========================================

  it('7. PUT /api/registrations/:id - Harus sukses memperbarui status pendaftaran', async () => {
    const res = await request(app)
      .put(`/api/registrations/${createdRegistrationId}`)
      .send({ registrationStatus: 'verified' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('8. PUT /api/registrations/:id - Harus gagal (404) saat memperbarui ID yang tidak eksis', async () => {
    const res = await request(app)
      .put('/api/registrations/888888')
      .send({ registrationStatus: 'verified' });

    expect(res.statusCode).toEqual(404);
  });

  // ==========================================
  // SCENARIO 4: DELETE ENDPOINT (2 TEST CASES)
  // ==========================================

  it('9. DELETE /api/registrations/:id - Harus sukses melakukan soft delete pendaftaran', async () => {
    const res = await request(app).delete(`/api/registrations/${createdRegistrationId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('10. DELETE /api/registrations/:id - Harus gagal (404) saat mencoba menghapus ID yang tidak ada', async () => {
    const res = await request(app).delete('/api/registrations/888888');
    expect(res.statusCode).toEqual(404);
  });
});