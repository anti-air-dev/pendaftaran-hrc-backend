const userService = require('../services/user.service');

class UserController {
  /**
   * Menangani registrasi user baru
   * POST /api/users/register
   */
  async register(req, res) {
    try {
      // Mengambil data dari body request
      const { full_name, username, email, password, role } = req.body;

      const newUser = await userService.registerUser({
        full_name,
        username,
        email,
        password,
        role
      });

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Please check your email for verification.',
        data: {
          user: newUser
        }
      });
    } catch (error) {
      // Menangani error dari service (misal email duplikat)
      console.error("DETEKSI ERROR:", error);
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Menangani login user
   * POST /api/users/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide email and password'
        });
      }

      // Memanggil service login yang sekarang mengembalikan { user, token }
      const result = await userService.login(email, password);

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token // Token ini yang akan disimpan React di LocalStorage
        }
      });
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async createByAdmin(req, res) {
    try {
      // Ambil seluruh data termasuk status yang dikirim dari panel admin
      const { full_name, username, email, password, role, status } = req.body;

      const newUser = await userService.createUserByAdmin({
        full_name,
        username,
        email,
        password,
        role,
        status
      });

      return res.status(201).json({
        status: 'success',
        message: 'User created successfully by Administrator.',
        data: {
          user: newUser
        }
      });
    } catch (error) {
      console.error("ADMIN CREATE USER ERROR:", error);
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Mendapatkan daftar user dengan pagination & search
   * GET /api/users
   */
  async getAll(req, res) {
    try {
      // Mengambil page, limit, dan search (keyword) dari query string url
      const { page, limit, search } = req.query;

      // Teruskan search ke service
      const result = await userService.getUsers(page, limit, search);

      return res.status(200).json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Mengambil data profil user (Berdasarkan ID)
   * GET /api/users/:id
   */
    async getProfile(req, res) {
      try {
        const { id } = req.params;
        
        // Memanggil fungsi service yang baru kita pastikan di atas
        const user = await userService.getUserById(id);

        return res.status(200).json({
          status: 'success',
          message: 'User data retrieved successfully',
          data: {
            user // Data ini yang dibaca oleh `response.data.data.user` di React Form Anda
          }
        });
      } catch (error) {
        console.error("GET USER BY ID ERROR:", error);
        return res.status(404).json({
          status: 'fail',
          message: error.message
        });
      }
    }

  /**
   * Update data profil user
   * PATCH /api/users/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      
      // Ambil field dasar beserta password opsional dari body request
      const { full_name, username, email, role, status, password } = req.body;

      // Kirim objek data ke service
      const updatedUser = await userService.updateUser(id, {
        full_name,
        username,
        email,
        role,
        status,
        password // Teruskan password (jika ada)
      });

      return res.status(200).json({
        status: 'success',
        message: 'User profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Update password user
   * PUT /api/users/:id/change-password
   */
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      await userService.changePassword(id, { oldPassword, newPassword });

      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
      });
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Menghapus user (Soft Delete)
   * DELETE /api/users/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Mengembalikan user yang terhapus
   * POST /api/users/:id/restore
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.restoreUser(id);

      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();