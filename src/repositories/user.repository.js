const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository {
  /**
   * Mencari user berdasarkan Email (Penting untuk Login & Register)
   */
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  /**
   * Mencari user berdasarkan Username (Penting untuk Register)
   */
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  /**
   * Mencari user berdasarkan ID (Hanya yang aktif)
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Simpan user baru ke database
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update data user
   */
  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updateData);
  }

  /**
   * Mengambil semua user yang aktif
   */
  async findAll() {
    return await User.findAll();
  }

  /**
   * 1. SOFT DELETE (Menghapus secara logis)
   */
  async softDelete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.destroy(); 
  }

  /**
   * 2. RESTORE (Mengembalikan data soft-delete)
   */
  async restore(id) {
    const user = await User.findByPk(id, { paranoid: false });
    if (user && user.deletedAt) { // Sequelize default biasanya deletedAt
      return await user.restore();
    }
    return null;
  }

  /**
   * 3. HARD DELETE (Permanen)
   */
  async hardDelete(id) {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) return null;
    return await user.destroy({ force: true });
  }
  
  /**
   * Mengambil list user dengan Pagination
   */
  async findWithPagination(limit, offset, search = '') {
    const whereClause = {};

    // Jika ada keyword pencarian, tambahkan kondisi
    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    return await User.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new UserRepository();