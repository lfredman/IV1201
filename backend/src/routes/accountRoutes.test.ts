import request from 'supertest';
import app from '../app'; // Import your Express app
import { closeDB } from '../utils/db';
import { deleteUserByUsername } from '../models/accountModel';

/**
 * This test suite covers the functionality related to user registration, login, and token refresh. 
 * It tests various endpoints of the '/account' route:
 * - **POST /account/register**: Verifies user registration, including success, existing username/email/PNR checks, 
 *   password strength validation, and proper error handling for missing or invalid fields.
 * - **POST /account/login**: Ensures that valid credentials allow login, and invalid credentials return proper error messages.
 * - **GET /account/refresh**: Tests the refresh token functionality, including successful token refresh and handling of expired or invalid refresh tokens.
 * 
 * Each test ensures that the API behaves as expected under different conditions.
 */
describe('User Registration, Login, and Token Refresh', () => {
    
    afterAll(async () => {
        await deleteUserByUsername("john_doe");
        await closeDB()
    });

    const userdata = {
        name: 'John',
        surname: 'Doe',
        pnr: '1919191919',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
    };

    describe('POST /account/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app).post('/account/register').send(userdata);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.data.user).toHaveProperty('username', userdata.username);
        });

        it('should return an error if the username is already taken', async () => {
            const response = await request(app).post('/account/register').send(userdata);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username is already taken');
        });
        
        // Existing tests for email and personal number
        it('should return an error if the email is already taken', async () => {
            const modifiedUserData = {
                ...userdata, 
                username: userdata.username + Math.floor(Math.random() * 1000)
            };
            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email is already registered');
        });

        it('should return an error if the personal number is already taken', async () => {
            const modifiedUserData = {
                ...userdata, 
                username: userdata.username + Math.floor(Math.random() * 1000),
                email: userdata.email + Math.floor(Math.random() * 1000)
            };
            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Personal number is already registered');
        });

        it('should return an error if required fields are missing', async () => {
            const incompleteData = {
                name: 'Jane',
                surname: 'Doe',
                pnr: '0987654321',
                username: 'jane_doe',
                email: 'jane.doe@example.com',
            };

            const response = await request(app).post('/account/register').send(incompleteData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
        });

        it('should return an error for invalid email format', async () => {
            const invalidEmailUserData = {
                ...userdata,
                email: 'invalid-email'
            };

            const response = await request(app).post('/account/register').send(invalidEmailUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('A valid email is required.');
        });

        it('should return an error for invalid personal number (PNR)', async () => {
            const invalidPnrUserData = {
                ...userdata,
                pnr: 'invalid-pnr'
            };

            const response = await request(app).post('/account/register').send(invalidPnrUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Provided Pnr is not valid.');
        });

        it('should return an error if password is too weak', async () => {
            const modifiedUserData = {
                ...userdata, 
                username: userdata.username + Math.floor(Math.random() * 1000),
                email: userdata.email + Math.floor(Math.random() * 1000),
                pnr: '8989898988',
                password: 'weak'
            };

            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
        });

        it('should return an error if name is missing or not a string', async () => {
            const invalidUserData = { ...userdata, name: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Name is required and must be a string.');
        });
    
        it('should return an error if surname is missing or not a string', async () => {
            const invalidUserData = { ...userdata, surname: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Surname is required and must be a string.');
        });
    
        it('should return an error if username is missing or not a string', async () => {
            const invalidUserData = { ...userdata, username: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Username is required and must be a string.');
        });
    
        it('should return an error if email is missing, not a string, or invalid', async () => {
            // Missing email
            let invalidUserData = { ...userdata, email: null };
            let response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('A valid email is required.');
        });
    
        it('should return an error if password is missing, not a string, or too weak', async () => {
            // Missing password
            let invalidUserData = { ...userdata, password: null };
            let response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
        });
    });

    describe('POST /account/login', () => {
        it('should log in an existing user and return access & refresh tokens', async () => {
            const loginData = {
                loginField: 'john_doe',
                password: 'Password123!',
            };

            const response = await request(app).post('/account/login').send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should return an error for invalid credentials', async () => {
            const loginData = {
                loginField: 'invalid_user',
                password: 'WrongPassword!',
            };

            const response = await request(app).post('/account/login').send(loginData);
            expect(response.status).toBe(400);
            
            expect(response.body.message).toContain('Invalid credentials');
        });
    });

    describe('GET /account/refresh', () => {
        let refreshToken: string;

        // Assuming the user logs in first to get a refresh token
        beforeAll(async () => {
            const loginData = {
                loginField: 'john_doe',
                password: 'Password123!',
            };

            const response = await request(app).post('/account/login').send(loginData);
            refreshToken = response.body.data.refreshToken;
            
        });

        it('should refresh the access token successfully', async () => {
            const response = await request(app)
                .get(`/account/refresh?refreshToken=${refreshToken}`) // Pass refreshToken in query params
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Token refreshed successfully');
            expect(response.body.data).toHaveProperty('accessToken');
        });
    
        it('should return an error for invalid refresh token', async () => {
            const invalidRefreshToken = 'invalid-refresh-token';
            const response = await request(app)
                .get(`/account/refresh?refreshToken=${invalidRefreshToken}`) // Pass invalid token
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid or expired refresh token');
        });
    });


    describe('Password Reset Service', () => {
        let accessToken: string;
        beforeAll(async () => {
            const loginData = {
                loginField: 'john_doe',
                password: 'Password123!',
            };

            const response = await request(app).post('/account/login').send(loginData);
            accessToken = response.body.data.accessToken;            
        });

        it('should reset users password', async () => {
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({password: "Hejhej123456!"});

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password reset successfully');
        });

        it('should not reset users password due to password constraints', async () => {
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({password: "hejhej"});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
        });

        it('should not reset users password due no password entered', async () => {
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing parameters');
        });

    });
});
