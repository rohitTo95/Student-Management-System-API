import { v4 as uuid } from 'uuid';

import pool from '../utils/connect-db.js';

export const create_school = async(data)=>{
   const id = uuid()
    const name = data.name;
    const address = data.address;
    const latitude = data.latitude;
    const longitude = data.longitude;
    
    try {
        const [result] = await pool.query('INSERT INTO schools (id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)', [id, name, address, latitude, longitude]);
        return { success: true, schoolId: id };
    } catch (error) {
        throw new Error(error.message);
    }
}