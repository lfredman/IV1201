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
        let passwordhash = await bcrypt.hash(adminUser.password, 10);
        await createAdmin(adminUser.name, adminUser.surname, adminUser.pnr, adminUser.username, adminUser.email, passwordhash);
        let data = await request(app).post('/account/register').send(userdata);
        const userId = data.body.data.user.person_id;
        await upsertApplication(userId, "unhandled");

        // Now login the normal user to get the token
        const loginData = {
            loginField: userdata.username,
            password: userdata.password,
        };

        const loginResponse = await request(app).post('/account/login').send(loginData);
        authTokenNormal = loginResponse.body.data.accessToken;  // Set the auth token here
        user_id = loginResponse.body.data.user.person_id; // Set user_id for later use

        // Now login the normal user to get the token
        const loginDataAdmin = {
            loginField: adminUser.username,
            password: adminUser.password,
        };

        const loginResponseAdmin = await request(app).post('/account/login').send(loginDataAdmin);
        authTokenAdmin = loginResponseAdmin.body.data.accessToken;  // Set the auth token here
    });

    afterAll(async () => {
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
              ]

            const response = await request(app)
                .post('/profile/competence/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({competences});
                
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User competence updated successfully');
        });

        it('should return 400 for invalid competence data', async () => {
            const updatedCompetence = {}; // Invalid competence data

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
            const response = await request(app)
                .get(`/profile/competence/${user_id}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`);
            
            expect(response.status).toBe(201);  // Changed from 201 to 200
            expect(response.body.message).toBe('User competence parsed successfully');
            expect(response.body.data).toHaveProperty('competences');  // Fixed property name
        });
    
        it('should return 403 for normal user accessing other users\' competence data', async () => {
            const response = await request(app)
                .get(`/profile/competence/10`)
                .set('Authorization', `Bearer ${authTokenNormal}`);
    
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Access denied. You can only access your own resources');  // Fixed message
        });
    
        it('should fetch competence data for authenticated user', async () => {
            const response = await request(app)
                .get('/profile/competence/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
    
            expect(response.status).toBe(201);  // Changed from 201 to 200
            expect(response.body.message).toBe('User competence parsed successfully');
            expect(response.body.data).toHaveProperty('competences');  // Fixed property name
        });
    });
    
    describe('POST /profile/availability/', () => {
        it('should update availability data for authenticated user', async () => {
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
            const updatedAvailability = {}; // Invalid availability data

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
            const response = await request(app)
                .get('/profile/availability/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User availability parsed successfully');
            expect(response.body.data).toHaveProperty('availabilities');
        });
    });

    describe('POST /profile/application/', () => {
        it('should allow an user to submit an application', async () => {
            const response = await request(app)
                .post('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send();

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User application updated successfully');
            expect(response.body.data).toHaveProperty('status', 'unhandled');
        });

        it('should not allow user to change status of application', async () => {
            const response = await request(app)
                .post('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`)
                .send({ action: 'accepted' });

                expect(response.status).toBe(201);
                expect(response.body.message).toBe('User application updated successfully');
                expect(response.body.data).toHaveProperty('status', 'unhandled');
        });


    describe('GET /application/', () => {
        it('should fetch application data for authenticated user', async () => {
            const response = await request(app)
                .get('/profile/application/')
                .set('Authorization', `Bearer ${authTokenNormal}`);
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User application retrieved successfully');
            expect(response.body.data).toHaveProperty('status');
        });
    });

    });

});
