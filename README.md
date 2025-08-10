# School Management API

A Node.js RESTful API built with Express.js and MySQL for managing school data with geospatial functionality. The system allows users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## 🎯 Project Overview

This API provides two core functionalities:
1. **Add Schools**: Register new schools with their geographical coordinates
2. **List Schools by Proximity**: Retrieve schools sorted by distance from a user's location using precise geospatial calculations

The system uses the Haversine formula via the `geolib` library to calculate accurate distances between geographical coordinates, making it ideal for location-based school discovery applications.

## 🗄️ Database Schema

### Schools Table Structure

```sql
CREATE TABLE schools (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    CONSTRAINT unique_location UNIQUE (latitude, longitude)
);
```

### Schema Design Decisions

#### 🎯 DECIMAL(9,6) for Coordinates
- **Precision**: Supports up to 6 decimal places for latitude/longitude
- **Accuracy**: Provides approximately 0.11 meter (11 cm) precision at the equator
- **Reliability**: Avoids floating-point rounding errors that could affect geospatial calculations
- **Range**: Supports full global coordinate range (-90 to +90 for latitude, -180 to +180 for longitude)

#### 🔒 UNIQUE Constraint on Location
- **Data Integrity**: Prevents duplicate schools at identical coordinates
- **Spatial Consistency**: Maintains clean geospatial data for accurate distance calculations
- **Business Logic**: Ensures each physical location can only have one school entry

#### 🆔 Primary Key Strategy
- **UUID Format**: Uses VARCHAR(100) to accommodate UUID4 identifiers
- **Uniqueness**: Guarantees each school has a globally unique identifier
- **Scalability**: Prevents ID conflicts in distributed systems or data migrations

## 📡 API Endpoints

### 1. Add School
**Endpoint**: `POST /addSchool`

**Purpose**: Register a new school with validation

**Request Body**:
```json
{
    "name": "School Name",
    "address": "Full Address",
    "latitude": 40.7128,
    "longitude": -74.0060
}
```

**Validation Rules**:
- `name`: Required, non-empty string, trimmed
- `address`: Required, non-empty string, trimmed  
- `latitude`: Required, valid number between -90 and +90
- `longitude`: Required, valid number between -180 and +180
- Coordinates must not duplicate existing school location

**Success Response** (200):
```json
{
    "success": true,
    "schoolId": "21c7cd43-28db-4f16-9750-c08203560123"
}
```

**Error Responses**:
- `400`: Invalid input data or validation failure
- `409`: School already exists at these coordinates
- `500`: Database or server error

### 2. List Schools by Proximity
**Endpoint**: `GET /listSchools`

**Purpose**: Retrieve schools sorted by distance from user location

**Query Parameters**:
- `latitude` (required): User's latitude coordinate
- `longitude` (required): User's longitude coordinate

**Example**: `/listSchools?latitude=40.7128&longitude=-74.0060`

**Success Response** (200):
```json
{
    "success": true,
    "schools": [
        {
            "id": "uuid-1",
            "name": "Closest School",
            "address": "123 Main St",
            "latitude": 40.7130,
            "longitude": -74.0058,
            "distance": 0.023
        },
        {
            "id": "uuid-2", 
            "name": "Second Closest",
            "address": "456 Oak Ave",
            "latitude": 40.7140,
            "longitude": -74.0070,
            "distance": 0.156
        }
    ]
}
```

**Distance Calculation**:
- Uses Haversine formula for accurate great-circle distance
- Returns distance in kilometers with 3 decimal precision
- Accounts for Earth's curvature for geographical accuracy

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE school_management;
USE school_management;

# Create schools table
CREATE TABLE schools (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    CONSTRAINT unique_location UNIQUE (latitude, longitude)
);
```

### 3. Project Installation

```bash
# Clone or download the project
cd "Student Management System API"

# Install dependencies
npm install
```

**Required Dependencies**:
```json
{
    "express": "^5.1.0",
    "mysql2": "^3.14.3", 
    "dotenv": "^17.2.1",
    "geolib": "^3.3.4",
    "uuid": "^11.1.0",
    "body-parser": "^2.2.0"
}
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
DB_PORT=3306

# Server Configuration
PORT=3000
```

### 5. Start the Server

```bash
# Start the application
npm start

# Expected output:
# Running on: http://localhost:3000
```

## 📝 API Testing Examples

### Adding Schools

```bash
# Add New York City School
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NYC Public School 123",
    "address": "320 W 21st St, New York, NY 10011, USA", 
    "latitude": 40.7464,
    "longitude": -74.0018
  }'

# Add London Academy
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "London Academy",
    "address": "40 Holborn Viaduct, London, UK",
    "latitude": 51.5171,
    "longitude": -0.1092
  }'

# Add Tokyo International School
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tokyo International School",
    "address": "1-2-3 Shibuya, Tokyo, Japan",
    "latitude": 35.6762,
    "longitude": 139.6503
  }'
```

### Listing Schools by Proximity

```bash
# Find schools near Times Square, NYC
curl "http://localhost:3000/listSchools?latitude=40.7580&longitude=-73.9855"

# Find schools near London Bridge
curl "http://localhost:3000/listSchools?latitude=51.5074&longitude=-0.0877"

# Find schools near Tokyo Station  
curl "http://localhost:3000/listSchools?latitude=35.6812&longitude=139.7671"
```

## 🧪 Postman Collection Link

 https://web.postman.co/workspace/API-DEV~ee750a99-084d-4bcd-aaae-4319aba45ff7/collection/42553015-c7ce3965-94f0-4e65-836e-798c5f17de30?action=share&source=copy-link&creator=42553015


## 🛡️ Data Validation & Error Handling

### Input Validation
- **String Sanitization**: Trims whitespace and validates non-empty strings
- **Coordinate Validation**: Ensures latitude/longitude are valid numbers within geographic bounds
- **Required Fields**: All fields are mandatory and validated before database insertion
- **Type Safety**: Converts string coordinates to precise decimal numbers

### Error Handling Scenarios
- **400 Bad Request**: Invalid input data, missing fields, or malformed coordinates
- **409 Conflict**: Attempting to add school at existing coordinates
- **500 Internal Server Error**: Database connection issues or unexpected server errors

### Geographic Precision Notes
- **Coordinate Precision**: 6 decimal places provide ~11cm accuracy globally
- **Distance Calculation**: Uses spherical trigonometry for Earth's curvature
- **Performance**: Optimized for real-time proximity searches with proper indexing

## 🔧 Development Notes

### Architecture Decisions
- **Modular Design**: Separate files for routes, database logic, and utilities
- **Promise-based MySQL**: Uses `mysql2/promise` for async/await support
- **Environment Configuration**: Sensitive data isolated in `.env` files
- **UUID Primary Keys**: Globally unique identifiers for distributed systems

### Performance Considerations
- **Connection Pooling**: MySQL connection pool for concurrent request handling
- **Indexed Coordinates**: Consider adding spatial indexes for large datasets
- **Caching Strategy**: Implement Redis caching for frequently accessed school lists

### Security Features
- **Input Sanitization**: Prevents SQL injection and XSS attacks
- **Parameterized Queries**: All database queries use prepared statements
- **Environment Variables**: Database credentials secured outside source code

## 📚 Technology Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js for RESTful API development
- **Database**: MySQL with precise decimal coordinate storage
- **Geospatial**: Geolib library for accurate distance calculations
- **Validation**: Custom input validation with comprehensive error handling
- **Environment**: dotenv for configuration management

## 🎯 Future Enhancements

- Add authentication and authorization
- Implement school search by name or address
- Add bulk school import functionality
- Integrate with mapping services (Google Maps, OpenStreetMap)
- Add school rating and review system
- Implement caching for improved performance
- Add comprehensive API documentation with Swagger

---

**Author**: School Management API Team  
**Version**: 1.0.0  
**License**: MIT
