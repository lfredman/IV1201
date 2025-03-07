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
        // You can initialize any common setup here if needed
    });

    afterAll(async () => {
        jest.setTimeout(10000); // Set timeout for async operations
        for (const user of createdUsers) {
            try {
                await deleteUserByUsername(user.username); // Clean up users after tests
            } catch (error) {
                console.error(`Error deleting user ${user.username}:`, error);
            }
        }
        await closeDB(); // Close DB connection after all tests are done
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

        expect(createdPerson).toBeTruthy(); // Check if a person is created
        expect(createdPerson?.username).toBe(personData.username); // Verify the username
        createdUsers.push(createdPerson!); // Keep track of created users for cleanup
    });

    it("should retrieve a user by username", async () => {
        const user = await getUserByUsername("john_doe");
        expect(user).toBeTruthy(); // Ensure the user is found
        expect(user?.username).toBe("john_doe"); // Verify the correct user is returned
    });

    it("should retrieve a user by email", async () => {
        const user = await getUserByEmail("john.doe@example.com");
        expect(user).toBeTruthy(); // Ensure the user is found
        expect(user?.email).toBe("john.doe@example.com"); // Verify the correct user is returned
    });

    it("should retrieve a user by PNR", async () => {
        const user = await getUserByPnr("1234567890");
        expect(user).toBeTruthy(); // Ensure the user is found
        expect(user?.pnr).toBe("1234567890"); // Verify the correct user is returned
    });

    it("should retrieve a user by ID", async () => {
        const user = createdUsers[0]; // Get the first created user
        const fetchedUser = await getUserById(user.person_id.toString());
        expect(fetchedUser).toBeTruthy(); // Ensure the user is found
        expect(fetchedUser?.person_id).toBe(user.person_id); // Verify the correct user is returned
    });

    it("should retrieve multiple users by IDs", async () => {
        const userIds = createdUsers.map((user) => user.person_id); // Get an array of user IDs
        const users = await getUsersByIds(userIds);
        expect(users).toBeTruthy(); // Ensure users are found
        expect(users?.length).toBeGreaterThan(0); // Ensure at least one user is returned
    });

    it("should retrieve all users", async () => {
        const users = await getUsersAll();
        expect(users).toBeTruthy(); // Ensure users are found
        expect(users?.length).toBeGreaterThan(0); // Ensure users are returned
    });

    it("should change a user's password", async () => {
        const user = createdUsers[0]; // Get the first created user
        const newPassword = "StrongPassw0rd!"; // Set a new password
        const result = await changePassword(user.person_id, newPassword);
        expect(result).toBe(true); // Ensure password change is successful
    });

    it("should delete a user by username", async () => {
        const user = createdUsers.pop(); // Get and remove the last user
        if (user) {
            const result = await deleteUserByUsername(user.username); // Delete the user by username
            expect(result).toBe(true); // Ensure the deletion is successful
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

        expect(createdAdmin).toBeTruthy(); // Ensure the admin is created
        expect(createdAdmin?.role_id).toBe(1); // Ensure the role ID is 1 for admin
        createdUsers.push(createdAdmin!); // Keep track of the created admin for cleanup
    });

    
});
