import {
    createPerson,
    getUserByUsername,
    getUserByEmail,
    getUserByPnr,
    getUserById,
    getUsersByIds,
    getUsersAll,
    changePassword,
    deleteUserByUsername,
    createAdmin,
    Person,
} from "../models/accountModel";
import { closeDB } from "../utils/db";

describe("Person Service Tests", () => {
    let createdUsers: Person[] = [];

    beforeAll(async () => {

    });

    afterAll(async () => {
        jest.setTimeout(10000); 
        for (const user of createdUsers) {
            try {
                await deleteUserByUsername(user.username);
            } catch (error) {
                console.error(`Error deleting user ${user.username}:`, error);
            }
        }
        await closeDB(); 
    });

    it("should create a person", async () => {
        const personData = {
            name: "John",
            surname: "Doe",
            pnr: "1234567890",
            username: "john_doe",
            email: "john.doe@example.com",
            password: "password123",
        };

        const createdPerson = await createPerson(
            personData.name,
            personData.surname,
            personData.pnr,
            personData.username,
            personData.email,
            personData.password
        );

        expect(createdPerson).toBeTruthy(); 
        expect(createdPerson?.username).toBe(personData.username); 
        createdUsers.push(createdPerson!); 
    });

    it("should retrieve a user by username", async () => {
        const user = await getUserByUsername("john_doe");
        expect(user).toBeTruthy();
        expect(user?.username).toBe("john_doe"); 
    });

    it("should retrieve a user by email", async () => {
        const user = await getUserByEmail("john.doe@example.com");
        expect(user).toBeTruthy();
        expect(user?.email).toBe("john.doe@example.com"); 
    });

    it("should retrieve a user by PNR", async () => {
        const user = await getUserByPnr("1234567890");
        expect(user).toBeTruthy();
        expect(user?.pnr).toBe("1234567890"); 
    });

    it("should retrieve a user by ID", async () => {
        const user = createdUsers[0]; 
        const fetchedUser = await getUserById(user.person_id.toString());
        expect(fetchedUser).toBeTruthy();
        expect(fetchedUser?.person_id).toBe(user.person_id); 
    });

    it("should retrieve multiple users by IDs", async () => {
        const userIds = createdUsers.map((user) => user.person_id); 
        const users = await getUsersByIds(userIds);
        expect(users).toBeTruthy();
        expect(users?.length).toBeGreaterThan(0);
    });

    it("should retrieve all users", async () => {
        const users = await getUsersAll();
        expect(users).toBeTruthy();
        expect(users?.length).toBeGreaterThan(0); 
    });

    it("should change a user's password", async () => {
        const user = createdUsers[0]; 
        const newPassword = "StrongPassw0rd!"; 
        const result = await changePassword(user.person_id, newPassword);
        expect(result).toBe(true); 
    });

    it("should delete a user by username", async () => {
        const user = createdUsers.pop(); 
        if (user) {
            const result = await deleteUserByUsername(user.username); 
            expect(result).toBe(true); 
        }
    });

    it("should create an admin", async () => {
        const adminData = {
            name: "Admin",
            surname: "User",
            pnr: "9876543210",
            username: "admin_user",
            email: "admin@example.com",
            password: "adminPass123",
        };

        const createdAdmin = await createAdmin(
            adminData.name,
            adminData.surname,
            adminData.pnr,
            adminData.username,
            adminData.email,
            adminData.password
        );

        expect(createdAdmin).toBeTruthy(); 
        expect(createdAdmin?.role_id).toBe(1); 
        createdUsers.push(createdAdmin!);
    });

    
});
