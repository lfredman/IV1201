import request from 'supertest';
import app from '../app';
import { closeDB } from '../utils/db';
import { createAdmin, deleteUserByUsername } from '../models/accountModel';
import { upsertApplication } from '../models/applicationModel';
import bcrypt from 'bcryptjs';

describe('Admin Application Management', () => {
    
    let authTokenAdmin = '';
    let authTokenNormal = '';
    let user_id = -1;
    let adminUser = {
        name: 'testadmin',
        surname: 'testadmin',
        pnr: '2947889484',
        username: 'admin_user',
        email: 'admin@admin.admin',
        password: 'AdminPassword123!'
    };

    const userdata = {
        name: 'John',
        surname: 'Doe',
        pnr: '1919191919',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
    };

    beforeAll(async () => {
        // Hash password for admin user
        let passwordhash = await bcrypt.hash(adminUser.password, 10);
        await createAdmin(adminUser.name, adminUser.surname, adminUser.pnr, adminUser.username, adminUser.email, passwordhash);
        let data = await request(app).post('/account/register').send(userdata);
        const userId = data.body.data.user.person_id;
        await upsertApplication(userId, "unhandled");
    });

    afterAll(async () => {
        await deleteUserByUsername(adminUser.username);
        await deleteUserByUsername(userdata.username);
        await closeDB(); 
    });

    describe('POST /account/login', () => {
        it('should log in an admin user and return access & refresh tokens', async () => {
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

        it('should log in an normal user and return access & refresh tokens', async () => {
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
    
    describe('GET /applications', () => {
        it('should fetch applications for all users', async () => {
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should fetch applications for specific user', async () => {
            const response = await request(app)
                .get('/admin/applications?ids=100,110')
                .set('Authorization', `Bearer ${authTokenAdmin}`);


            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Applications parsed successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        });

        it('should throw error fetching applications with invalid userid', async () => {
            const response = await request(app)
                .get('/admin/applications?ids=notvalid')
                .set('Authorization', `Bearer ${authTokenAdmin}`);


            expect(response.status).toBe(400);
            expect(response.body.message).toBe("No valid positive integers provided");
        });

        it('should throw error fetching applications without userid', async () => {
            const response = await request(app)
                .get('/admin/applications?ids=123&ids=456')
                .set('Authorization', `Bearer ${authTokenAdmin}`);


            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid 'ids' query parameter");
        });

        it('should return a 400 error for normal user accessing all applications', async () => {
            const response = await request(app)
                .get('/admin/applications')
                .set('Authorization', `Bearer ${authTokenNormal}`);
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is required');
        });        
    });

    
    describe('POST /applications', () => {
        it('should allow an admin to update application', async () => {
            const action = 'accepted';
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User application updated successfully');
            expect(response.body.data[0]).toHaveProperty('application_status', action);  // Ensure the status is updated
        });

        it('should throw error if an admin to update application without valid id', async () => {
            const user_id = "not valid id"; // Not a valid id
            const valid_action = "unhandled"; // Not a valid id
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, valid_action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'id' query parameter");
        });

        it('should throw error if an admin to update application without valid action', async () => {
            const action = 123; // Not a valid action
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid or missing 'action' query parameter");
        });

        it('should throw error if an admin to update application without valid action from list', async () => {
            const action = 'not a valid action';
            const response = await request(app)
                .post('/admin/applications')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .send({ id: user_id, action });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
        });

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
