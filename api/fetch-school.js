import pool from "../utils/connect-db.js";
import { getPreciseDistance } from "geolib";

const calculateDistance = (source, target) =>{
    const distance = getPreciseDistance( 
    { latitude: source.latitude, longitude: source.longitude }, 
    { latitude: target.latitude, longitude: target.longitude });
    return (distance/1000) //Distance in KM
}
// Get all schools without distance calculation
export const get_all_schools = async() => {
    try {
        const [results] = await pool.query('SELECT * FROM schools ORDER BY name');
        return { success: true, schools: results };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get schools with distance calculation from a source point
export const get_list_of_schools = async(data) => {
    const sourceLatitude = data.latitude;
    const sourceLongitude = data.longitude;
    
    try {
        const [results] = await pool.query('SELECT * FROM schools');
        const res = results.map((result) => {
            let targetLatitude = result.latitude;
            let targetLongitude = result.longitude;

            let distance = calculateDistance(
                { latitude: sourceLatitude, longitude: sourceLongitude },
                { latitude: targetLatitude, longitude: targetLongitude }
            );

            return {
                ...result,
                distance: distance
            };
        });
        
        // Sort by distance in ascending order (nearest schools first)
        res.sort((a, b) => a.distance - b.distance);
        
        return { success: true, schools: res };
    } catch (error) {
        throw new Error(error.message);
    }
}