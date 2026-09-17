# 🧠 Quiz App — Microservices Architecture

A full-stack **Quiz Application** built using **Spring Boot Microservices**. The project demonstrates how multiple independent services communicate with each other through **Eureka Service Discovery** and an **API Gateway**, with a separate frontend for interacting with the application.

## 🚀 Features

* 📝 Create and manage quizzes
* ❓ Question management
* 🎯 Generate quizzes based on available questions
* 🔍 Fetch questions through dedicated microservices
* 🌐 Centralized API access through API Gateway
* 🔎 Service discovery using Netflix Eureka
* 🔄 Communication between independent microservices
* 💻 Separate frontend application
* 🧩 Modular and scalable microservices architecture

## 🏗️ Architecture

The application follows a microservices-based architecture:

```text
                    ┌──────────────────┐
                    │    Frontend      │
                    │   Web Client     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   API Gateway    │
                    │     :8765        │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │ Question Service│     │  Quiz Service   │
        │                 │     │                 │
        └────────┬────────┘     └────────┬────────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Eureka Server   │
                    │     :8761        │
                    └──────────────────┘
```

## 📂 Project Structure

```text
Quiz-app/
│
├── API-Gateway/
│   └── API Gateway Service
│
├── eureka-server/
│   └── Service Discovery Server
│
├── Microservices1/
│   └── Question Service
│
├── Microservices2/
│   └── Quiz Service
│
└── frontend/
    └── Frontend Application
```

The repository currently contains these main modules: `API-Gateway`, `Microservices1`, `Microservices2`, `eureka-server`, and `frontend`.

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Spring Cloud
* Spring Cloud Gateway
* Spring Cloud Netflix Eureka
* REST APIs
* Maven

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Architecture & Tools

* Microservices Architecture
* Service Discovery
* API Gateway
* Load Balancing
* RESTful Communication
* Git & GitHub
* IntelliJ IDEA

## 🔑 Core Microservices

### 1. Eureka Server

The Eureka Server acts as the **Service Registry**.

All microservices register themselves with Eureka, allowing other services to discover them dynamically instead of relying on hardcoded service locations.

**Port:** `8761`

```text
http://localhost:8761
```

### 2. Question Service

Responsible for managing quiz questions.

Typical responsibilities include:

* Adding questions
* Retrieving questions
* Managing question data
* Providing questions to the Quiz Service

### 3. Quiz Service

Responsible for quiz-related operations.

It communicates with the Question Service to obtain questions and generate quizzes.

Typical responsibilities include:

* Creating quizzes
* Selecting questions
* Managing quiz data
* Returning quiz questions to clients

### 4. API Gateway

The API Gateway provides a **single entry point** for clients.

Instead of the frontend communicating directly with every microservice:

```text
Frontend
   │
   ▼
API Gateway
   │
   ├──► Question Service
   │
   └──► Quiz Service
```

The gateway uses service discovery and routes requests to the appropriate microservice.

**Port:** `8765`

### 5. Frontend

The frontend provides the user interface for interacting with the quiz application.

It communicates with the backend through the API Gateway.

## 🔄 Request Flow

A typical request follows this flow:

```text
User
 │
 ▼
Frontend
 │
 ▼
API Gateway
 │
 ▼
Eureka Server
 │
 ▼
Required Microservice
 │
 ▼
Response
 │
 ▼
Frontend
```

For example, when a user creates a quiz:

```text
Frontend
   │
   │ POST /quiz/create
   ▼
API Gateway
   │
   ▼
Quiz Service
   │
   │ Request questions
   ▼
Question Service
   │
   ▼
Quiz Service
   │
   ▼
API Gateway
   │
   ▼
Frontend
```

## ⚙️ Configuration

### Eureka Server

The Eureka server runs on:

```properties
server.port=8761
```

### API Gateway

The API Gateway runs on:

```properties
server.port=8765
```

It connects to Eureka using:

```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

Services can then be accessed through the gateway rather than directly through their individual ports.

## 💻 Getting Started

### Prerequisites

Make sure you have installed:

* Java 17+
* Maven
* Node.js
* npm
* Git
* IntelliJ IDEA or another Java IDE

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush5605/Quiz-app.git

cd Quiz-app
```

### 2. Start Eureka Server

Open the `eureka-server` project and run the Spring Boot application.

The Eureka dashboard should be available at:

```text
http://localhost:8761
```

### 3. Start Question Service

Run the Spring Boot application inside:

```text
Microservices1
```

Wait until it successfully registers with Eureka.

### 4. Start Quiz Service

Run the Spring Boot application inside:

```text
Microservices2
```

The service should register itself with Eureka.

### 5. Start API Gateway

Run the application inside:

```text
API-Gateway
```

The gateway runs on:

```text
http://localhost:8765
```

### 6. Start Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL provided by Vite in your browser.

## 📡 API Gateway

The frontend should communicate with the backend through the API Gateway.

Example:

```text
Frontend
   │
   ▼
http://localhost:8765
   │
   ├── /question
   │
   └── /quiz
```

This approach keeps the frontend independent from the internal locations and ports of individual microservices.

## 🧩 Why Microservices?

This project demonstrates several important advantages of microservices:

### Independent Services

Each business capability is separated into its own service.

### Service Discovery

Eureka allows services to discover each other dynamically.

### API Gateway

The gateway provides a centralized entry point for clients.

### Scalability

Individual services can be scaled independently.

### Maintainability

Each service has a focused responsibility, making the application easier to develop and maintain.

## 📚 What I Learned

Through this project, I explored:

* Spring Boot application development
* Microservices architecture
* Spring Cloud
* Netflix Eureka
* Service discovery
* API Gateway
* Inter-service communication
* REST APIs
* Load-balanced service routing
* Frontend-backend integration
* Distributed application structure

## 🔮 Future Improvements

Possible future enhancements include:

* 🔐 JWT-based authentication
* 👤 User registration and login
* 🏆 Leaderboard system
* ⏱️ Timed quizzes
* 📊 User performance analytics
* 🗄️ Database optimization
* 🐳 Docker containerization
* ☁️ Cloud deployment
* 🔄 Centralized configuration using Spring Cloud Config
* ⚡ Resilience4j for fault tolerance
* 📈 Monitoring using Spring Boot Actuator and Micrometer

## 👨‍💻 Author

**Ayush Auti**

Computer Engineering Student | Full Stack Developer | AI/ML Enthusiast

GitHub:
https://github.com/Ayush5605

---

⭐ If you found this project useful, consider giving the repository a star!
