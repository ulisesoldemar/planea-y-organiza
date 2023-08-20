const createRoom = require('../controllers/rooms.controller').createRoom; // Importa tu controlador
const { HttpError } = require('../error');

// Mocks
const mockRequest = (body) => ({ body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('createRoom Controller', () => {
    test('should create a room with valid data', async () => {
        const req = mockRequest({
            admin: 'adminId',
            roomNumber: 123,
            roomName: 'Test Room',
            password: 'password',
            expiration: '2023-12-31',
        });
        const res = mockResponse();

        await createRoom(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(/* your expected response */);
    });

    test('should throw HttpError with invalid admin', async () => {
        const req = mockRequest({
            admin: 'invalidAdminId',
            roomNumber: 123,
            roomName: 'Test Room',
            password: 'password',
            expiration: '2023-12-31',
        });
        const res = mockResponse();

        await expect(createRoom(req, res)).rejects.toThrow(HttpError);
        expect(res.status).toHaveBeenCalledWith(/* your expected status code */);
    });

    // Add more test cases...
});
