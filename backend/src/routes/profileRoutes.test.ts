import request from 'supertest';
import app from '../app';
import { closeDB } from '../utils/db';
import { createAdmin, deleteUserByUsername } from '../models/accountModel';
import { upsertApplication } from '../models/applicationModel';
import bcrypt from 'bcryptjs';

describe('Profile Management', () => {
    
    let authTokenAdmin = ''; 
    let authTokenNormal = ''; 
    let user_id = -1; 
    let adminUser = {  
        name: 'testadminprofile',
        surname: 'testadminprofile',
        pnr: '2947889484',
        username: 'testadminprofile',
        email: 'testadminprofile@admin.admin',
        password: 'AdminPassword123!',
    };

    const userdata = {  
        name: 'Leffe',
        surname: 'Larsson',
        pnr: '1919181919',
        username: 'leffe',
        email: 'leffe@example.com',
        password: 'Password123!',
    };

    beforeAll(async () => {
        // Before all tests, create an admin user and a normal user, hash the admin password
        let passwordhash = await bcrypt.hash(adminUser.password, 10);
        await createAdmin(adminUser.name, adminUser.surname, adminUser.pnr, adminUser.username, adminUser.email, passwordhash);
        let data = await request(app).post('/account/register').send(userdata);
        const userId = data.body.data.user.person_id;
        await upsertApplication(userId, "unhandled");  

        // Login the normal user to retrieve their authentication token
        const loginData = {
            loginField: userdata.username,
            password: userdata.password,
        };

        const loginResponse = await request(app).post('/account/login').send(loginData);
        authTokenNormal = loginResponse.body.data.accessToken;  
        user_id = loginResponse.body.data.user.person_id; 

        // Login the admin user to retrieve their authentication token
        const loginDataAdmin = {
            loginField: adminUser.username,
            password: adminUser.password,
        };

        const loginResponseAdmin = await request(app).post('/account/login').send(loginDataAdmin);
        authTokenAdmin = loginResponseAdmin.body.data.accessToken;  
    });

    afterAll(async () => {
        // After all tests, clean up by deleting created users and closing the DB connection
        await request(app)
            .post('/profile/competence/')
            .set('Authorization', `Bearer ${authTokenNormal}`)
            .send({competences: []});  
        
        await request(app)
            .post('/profile/availability/')
            .set('Authorization', `Bearer ${authTokenNormal}`)
            .send({availabilities: []});  

        await deleteUserByUsername(adminUser.username); 
        await deleteUserByUsername(userdata.username);  
        await closeDB();  
    });
   
    describe('POST /profile/competence/', () => {
        it('should update competence data for authenticated user', async () => {
            // Test case for updating competences with valid data
            const competences = [
                {
                  "competence_id": 2,
                  "competence_name": "lotteries",
                  "years_of_experience": 11
                },
                {
                  "competence_id": 3,
                  "competence_name": "roller coaster operation",
                  "years_of_experience": 9
                },
                {
                  "competence_id": 1,
                  "competence_name": "ticket sales",
                  "years_of_experience": 7
                }
              ];

            const response = await request(app)
                .post('/profile/competence/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({competences});
                
            expect(response.status).toBe(201);  
            expect(response.body.message).toBe('User competence updated successfully');
        });

        it('should return 400 for invalid competence data', async () => {
            // Test case for handling invalid competence data
            const updatedCompetence = {};  

            const response = await request(app)
                .post('/profile/competence/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send(updatedCompetence);

            expect(response.status).toBe(400);  
            expect(response.body.message).toBe('Invalid competences data');
        });
    });

    describe('GET /profile/competence/:id', () => {
        it('should fetch competence data for a specific user as admin', async () => {  
            // Test case where an admin tries to fetch competence data for a specific user
            const response = await request(app)
                .get(`/profile/competence/${user_id}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`);
            
            expect(response.status).toBe(200);  
            expect(response.body.message).toBe('User competence parsed successfully');
            expect(response.body.data).toHaveProperty('competences'); 
        });
    
        it('should return 403 for normal user accessing other users\' competence data', async () => {
            // Test case where a normal user tries to fetch another user's competence data (should be denied)
            const response = await request(app)
                .get(`/profile/competence/10`)  
                .set('Authorization', `Bearer ${authTokenNormal}`);
    
            expect(response.status).toBe(403);  
            expect(response.body.message).toBe('Access denied. You can only access your own resources');
        });
    
        it('should fetch competence data for authenticated user', async () => {
            // Test case where the normal user tries to fetch their own competence data
            const response = await request(app)
                .get('/profile/competence/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
    
            expect(response.status).toBe(200);  
            expect(response.body.message).toBe('User competence parsed successfully');
            expect(response.body.data).toHaveProperty('competences');  
        });
    });
    
    describe('POST /profile/availability/', () => {
        it('should update availability data for authenticated user', async () => {
            // Test case to update availability for a user
            const availabilities = 
                [
                    {
                        "from_date": "2025-03-07",
                        "to_date": "2025-03-10"
                    }
                ]
            ;
            const response = await request(app)
                .post('/profile/availability/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({availabilities});

            expect(response.status).toBe(201);  
            expect(response.body.message).toBe('User availability updated successfully');
        });

        it('should return 400 for invalid availability data', async () => {
            // Test case for invalid availability data
            const updatedAvailability = {}; 

            const response = await request(app)
                .post('/profile/availability/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send(updatedAvailability);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Availabilities data is invalid or missing.');
        });
    });

    describe('GET /profile/availability/', () => {
        it('should fetch availability data for authenticated user', async () => {
            // Test case for fetching availability data of the authenticated user
            const response = await request(app)
                .get('/profile/availability/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
            
            expect(response.status).toBe(200);  
            expect(response.body.message).toBe('User availability parsed successfully');
            expect(response.body.data).toHaveProperty('availabilities');
        });
    });

    describe('POST /profile/application/', () => {
        it('should allow an user to submit an application', async () => {
            // Test case for user submitting an application
            const response = await request(app)
                .post('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send();

            expect(response.status).toBe(201); 
            expect(response.body.message).toBe('User application updated successfully');
            expect(response.body.data).toHaveProperty('status', 'unhandled');
        });

        it('should not allow user to change status of application', async () => {
            // Test case where user tries to change the application status (should not be allowed)
            const response = await request(app)
                .post('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({ action: 'accepted' });

                expect(response.status).toBe(201);  
                expect(response.body.message).toBe('User application updated successfully');
                expect(response.body.data).toHaveProperty('status', 'unhandled');
        });
    });

    describe('GET /application/', () => {
        it('should fetch application data for authenticated user', async () => {
            // Test case for fetching application data for the authenticated user
            const response = await request(app)
                .get('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
            
            expect(response.status).toBe(200); 
            expect(response.body.message).toBe('User application retrieved successfully');
            expect(response.body.data).toHaveProperty('status');
        });
    });

});
