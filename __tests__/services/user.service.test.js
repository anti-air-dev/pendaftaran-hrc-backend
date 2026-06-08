const userService = require('../../src/services/user.service');
const userRepository = require('../../src/repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../src/repositories/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService Unit Testing', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const mockUserData = {
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should throw error if email is already registered', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(userService.registerUser(mockUserData))
        .rejects.toThrow('Email is already registered. Please use another email.');
    });

    it('should throw error if username is already taken', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue({ id: 1, username: 'testuser' });

      await expect(userService.registerUser(mockUserData))
        .rejects.toThrow('Username is already taken.');
    });

    it('should hash password and create user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      userRepository.create.mockResolvedValue({ ...mockUserData, password: 'hashedPassword123', id: 1 });

      const result = await userService.registerUser(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(userRepository.create).toHaveBeenCalled();
      expect(result.password).toBe('hashedPassword123');
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'john@example.com',
      password: 'hashedPassword',
      role: 'participant',
      status: 'active',
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        email: 'john@example.com',
        role: 'participant',
        status: 'active'
      })
    };

    it('should throw error if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login('wrong@email.com', 'pass'))
        .rejects.toThrow('Invalid email or password.');
    });

    it('should throw error if account is suspended', async () => {
      userRepository.findByEmail.mockResolvedValue({ ...mockUser, status: 'suspended' });

      await expect(userService.login('john@example.com', 'pass'))
        .rejects.toThrow('Your account is suspended.');
    });

    it('should return user and token on successful login', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked-jwt-token');

      const result = await userService.login('john@example.com', 'password123');

      expect(result).toHaveProperty('token', 'mocked-jwt-token');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error if password does not match', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login('john@example.com', 'wrongpass'))
        .rejects.toThrow('Invalid email or password.');
    });
  });

  describe('getUserById', () => {
    it('should return user data without password', async () => {
      const mockUser = {
        id: 1,
        toJSON: jest.fn().mockReturnValue({ id: 1, password: 'secretPassword' })
      };
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(1);
    });

    it('should throw error if user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(99))
        .rejects.toThrow('User not found.');
    });
  });
});