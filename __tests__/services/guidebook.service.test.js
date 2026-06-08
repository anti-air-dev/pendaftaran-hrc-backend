const GuidebookService = require('../../src/services/guidebook.service');
const GuidebookRepository = require('../../src/repositories/guidebook.repository');

// Mocking repository agar tidak melakukan akses database asli
jest.mock('../../src/repositories/guidebook.repository');

describe('GuidebookService Unit Test', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test getAllGuidebooks
  describe('getAllGuidebooks', () => {
    it('should return all guidebooks from repository', async () => {
      const mockGuidebooks = [
        { id: 1, title: 'Guide 1', competition_id: 10 },
        { id: 2, title: 'Guide 2', competition_id: 11 }
      ];
      GuidebookRepository.findAll.mockResolvedValue(mockGuidebooks);

      const result = await GuidebookService.getAllGuidebooks();

      expect(result).toEqual(mockGuidebooks);
      expect(GuidebookRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // 2. Test getGuidebookById
  describe('getGuidebookById', () => {
    it('should return a guidebook if found', async () => {
      const mockGuidebook = { id: 1, title: 'Specific Guide' };
      GuidebookRepository.findById.mockResolvedValue(mockGuidebook);

      const result = await GuidebookService.getGuidebookById(1);

      expect(result).toEqual(mockGuidebook);
      expect(GuidebookRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw "Guidebook not found" if id does not exist', async () => {
      GuidebookRepository.findById.mockResolvedValue(null);

      await expect(GuidebookService.getGuidebookById(99))
        .rejects.toThrow('Guidebook not found');
    });
  });

  // 3. Test createGuidebook
  describe('createGuidebook', () => {
    it('should create a guidebook when data is valid', async () => {
      const input = { title: 'New Title', competition_id: 1, file_path: 'file.pdf' };
      GuidebookRepository.create.mockResolvedValue({ id: 1, ...input });

      const result = await GuidebookService.createGuidebook(input);

      expect(result.id).toBe(1);
      expect(GuidebookRepository.create).toHaveBeenCalledWith(input);
    });

    it('should throw error if title or competition_id is missing', async () => {
      const invalidInput = { title: 'Missing Comp ID' }; // competition_id tidak ada

      await expect(GuidebookService.createGuidebook(invalidInput))
        .rejects.toThrow('Title and Competition ID are required');
    });
  });

  // 4. Test updateGuidebook
  describe('updateGuidebook', () => {
    it('should return updated guidebook if id exists', async () => {
      const updateData = { title: 'Updated Title' };
      GuidebookRepository.update.mockResolvedValue({ id: 1, ...updateData });

      const result = await GuidebookService.updateGuidebook(1, updateData);

      expect(result.title).toBe('Updated Title');
      expect(GuidebookRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw error if id to update is not found', async () => {
      GuidebookRepository.update.mockResolvedValue(null);

      await expect(GuidebookService.updateGuidebook(99, { title: 'No' }))
        .rejects.toThrow('Guidebook not found');
    });
  });

  // 5. Test deleteGuidebook
  describe('deleteGuidebook', () => {
    it('should return true/success message when deletion is successful', async () => {
      GuidebookRepository.delete.mockResolvedValue(true);

      const result = await GuidebookService.deleteGuidebook(1);

      expect(result).toBe(true);
      expect(GuidebookRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if id to delete is not found', async () => {
      GuidebookRepository.delete.mockResolvedValue(null);

      await expect(GuidebookService.deleteGuidebook(99))
        .rejects.toThrow('Guidebook not found');
    });
  });

});