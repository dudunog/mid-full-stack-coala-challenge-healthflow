import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockGetAllAndOverride: jest.SpyInstance;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    mockGetAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const createMockContext = (user: unknown): ExecutionContext => {
      const request = { user };
      return {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;
    };

    it('should return true when no roles are required', () => {
      mockGetAllAndOverride.mockReturnValue(undefined);
      const context = createMockContext({ id: '1', role: Role.ATTENDANT });
      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      mockGetAllAndOverride.mockReturnValue([Role.ATTENDANT]);
      const user = { id: '1', email: 'test@test.com', role: Role.ATTENDANT };
      const context = createMockContext(user);
      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has one of the required roles', () => {
      mockGetAllAndOverride.mockReturnValue([Role.ATTENDANT, Role.DOCTOR]);
      const user = { id: '1', email: 'test@test.com', role: Role.DOCTOR };
      const context = createMockContext(user);
      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      mockGetAllAndOverride.mockReturnValue([Role.DOCTOR]);
      const user = { id: '1', email: 'test@test.com', role: Role.ATTENDANT };
      const context = createMockContext(user);
      const result = guard.canActivate(context);
      expect(result).toBe(false);
    });

    it('should return false when user is not present', () => {
      mockGetAllAndOverride.mockReturnValue([Role.ATTENDANT]);
      const context = createMockContext(null);
      const result = guard.canActivate(context);
      expect(result).toBe(false);
    });
  });
});
