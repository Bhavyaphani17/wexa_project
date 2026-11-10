# StockFlow – Inventory Management System

StockFlow is an inventory management application developed as part of the Wexa AI Software Developer Intern assessment.

I built this application to help organizations manage their products and keep track of stock quantities from one place.

## What the application does

- Users can create an account and log in.
- Each organization can manage its own products.
- Products can be added, edited, deleted and searched.
- Users can view product quantities and prices.
- Low-stock products are identified automatically.
- Organizations can configure their default low-stock threshold.
- The dashboard displays inventory details such as total products, total stock, low-stock products and inventory value.

## Technologies Used

- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA
- **Frontend:** React, JavaScript, HTML, CSS
- **Database:** MySQL
- **Authentication:** JWT
- **Tools:** Maven, Postman, Git, GitHub

## Running the Application

**Backend**

1. Create a MySQL database named `stockflow_db`.
2. Configure the database credentials and JWT secret in `application.properties`.
3. Open the `stockflow` folder in the terminal.
4. Run:

```bash
./mvnw spring-boot:run
```

For Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

**Frontend**

1. Open the `frontend` folder in another terminal.
2. Install the dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## What I Learned

Working on StockFlow helped me understand how to connect a React frontend with Spring Boot APIs, implement JWT authentication, work with MySQL and maintain separate inventory data for different organizations.

## GitHub

[StockFlow – Source Code](https://github.com/Bhavyaphani17/wexa_project)

**Developed by Bhavya Phani Sri Vadlamudi**
