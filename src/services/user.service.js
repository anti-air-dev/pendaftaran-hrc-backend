const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ambil secret dari environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

class UserService {
  /**
   * Logika untuk pendaftaran user baru
   */
  async registerUser(userData) {
    // 1. Validasi: Cek apakah email sudah digunakan
    const emailExists = await userRepository.findByEmail(userData.email);
    if (emailExists) {
      throw new Error('Email is already registered. Please use another email.');
    }

    // 2. Validasi: Cek apakah username sudah digunakan
    const usernameExists = await userRepository.findByUsername(userData.username);
    if (usernameExists) {
      throw new Error('Username is already taken.');
    }

    // 3. Security: Hash password sebelum disimpan
    // Jangan pernah simpan password dalam bentuk teks biasa (plain text)!
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // 4. Data Transformation
    // Kita pastikan role dan status sesuai standar jika tidak diisi
    const finalUserData = {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'participant',
      status: userData.status || 'unverified'
    };

    // 5. Simpan ke Database melalui Repository
    return await userRepository.create(finalUserData);
  }

  /**
   * Logika untuk Login User
   */
  /**
   * Logika Login dengan Generate JWT
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'suspended') {
      throw new Error('Your account is suspended.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid email or password.');
    }

    // 1. Transformasi data user ke JSON
    const userJson = user.toJSON();
    delete userJson.password;

    // 2. Generate JWT Token
    // Kita masukkan ID, Email, dan Role ke dalam payload token
    const token = jwt.sign(
      { 
        id: userJson.id, 
        email: userJson.email, 
        role: userJson.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 3. Return user data beserta tokennya
    return {
      user: userJson,
      token: token
    };
  }

  /**
   * Method bantuan untuk verifikasi token (akan digunakan di middleware)
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token.');
    }
  }

  /**
   * Mengambil semua user dengan Pagination dan Search
   */
  async getUsers(page = 1, limit = 10, search = '') {
    // Pastikan page dan limit adalah angka
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    
    // Validasi agar tidak ada nilai minus atau 0
    const currentPage = parsedPage > 0 ? parsedPage : 1;
    const currentLimit = parsedLimit > 0 ? parsedLimit : 10;

    // Hitung offset
    const offset = (currentPage - 1) * currentLimit;

    // Ambil data dari repository (Teruskan parameter search ke repository)
    const { count, rows } = await userRepository.findWithPagination(currentLimit, offset, search);

    // Hitung total halaman
    const totalPages = Math.ceil(count / currentLimit);

    return {
      totalItems: count,
      users: rows,
      totalPages: totalPages,
      currentPage: currentPage,
      limit: currentLimit,
      searchQuery: search // Mengembalikan keyword pencarian sebagai informasi
    };
  }

  /**
   * Mengambil profile user (untuk kebutuhan dashboard)
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    
    // Jangan kirim password kembali ke client/frontend
    const userJson = user.toJSON();
    delete userJson.password;
    
    return userJson;
  }

  /**
   * Update Status User (Misal: Verifikasi akun atau Suspend)
   */
  async updateUserStatus(id, newStatus) {
    const validStatus = ['active', 'inactive', 'suspended', 'unverified'];
    if (!validStatus.includes(newStatus)) {
      throw new Error('Invalid status category.');
    }

    const updatedUser = await userRepository.update(id, { status: newStatus });
    if (!updatedUser) throw new Error('User not found.');

    return updatedUser;
  }

  /**
   * Update Profil User (Nama, Username, Email)
   */
  async updateUser(id, updateData) {
    // 1. Cek apakah user ada
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found.');

    // 2. Jika email diubah, cek apakah email baru sudah dipakai orang lain
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists) throw new Error('Email is already in use.');
    }

    // 3. Jika username diubah, cek keunikan
    if (updateData.username && updateData.username !== user.username) {
      const usernameExists = await userRepository.findByUsername(updateData.username);
      if (usernameExists) throw new Error('Username is already taken.');
    }

    // 4. Eksekusi update melalui repository
    const updatedUser = await userRepository.update(id, updateData);
    
    // 5. Kembalikan data tanpa password
    const userJson = updatedUser.toJSON();
    delete userJson.password;
    return userJson;
  }

  /**
   * Update Password (Logika terpisah karena butuh hashing)
   */
  async changePassword(id, { oldPassword, newPassword }) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found.');

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Old password is incorrect.');

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return await userRepository.update(id, { password: hashedPassword });
  }

  /**
   * Menghapus User (Soft Delete)
   */
  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found.');

    // Menggunakan softDelete dari repository agar data masih ada di DB (paranoid)
    await userRepository.softDelete(id);
    
    return { message: 'User has been successfully deleted.' };
  }

  /**
   * Mengembalikan User yang terhapus (Restore)
   */
  async restoreUser(id) {
    const restored = await userRepository.restore(id);
    if (!restored) throw new Error('Failed to restore user or user not found.');
    
    return { message: 'User has been restored.' };
  }
}

module.exports = new UserService();