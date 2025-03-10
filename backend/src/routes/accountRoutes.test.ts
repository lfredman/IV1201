import request from 'supertest';
import app from '../app'; // Import your Express app
import { closeDB } from '../utils/db';
import { deleteUserByUsername } from '../models/accountModel';

/**
 * This test suite covers functionality related to user registration, login, token refresh, and password reset services.
 * It ensures that different endpoints under the '/account' route behave as expected under various scenarios:
 * - **POST /account/register**: Tests user registration including successful registration, error handling for 
 *   existing username/email/PNR, password strength validation, and checks for missing or invalid fields.
 * - **POST /account/login**: Verifies that valid credentials allow login and invalid credentials return appropriate errors.
 * - **GET /account/refresh**: Tests the refresh token functionality, including success for valid refresh tokens and proper 
 *   error handling for expired or invalid tokens.
 * - **POST /account/reset**: Ensures the password reset functionality, including validation for missing or weak passwords.
 * 
 * Each test case ensures correct handling of different scenarios for user account management.
 */
describe('User Registration, Login, and Token Refresh', () => {

    afterAll(async () => {
        // Clean up the database by deleting the test user after all tests have been executed
        await deleteUserByUsername("john_doe");
        await closeDB();  // Close the database connection
    });

    // Sample user data to use in multiple test cases
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
            // Test case for successful registration with valid data
            const response = await request(app).post('/account/register').send(userdata);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.data.user).toHaveProperty('username', userdata.username);
        });

        it('should return an error if the username is already taken', async () => {
            // Test case for attempting to register with an existing username
            const response = await request(app).post('/account/register').send(userdata);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username is already taken');
        });

        it('should return an error if the email is already taken', async () => {
            // Test case for attempting to register with an already registered email
            const modifiedUserData = {
                ...userdata,
                username: userdata.username + Math.floor(Math.random() * 1000)  // Ensure unique username for this test
            };
            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email is already registered');
        });

        it('should return an error if the personal number is already taken', async () => {
            // Test case for attempting to register with an already registered personal number (PNR)
            const modifiedUserData = {
                ...userdata,
                username: userdata.username + Math.floor(Math.random() * 1000),
                email: userdata.email + Math.floor(Math.random() * 1000),
            };
            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Personal number is already registered');
        });

        it('should return an error if required fields are missing', async () => {
            // Test case for attempting to register with missing fields (password)
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
            // Test case for invalid email format
            const invalidEmailUserData = {
                ...userdata,
                email: 'invalid-email'
            };

            const response = await request(app).post('/account/register').send(invalidEmailUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('A valid email is required.');
        });

        it('should return an error for invalid personal number (PNR)', async () => {
            // Test case for invalid personal number (PNR)
            const invalidPnrUserData = {
                ...userdata,
                pnr: 'invalid-pnr'
            };

            const response = await request(app).post('/account/register').send(invalidPnrUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Provided Pnr is not valid.');
        });

        it('should return an error if password is too weak', async () => {
            // Test case for weak password (too short or lacking complexity)
            const modifiedUserData = {
                ...userdata,
                username: userdata.username + Math.floor(Math.random() * 1000),
                email: userdata.email + Math.floor(Math.random() * 1000),
                pnr: '8989898988',
                password: 'weak'  // Weak password
            };

            const response = await request(app).post('/account/register').send(modifiedUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
        });

        it('should return an error if name is missing or not a string', async () => {
            // Test case for missing or invalid name field
            const invalidUserData = { ...userdata, name: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Name is required and must be a string.');
        });

        it('should return an error if surname is missing or not a string', async () => {
            // Test case for missing or invalid surname field
            const invalidUserData = { ...userdata, surname: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Surname is required and must be a string.');
        });

        it('should return an error if username is missing or not a string', async () => {
            // Test case for missing or invalid username field
            const invalidUserData = { ...userdata, username: null };
            const response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Username is required and must be a string.');
        });

        it('should return an error if email is missing, not a string, or invalid', async () => {
            // Test case for missing or invalid email field
            let invalidUserData = { ...userdata, email: null };
            let response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('A valid email is required.');
        });

        it('should return an error if password is missing, not a string, or too weak', async () => {
            // Test case for missing or invalid password field
            let invalidUserData = { ...userdata, password: null };
            let response = await request(app).post('/account/register').send(invalidUserData);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
        });
    });

    describe('POST /account/login', () => {
        it('should log in an existing user and return access & refresh tokens', async () => {
            // Test case for logging in with valid credentials and receiving access and refresh tokens
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
            // Test case for logging in with invalid credentials
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

        beforeAll(async () => {
            // Log in the user first to retrieve the refresh token for testing
            const loginData = {
                loginField: 'john_doe',
                password: 'Password123!',
            };

            const response = await request(app).post('/account/login').send(loginData);
            refreshToken = response.body.data.refreshToken;
        });

        it('should refresh the access token successfully', async () => {
            // Test case for refreshing the access token using a valid refresh token
            const response = await request(app)
                .get(`/account/refresh?refreshToken=${refreshToken}`) // Pass refreshToken in query params
                .set('Content-Type', 'application/json');
    
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Token refreshed successfully');
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should return an error for invalid refresh token', async () => {
            // Test case for using an invalid or expired refresh token
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
            // Log in the user to retrieve the access token for the password reset tests
            const loginData = {
                loginField: 'john_doe',
                password: 'Password123!',
            };

            const response = await request(app).post('/account/login').send(loginData);
            accessToken = response.body.data.accessToken;
        });

        it('should reset users password', async () => {
            // Test case for successfully resetting the password
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`) // Provide access token in the header
                .send({password: "Hejhej123456!"});

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password reset successfully');
        });

        it('should not reset users password due to password constraints', async () => {
            // Test case for password reset with a weak password (not meeting criteria)
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({password: "hejhej"});  // Weak password

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
        });

        it('should not reset users password due to no password entered', async () => {
            // Test case for password reset with no password provided
            const response = await request(app)
                .post('/account/reset')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});  // Missing password

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing parameters');
        });

    });
});
