\# CrimeGraph



A full-stack criminal network analysis and relationship visualization system designed to organize case, person, and relationship data in a connected graph-based interface.



\## Overview



CrimeGraph is a web application that helps organize investigation-related information such as cases, persons, and relationships between individuals.



The application provides a visual graph interface where relationships can be represented as connections between entities, making it easier to explore and understand interconnected data.



\## Features



\- Create and manage investigation cases

\- Add person records

\- Create relationships between persons

\- Visualize relationships using an interactive graph

\- REST APIs for backend data management

\- MySQL database integration

\- React-based frontend

\- Spring Boot backend



\## Tech Stack



\### Frontend



\- React 19

\- Vite

\- React Router

\- React Flow

\- Axios

\- Lucide React



\### Backend



\- Java 21

\- Spring Boot 4.1.1

\- Spring Data JPA

\- Spring Web MVC

\- Spring Validation

\- Lombok

\- Maven



\### Database



\- MySQL



\## Project Structure



```text

crimegraph/

│

├── crimegraph/                 # Spring Boot Backend

│   ├── src/

│   │   ├── main/

│   │   │   ├── java/

│   │   │   │   └── com/crimegraph/

│   │   │   │       ├── controller/

│   │   │   │       ├── entity/

│   │   │   │       └── repository/

│   │   │   └── resources/

│   │   │       └── application.properties

│   │   ├── test/

│   │   └── pom.xml

│   │

│   └── mvnw

│

├── frontend/                  # React Frontend

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

```



\## Backend API



The backend exposes REST endpoints for managing the main entities:



| Entity        | Endpoint             |

| ------------- | -------------------- |

| Cases         | `/api/cases`         |

| Persons       | `/api/persons`       |

| Relationships | `/api/relationships` |



\## Database Configuration



CrimeGraph uses MySQL with a database named:



```text

crimegraph

```



Before running the backend, configure your local MySQL credentials in:



```text

crimegraph/src/main/resources/application.properties

```



Example:



```properties

spring.datasource.url=jdbc:mysql://localhost:3306/crimegraph

spring.datasource.username=root

spring.datasource.password=YOUR\_PASSWORD

```



> Replace `YOUR\_PASSWORD` with your local MySQL password.



\## Running the Project



\### 1. Start the Backend



Open a terminal inside the backend directory:



```bash

cd crimegraph

```



Run:



```bash

mvn spring-boot:run

```



The backend runs on:



```text

http://localhost:8080

```



\### 2. Start the Frontend



Open another terminal inside the frontend directory:



```bash

cd frontend

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



The frontend will normally be available at:



```text

http://localhost:5173

```



\## Development



The frontend communicates with the Spring Boot backend through REST APIs.



```text

React Frontend

&#x20;     │

&#x20;     │ REST API

&#x20;     ▼

Spring Boot Backend

&#x20;     │

&#x20;     │ JPA

&#x20;     ▼

MySQL Database

```



\## Future Enhancements



\* Advanced graph-based relationship analysis

\* Search and filtering for investigation data

\* Authentication and role-based access

\* Advanced investigation dashboards

\* Enhanced relationship visualization

\* Additional investigation data sources



\## Author



\*\*Aditi Vishwakarma\*\*



B.Tech Computer Science and Engineering



GitHub: \[aditi0923](https://github.com/aditi0923)





