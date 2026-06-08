// Keluar dari folder 'services', keluar dari '__tests__', masuk ke 'src'
const CompetitionService = require('../../src/services/competition.service');
const CompetitionRepository = require('../../src/repositories/competition.repository');

// Mocking harus menggunakan path yang sama persis dengan require-nya
jest.mock('../../src/repositories/competition.repository');

describe('CompetitionService Unit Tests', () => {
  
  // Bersihkan semua mock data sebelum pindah ke test berikutnya
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Group Test: createCompetition ---
  describe('createCompetition()', () => {
    it('harus berhasil membuat kompetisi jika data valid', async () => {
      const payload = {
        name: "Lomba Web Design",
        start_date: "2026-06-01",
        end_date: "2026-06-10"
      };

      // Mocking return value dari repository
      CompetitionRepository.create.mockResolvedValue({ id: 1, ...payload });

      const result = await CompetitionService.createCompetition(payload);

      expect(result).toHaveProperty('id', 1);
      expect(result.name).toBe(payload.name);
      expect(CompetitionRepository.create).toHaveBeenCalledTimes(1);
    });

    it('harus throw error jika tanggal mulai lebih besar dari tanggal selesai', async () => {
      const payload = {
        name: "Lomba Invalid",
        start_date: "2026-06-15",
        end_date: "2026-06-10" // Tanggal selesai lebih duluan
      };n

      await expect(CompetitionService.createCompetition(payload))
        .rejects.toThrow("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      
      // Pastikan repository TIDAK pernah dipanggil jika validasi gagal
      expect(CompetitionRepository.create).not.toHaveBeenCalled();
    });
  });

  // --- Group Test: getCompetitionDetail ---
  describe('getCompetitionDetail()', () => {
    it('harus mengembalikan data kompetisi jika ID ditemukan', async () => {
      const mockCompetition = { id: 10, name: "Hackathon Makassar" };
      CompetitionRepository.findById.mockResolvedValue(mockCompetition);

      const result = await CompetitionService.getCompetitionDetail(10);

      expect(result).toEqual(mockCompetition);
      expect(CompetitionRepository.findById).toHaveBeenCalledWith(10);
    });

    it('harus throw error jika data tidak ditemukan (null)', async () => {
      CompetitionRepository.findById.mockResolvedValue(null);

      await expect(CompetitionService.getCompetitionDetail(999))
        .rejects.toThrow("Kompetisi tidak ditemukan.");
    });
  });

  // --- Group Test: updateCompetition ---
  describe('updateCompetition()', () => {
    it('harus berhasil mengupdate data kompetisi', async () => {
      const existingData = { id: 1, name: "Lomba Lama", start_date: "2026-01-01", end_date: "2026-01-10" };
      const updatePayload = { name: "Lomba Baru" };

      CompetitionRepository.findById.mockResolvedValue(existingData);
      CompetitionRepository.update.mockResolvedValue({ ...existingData, ...updatePayload });

      const result = await CompetitionService.updateCompetition(1, updatePayload);

      expect(result.name).toBe("Lomba Baru");
      expect(CompetitionRepository.update).toHaveBeenCalled();
    });

    it('harus throw error saat update jika tanggal baru tidak valid', async () => {
      const existingData = { id: 1, name: "Lomba", start_date: "2026-01-01", end_date: "2026-01-10" };
      const invalidPayload = { end_date: "2025-12-31" }; // Lebih kecil dari start_date

      CompetitionRepository.findById.mockResolvedValue(existingData);

      await expect(CompetitionService.updateCompetition(1, invalidPayload))
        .rejects.toThrow("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
    });
  });

  // --- Group Test: deleteCompetition ---
  describe('deleteCompetition()', () => {
    it('harus berhasil menghapus data jika ID ada', async () => {
      CompetitionRepository.findById.mockResolvedValue({ id: 5 });
      CompetitionRepository.delete.mockResolvedValue(true);

      const result = await CompetitionService.deleteCompetition(5);

      expect(result).toBe(true);
      expect(CompetitionRepository.delete).toHaveBeenCalledWith(5);
    });

    it('harus gagal menghapus jika ID tidak ada', async () => {
      CompetitionRepository.findById.mockResolvedValue(null);

      await expect(CompetitionService.deleteCompetition(5))
        .rejects.toThrow("Kompetisi tidak ditemukan.");
    });
  });
});