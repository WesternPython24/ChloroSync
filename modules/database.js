import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync('../data.sqlite');


database.exec(`
    CREATE TABLE IF NOT EXISTS PlantContainer (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        location TEXT,
        name TEXT
    );

    CREATE TABLE IF NOT EXISTS Plant (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        containerID INTEGER NOT NULL REFERENCES PlantContainer(id),
        name TEXT
    );
    
    CREATE TABLE IF NOT EXISTS PlantDataLog (
        plantID INTEGER REFERENCES Plant(id),
        timestamp INTEGER NOT NULL,
        temperature INTEGER,
        humidity INTEGER,
        groundMmoisture INTEGER,
        lightLevel INTEGER,
        plantRGB
    );

    `
);

export default database;
