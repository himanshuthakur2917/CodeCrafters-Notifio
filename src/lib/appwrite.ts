"use client";

import { Client, Account, Databases, ID, Query } from 'appwrite';

// Debug environment variables
console.log('Appwrite Configuration:');
console.log('ENDPOINT:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
console.log('DATABASE_ID:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
console.log('EVENTS_COLLECTION_ID:', process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID);

// Appwrite configuration
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id');

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'event-reminder-db';
export const EVENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || 'events';

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID === 'your-project-id') {
    console.error('❌ NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set or using default value');
}
if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID === 'event-reminder-db') {
    console.error('❌ NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set or using default value');
}
if (!process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID === 'events') {
    console.error('❌ NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID is not set or using default value');
}

// Export client for additional services if needed
export default client;

// Auth service
export const authService = {
    async createAccount(email: string, password: string, name: string) {
        try {
            const response = await account.create(ID.unique(), email, password, name);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async login(email: string, password: string) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await account.deleteSession('current');
        } catch (error) {
            // If session doesn't exist, that's fine
            console.log('No session to delete');
        }
    },

    async deleteAllSessions() {
        try {
            await account.deleteSessions();
        } catch (error) {
            console.log('No sessions to delete');
        }
    },

    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    },

    async updatePassword(oldPassword: string, newPassword: string) {
        try {
            return await account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            throw error;
        }
    }
};

// Database service for events
export const databaseService = {
    async createEvent(userId: string, eventData: {
        name: string;
        date: string;
        time: string;
        description: string;
    }) {
        try {
            console.log('Creating event with:', {
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                userId,
                eventData
            });
            
            const result = await databases.createDocument(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                ID.unique(),
                {
                    userId,
                    name: eventData.name,
                    date: eventData.date,
                    time: eventData.time,
                    description: eventData.description,
                    createdAt: new Date().toISOString()
                }
            );
            console.log('Create event result:', result);
            return result;
        } catch (error) {
            console.error('Database create event error:', error);
            throw error;
        }
    },

    async getUserEvents(userId: string) {
        try {
            console.log('Fetching events for user:', userId, 'from database:', DATABASE_ID, 'collection:', EVENTS_COLLECTION_ID);
            
            const result = await databases.listDocuments(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('createdAt')
                ]
            );
            console.log('Fetch events result:', result);
            return result;
        } catch (error) {
            console.error('Database fetch events error:', error);
            throw error;
        }
    },

    async deleteEvent(documentId: string) {
        try {
            return await databases.deleteDocument(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                documentId
            );
        } catch (error) {
            throw error;
        }
    },

    async updateEvent(documentId: string, eventData: {
        name?: string;
        date?: string;
        time?: string;
        description?: string;
    }) {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                documentId,
                eventData
            );
        } catch (error) {
            throw error;
        }
    }
};
