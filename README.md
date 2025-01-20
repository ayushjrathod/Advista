## Team OutOfBounds

#### Task 1: Automated Research and Trigger Finder (ART Finder)
#### UI Demo
[![UIdemo](https://img.youtube.com/vi/rJC_-6QHzKo/1.jpg)](https://www.youtube.com/watch?v=rJC_-6QHzKo)
#### Project Demo
[![UIdemo](https://img.youtube.com/vi/ikxR2ujRr5I/0.jpg)](https://www.youtube.com/watch?v=ikxR2ujRr5I)
#### Intelligent pain point and trigger detection demo
[![UIdemo](https://img.youtube.com/vi/M97WjHGASys/0.jpg)](https://www.youtube.com/watch?v=M97WjHGASys)


#### 

#### Table of Contents

- [Project Description](#project-description)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

### Project Description: What we did as a solution

ADVISTA is a solution that identifies user pain points and triggers from multiple data sources like Google, YouTube, Reddit, Quora, blogs, forums, social media, and app reviews. It analyzes competitor ads and strategies to uncover high-performing hooks, CTAs, and content formats based on the target audience, ad objectives, and ad formats. It scrapes data from across the internet, summarizes key triggers and user problems, and suggests the best-performing hooks, CTAs, and solutions tailored to the topic and audience. ADVISTA also provides direct links to scraped YouTube videos and competitor ads for easy validation and inspiration. It visualizes insights with word clouds and includes a chatbot to help generate CTAs and hooks.

### Getting Started

#### Prerequisites

- Node.js
- npm

First, clone the repository:

```bash
git clone https://github.com/Team-OutOfBounds/LevelSuperMind_OutOfBounds.git
```

Then, install the dependencies:

```bash
npm install
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Tech Stack

#### Frontend

- Next.js: A React framework for server-side rendering and generating static websites.
- React: A JavaScript library for building user interfaces.
- Tailwind CSS: A utility-first CSS framework for rapid UI development.
- NextAuth.js: Authentication for Next.js applications.
- Zod: A TypeScript-first schema declaration and validation library.
- Three.js: A JavaScript 3D library.
- Spline: Spline is a free 3D design software.
- ShadCN: A UI library

#### Backend

- FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.
- AstraDB: A serverless, scalable, cloud-native database-as-a-service built on Apache Cassandra.

### Folder Structure

- app/: Contains the main application code, including authentication, API, chat, and dashboard modules.
- components/: Reusable React and ShadCN components used throughout the application.
- context/: React context providers for managing global state.
- helpers/: Utility functions and helper methods.
- hooks/: Custom React hooks.
- lib/: Library code and third-party integrations.
- model/: Mongoose models for MongoDB collections.
- public/: Static assets such as images, fonts, and icons.
- tyles/: Global and component-specific styles.
- types/: TypeScript type definitions and interfaces.

### Environment Variables

We are including the .env file with this reposistory. So if testing is needed to be done it can be done without any hassle.
