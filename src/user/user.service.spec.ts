import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let modelMock;

  beforeEach(async () => {
    modelMock = {
      save: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('USER'), // Asume 'USER' como el nombre del modelo
          useValue: modelMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      const userDto: UserDto = {
        name: 'Test User',
        username: 'test',
        email: 'test@example.com',
        password: 'test123'
      };

      modelMock.save.mockResolvedValue(userDto);

      const result = await userService.create(userDto);
      expect(result.password).toBe('hashedPassword');
      expect(modelMock.save).toBeCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      modelMock.find.mockResolvedValue(['user1', 'user2']);
      expect(await userService.findAll()).toEqual(['user1', 'user2']);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: '1', username: 'testUser', password: 'hashedPassword' };
      modelMock.findById.mockResolvedValue(user);

      const result = await userService.findOne('1');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      const userDto: UserDto = {
        name: 'Updated User',
        username: 'updated',
        email: 'updated@example.com',
        password: 'updated123'
      };
  
      const userId = 'someUserId';
  
      modelMock.findByIdAndUpdate.mockResolvedValue({
        ...userDto,
        password: 'hashedUpdatedPassword'
      });
  
      const result = await userService.update(userId, userDto);
      expect(result.password).toBe('hashedUpdatedPassword');
      expect(modelMock.findByIdAndUpdate).toBeCalledWith(userId, { ...userDto, password: 'hashedUpdatedPassword' }, { new: true });
    });
  });
  
  describe('remove', () => {
    it('should delete a user and return a success message', async () => {
      const user = { id: '1', username: 'testUser', password: 'hashedPassword' };
      modelMock.findByIdAndDelete.mockResolvedValue(user);

      const result = await userService.remove('1');
      expect(result).toEqual({
        status: 200,
        message: 'User deleted successfully'
      });
    });

    it('should return not found when user does not exist', async () => {
      modelMock.findByIdAndDelete.mockResolvedValue(null);

      const result = await userService.remove('2');
      expect(result).toEqual({
        status: 404,
        message: 'Not found'
      });
    });
  });
});
