# ClothCrafters Backend

The **ClothCrafters Backend** powers the tailor management application by handling requests, managing data storage, and processing business logic. This backend is built using **MySQL** for database management and a server-side framework (e.g., Express.js) for handling API requests.

## Key Features

- **Customer Management**: Stores and manages customer data, including order history and personal details.
- **Order Processing**: Handles the backend logic for placing, updating, and tracking custom clothing orders.
- **Inventory Management**: Manages fabric and accessory inventories for tailors and boutiques.
- **Tailor Recruitment**: Manages job listings and allows tailors to apply for jobs posted by boutiques.
- **Offline Support**: Stores local data when the app is used offline and syncs it once the internet connection is restored.
- **API Integration**: Provides RESTful APIs for the frontend application to communicate with the backend for data operations.

---

## Technologies Used

- **MySQL**: For database management and data storage.
- **Node.js** (with Express.js or another framework): For building the server-side API.
- **Sequelize**: For ORM (Object-Relational Mapping) to interact with MySQL.
- **JWT Authentication**: For user authentication and secure access to the backend services.

---

## Project Structure

- **config/**: Contains configuration files, including database connection settings.
- **controllers/**: Contains the logic for handling API requests (e.g., orders, customers, inventory).
- **models/**: Defines the database schemas and relationships using Sequelize.
- **routes/**: Defines the API endpoints that map to the controller methods.
- **middlewares/**: Handles authentication and other middleware functionality (e.g., JWT validation).
- **database/**: Contains MySQL setup scripts for initializing and managing the database.

---

## API Endpoints

Here’s an overview of the main API routes available:

### Customers
- `GET /customers`: Retrieve a list of all customers.
- `POST /customers`: Add a new customer.
- `GET /customers/:id`: Get details of a specific customer.
- `PUT /customers/:id`: Update a customer’s details.
- `DELETE /customers/:id`: Delete a customer.

### Orders
- `GET /orders`: Retrieve a list of all orders.
- `POST /orders`: Create a new order.
- `GET /orders/:id`: Get details of a specific order.
- `PUT /orders/:id`: Update an order's status.
- `DELETE /orders/:id`: Cancel an order.

### Inventory
- `GET /inventory`: Retrieve available inventory items (fabrics, accessories, etc.).
- `POST /inventory`: Add a new inventory item.
- `PUT /inventory/:id`: Update inventory item details.
- `DELETE /inventory/:id`: Remove an item from the inventory.

### Tailor Recruitment
- `GET /jobs`: Retrieve job listings for tailors.
- `POST /jobs`: Post a new job listing.
- `PUT /jobs/:id`: Update a job listing.
- `DELETE /jobs/:id`: Remove a job listing.

---

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **MySQL**: Install and configure MySQL.
- **Postman** or **curl**: For testing API endpoints.

### Steps to Run the Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/Akshat-Pandya/ClothCrafters-backend.git
    ```

2. Navigate to the project directory:
    ```bash
    cd ClothCrafters-backend
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file to configure environment variables (such as database connection details):
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=clothcrafters
    JWT_SECRET=your_jwt_secret
    ```

5. Run the MySQL scripts to set up the database (scripts are located in the `database/` folder).

6. Start the server:
    ```bash
    npm start
    ```

The backend will be running at `https://clothcrafters-backend.onrender.com` by default.

---

## Database Setup

1. Ensure MySQL is running.
2. Use the SQL scripts provided in the `database/` folder to initialize your database schema and seed data:
    ```bash
    mysql -u root -p clothcrafters < database/schema.sql
    ```

---

## Testing API Endpoints

You can use **Postman** or **curl** to test the backend API. For example:

```bash
curl -X GET https://clothcrafters-backend.onrender.com/customers

These are the steps to be followed to use the application with ease.