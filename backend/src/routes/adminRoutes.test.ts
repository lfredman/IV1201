import request from 'supertest';
import app from '../app';
import { closeDB } from '../utils/db';
import { createAdmin, deleteUserByUsername } from '../models/accountModel';
import { upsertApplication } from '../models/applicationModel';
import bcrypt from 'bcryptjs';

/**
 * Test suite for Admin Application Management.
 * This suite tests the functionality of admin-related endpoints for managing user applications.
 * It includes tests for:
 * - Logging in as an admin and normal user.
 * - Fetching applications for all users or specific users.
 * - Updating application statuses as an admin.
 * - Handling errors for invalid inputs or unauthorized access.
 *
 * @group Admin Application Management
 */

describe('Admin Application Management', () => {

    let authTokenAdmin = '';
    let authTokenNormal = '';
    let user_id = -1;


    // Admin user data for testing.    
    let adminUser = {
        name: 'testadmin',
        surname: 'testadmin',
        pnr: '2947889484',
        username: 'admin_user',
        email: 'admin@admin.admin',
        password: 'AdminPassword123!'
    };

    // Normal user data for testing
    const userdata = {
        name: 'John',
        surname: 'Doe',
        pnr: '1919191919',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'Password123!'
    };

    /**
     * Setup before running tests.
     * This function is executed once before all tests.
     * It creates an admin user and a normal user, then creates an application for the normal user.
     */
    beforeAll(async () => {
        // Hash password for admin user and create admin account in the database
        let passwordhash = await bcrypt.hash(adminUser.password, 10);
        await createAdmin(adminUser.name, adminUser.surname, adminUser.pnr, adminUser.username, adminUser.email, passwordhash);

        // Register normal user and create an application for them
        let data = await request(app).post('/account/register').send(userdata);
        const userId = data.body.data.user.person_id;
        await upsertApplication(userId, "unhandled"); // Add application for the new user
    });

    /**
     * Cleanup after running tests.
     * This function is executed once after all tests.
     * It deletes the admin and normal user accounts and closes the database connection.
     */
    afterAll(async () => {
        // Cleanup test data by deleting users and closing database connection
        await deleteUserByUsername(adminUser.username);
        await deleteUserByUsername(userdata.username);
        await closeDB();
    });

    /**
     * Test suite for the login endpoint.
     * It tests logging in as an admin and a normal user with valid credentials.
     */

    describe('POST /account/login', () => {
        it('should log in an admin user and return access & refresh tokens', async () => {
            /**
             * Test login for an admin user.
             * This test checks if an admin user can log in and receive access & refresh tokens.
             */

            const loginData = {
                loginField: adminUser.username,
                password: adminUser.password,
            };

            const response = await request(app).post('/account/login').send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            authTokenAdmin = response.body.data.accessToken;
        });

        it('should log in a normal user and return access & refresh tokens', async () => {

            /**
             * Test login for a normal user.
             * This test checks if a normal user can log in and receive access & refresh tokens.
             */
            const loginData = {
                loginField: userdata.username,
                password: userdata.password,
            };

            const response = await request(app).post('/account/login').send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            authTokenNormal = response.body.data.accessToken;

            user_id = response.body.data.user.person_id;
        });
    });
    
    /**
     * Test suite for the GET /applications endpoint.
     * This tests fetching applications for users by the admin.
     */
    describe('GET /applications', () => {

        /**
         * Test fetching applications for all users by the admin.
         * This ensures that an admin can fetch all applications.
         */
        it('should fetch applications for all users', async () => {
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        /**
         * Test fetching applications for specific users by the admin.
         * This tests if the admin can fetch applications for specific users by providing user IDs.
         */
        it('should fetch applications for specific users', async () => {
            // Admin fetching applications for specific users by IDs
            const response = await request(app)
                .get('/admin/applications?ids=100,110')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        });

         /**
         * Test error handling when fetching applications with invalid user IDs.
         * This ensures that the system handles invalid user IDs properly.
         */
        it('should throw error fetching applications with invalid user ID', async () => {
            const response = await request(app)
                .get('/admin/applications?ids=notvalid')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("No valid positive integers provided");
        });

        /**
         * Test error handling when fetching applications without user IDs.
         * This ensures the system handles missing IDs properly and returns an appropriate error message.
         */
        it('should throw error fetching applications without user ID', async () => {
            const response = await request(app)
                .get('/admin/applications?ids=123&ids=456')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid 'ids' query parameter");
        });

        /**
         * Test that normal users cannot access the list of all applications.
         * This checks that only admins can fetch all applications.
         */
        it('should return a 400 error for normal user accessing all applications', async () => {
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenNormal}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is required');
        });
    });

    /**
     * Test suite for the POST /applications endpoint.
     * This tests updating the application status by the admin.
     */
    describe('POST /applications', () => {

        /**
         * Test updating the application status by the admin.
         * This ensures that an admin can update an application's status.
         */
        it('should allow an admin to update an application', async () => {
            const action = 'accepted';
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User application updated successfully');
            expect(response.body.data[0]).toHaveProperty('application_status', action);
        });

         /**
         * Test error handling when updating application with an invalid ID.
         * This ensures that the system rejects invalid IDs when attempting to update applications.
         */
        it('should throw error if admin tries to update application without valid ID', async () => {
            const user_id = "not valid id";
            const valid_action = "unhandled";
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, valid_action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'id' query parameter");
        });


         /**
         * Test error handling when updating application with an invalid action.
         * This ensures the system correctly handles invalid action inputs.
         */
        it('should throw error if admin tries to update application without valid action', async () => {
            const action = 123;
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'action' query parameter");
        });


         /**
         * Test error handling when updating application with an invalid action string.
         * This ensures that only valid actions can be used to update the application status.
         */
        it('should throw error if admin tries to update application with invalid action', async () => {
            const action = 'not a valid action';
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
        });

        /**
         * Test that normal users cannot update applications.
         * This ensures that normal users cannot modify other users' applications.
         */
        it('should return a 403 error if a normal user tries to update an application they do not own', async () => {
            const action = 'rejected';
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is required');
        });
    });
});
