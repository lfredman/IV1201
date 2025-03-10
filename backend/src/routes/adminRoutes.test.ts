import request from 'supertest';
import app from '../app';
import { closeDB } from '../utils/db';
import { createAdmin, deleteUserByUsername } from '../models/accountModel';
import { upsertApplication } from '../models/applicationModel';
import bcrypt from 'bcryptjs';

describe('Admin Application Management', () => {
    
    let authTokenAdmin = ''; // Token for admin user
    let authTokenNormal = ''; // Token for regular user
    let user_id = -1; // User ID for normal user
    let adminUser = {
        name: 'testadmin',
        surname: 'testadmin',
        pnr: '2947889484',
        username: 'admin_user',
        email: 'admin@admin.admin',
        password: 'AdminPassword123!' // Admin credentials
    };

    const userdata = {
        name: 'John',
        surname: 'Doe',
        pnr: '1919191919',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'Password123!' // Normal user credentials
    };

    beforeAll(async () => {
        // Hash password for admin user and create admin account in the database
        let passwordhash = await bcrypt.hash(adminUser.password, 10);
        await createAdmin(adminUser.name, adminUser.surname, adminUser.pnr, adminUser.username, adminUser.email, passwordhash);
        
        // Register normal user and create an application for them
        let data = await request(app).post('/account/register').send(userdata);
        const userId = data.body.data.user.person_id;
        await upsertApplication(userId, "unhandled"); // Add application for the new user
    });

    afterAll(async () => {
        // Cleanup test data by deleting users and closing database connection
        await deleteUserByUsername(adminUser.username);
        await deleteUserByUsername(userdata.username);
        await closeDB();
    });

    describe('POST /account/login', () => {
        it('should log in an admin user and return access & refresh tokens', async () => {
            // Admin login with valid credentials
            const loginData = {
                loginField: adminUser.username,
                password: adminUser.password,
            };

            const response = await request(app).post('/account/login').send(loginData);

            expect(response.status).toBe(200); // Ensure login is successful
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            authTokenAdmin = response.body.data.accessToken; // Save token for admin
        });

        it('should log in a normal user and return access & refresh tokens', async () => {
            // Normal user login with valid credentials
            const loginData = {
                loginField: userdata.username,
                password: userdata.password,
            };

            const response = await request(app).post('/account/login').send(loginData);

            expect(response.status).toBe(200); // Ensure login is successful
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            authTokenNormal = response.body.data.accessToken; // Save token for normal user

            user_id = response.body.data.user.person_id; // Save the user ID for future tests
        });
    });
    
    describe('GET /applications', () => {
        it('should fetch applications for all users', async () => {
            // Admin fetching applications for all users
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`); // Include admin token in request header

            expect(response.status).toBe(200); // Ensure the request succeeds
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true); // Check if response data is an array
        });

        it('should fetch applications for specific users', async () => {
            // Admin fetching applications for specific users by IDs
            const response = await request(app)
                .get('/admin/applications?ids=100,110') // Passing multiple user IDs
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2); // Ensure two user applications are fetched
        });

        it('should throw error fetching applications with invalid user ID', async () => {
            // Admin attempting to fetch applications with an invalid user ID
            const response = await request(app)
                .get('/admin/applications?ids=notvalid')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("No valid positive integers provided");
        });

        it('should throw error fetching applications without user ID', async () => {
            // Admin attempting to fetch applications without a valid user ID
            const response = await request(app)
                .get('/admin/applications?ids=123&ids=456')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid 'ids' query parameter");
        });

        it('should return a 400 error for normal user accessing all applications', async () => {
            // Normal user attempting to fetch all applications (should be denied)
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenNormal}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is required'); // Error for unauthorized access
        });
    });

    describe('POST /applications', () => {
        it('should allow an admin to update an application', async () => {
            const action = 'accepted'; // Action to update application status
            // Admin updating application status for a specific user
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(201); // Ensure application update is successful
            expect(response.body.message).toBe('User application updated successfully');
            expect(response.body.data[0]).toHaveProperty('application_status', action); // Ensure status is updated
        });

        it('should throw error if admin tries to update application without valid ID', async () => {
            // Admin trying to update application without a valid user ID
            const user_id = "not valid id"; // Invalid ID
            const valid_action = "unhandled"; // Valid action
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, valid_action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'id' query parameter");
        });

        it('should throw error if admin tries to update application without valid action', async () => {
            // Admin trying to update application without valid action
            const action = 123; // Invalid action type
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'action' query parameter");
        });

        it('should throw error if admin tries to update application with invalid action', async () => {
            // Admin trying to update application with invalid action value
            const action = 'not a valid action'; // Invalid action value
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
        });

        it('should return a 403 error if a normal user tries to update an application they do not own', async () => {
            const action = 'rejected'; // Action for application update

            // Normal user attempting to update application (should be denied)
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is required'); // Error for unauthorized access
        });
    });
});
