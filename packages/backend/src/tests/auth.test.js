const { signup, login } = require('../controllers/auth.controller');
const { HttpError } = require('../error');

// Mockear los modelos y otras dependencias
jest.mock('../models');
const mockUserAdmin = {
    id: 'mockedUserId',
    password: 'hashedPassword',
};
const mockRefreshToken = {
    id: 'mockedRefreshTokenId',
    save: jest.fn(),
};
const mockSession = {}; // Puedes definir mocks adicionales según tus necesidades
const { UserAdmin, RefreshToken } = require('../models');
UserAdmin.findOne.mockReturnValue(mockUserAdmin);
RefreshToken.mockImplementation(() => mockRefreshToken);

describe('Authentication Controllers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('signup controller should create a new user', async () => {
        const req = {
            body: {
                firstName: 'John',
                surName: 'Doe',
                secondSurName: 'Smith',
                email: 'john.doe@example.com',
                username: 'johndoe',
                password: 'password123',
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await signup(req, res, mockSession);

        expect(UserAdmin).toHaveBeenCalledTimes(1);
        expect(UserAdmin.mock.calls[0][0]).toEqual({
            firstName: 'John',
            surName: 'Doe',
            secondSurName: 'Smith',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: expect.any(String), // Verificar que se haya hasheado la contraseña
        });
        expect(UserAdmin.mock.instances[0].save).toHaveBeenCalledWith({ session: mockSession });
        expect(RefreshToken).toHaveBeenCalledTimes(1);
        expect(RefreshToken.mock.instances[0].save).toHaveBeenCalledWith({ session: mockSession });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 'mockedUserId',
            // Otros campos esperados en la respuesta
        });
    });

    // Agrega más pruebas para otros controladores...
});
