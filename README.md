# 🤖 GenAI Code Reviewer SaaS

An AI-powered **code review SaaS application** that helps developers review pull requests and code changes using Large Language Models (LLMs).

Users can submit a Pull Request or code diff and receive an AI-generated code review with **real-time streaming responses**. The application also provides authentication, a dashboard, persistent review history, and GitHub API integration.

The project is designed as a production-style SaaS application rather than a simple AI script, focusing on real-world concerns such as authentication, multi-user data isolation, streaming, API integration, error handling, and product UX.

---

## ✨ Features

### 🔐 Authentication & User Management

* User authentication using JWT-based sessions.
* Secure access to user-specific reviews.
* Multi-user data isolation.
* Server-side user identification to prevent unauthorized access to other users' reviews.
* Protection against **IDOR (Insecure Direct Object Reference)** vulnerabilities.

### 🤖 AI-Powered Code Reviews

* Submit a Pull Request or code diff for analysis.
* Uses an LLM to analyze submitted code.
* Reviews code using structured categories such as:

  * 🐛 Bugs
  * 🎨 Code Style
  * 📝 Commit Message
* Designed to make AI-generated reviews easier to understand and display in the UI.

### ⚡ Real-Time Streaming

Instead of waiting for the entire AI response to finish, the application streams the generated review to the client as it is produced.

The streaming flow is:

```text
Browser
   ↓
SSE Connection
   ↓
Express Server
   ↓
LLM API
   ↓
Streaming Chunks
   ↓
React State Updates
   ↓
Incremental UI Rendering
```

The application uses **Server-Sent Events (SSE)** because the communication required for the review is primarily one-directional: server → client.

This provides a better user experience by allowing users to see the beginning of the review while the rest is still being generated.

### 🐙 GitHub Integration

* Integration with the GitHub API.
* Supports working with Pull Request/code diff information.
* Handles GitHub API rate limits.
* Understands standard Git diff structures such as:

```diff
@@ -1,5 +1,7 @@
-old code
+new code
```

### 📊 Dashboard & Review History

* Dashboard for accessing previous reviews.
* Persistent review history.
* Users can revisit previous AI-generated reviews.
* Provides a SaaS-style experience rather than a one-time code analysis tool.

### 🛡️ Error & Loading States

The application is designed to handle more than the successful/happy path.

Examples include:

* Loading states while a review is being generated.
* Empty states when no reviews exist.
* Error states when an AI or API request fails.
* Handling interrupted streaming responses.

---

## 🏗️ Architecture

The application follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │       React         │
                    └──────────┬──────────┘
                               │
                               │ HTTP / SSE
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │       Express       │
                    └──────┬───────┬──────┘
                           │       │
                 ┌─────────┘       └─────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   Database      │         │    GitHub API   │
        │                 │         │                 │
        │ Users / Reviews │         │ Pull Requests   │
        └─────────────────┘         │ / Diffs         │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     LLM API     │
                                    │                 │
                                    │ AI Code Review  │
                                    └─────────────────┘
```

---

## 🔄 How a Code Review Works

1. The user signs in to the application.
2. The user submits a Pull Request or code diff.
3. The backend verifies the authenticated user.
4. The application retrieves or processes the required GitHub diff.
5. The diff is structured into a prompt for the LLM.
6. The backend sends the prompt to the LLM.
7. The LLM begins generating the review.
8. Generated content is streamed from the backend using **SSE**.
9. The frontend receives the chunks and updates the UI incrementally.
10. The completed review is stored in the database.
11. The user can access the review later through the dashboard.

---

## 🔒 Security

Security is an important part of the application architecture.

### User Data Isolation

Every review query is associated with the authenticated user's `user_id`.

The server should derive the user identity from the verified JWT rather than trusting a user ID supplied by the client.

Conceptually:

```text
JWT
 ↓
Authenticated User
 ↓
Server extracts user_id
 ↓
Database query filters by user_id
 ↓
Only that user's reviews are returned
```

This helps prevent an **IDOR vulnerability**, where a malicious user could attempt to change a review ID and access another user's data.

---

## ⚡ Why SSE Instead of WebSockets?

This project uses **Server-Sent Events (SSE)** for AI response streaming.

SSE is appropriate because the main requirement is:

```text
Server → Client
```

The server continuously sends generated AI content to the browser.

WebSockets provide two-way communication:

```text
Client ↔ Server
```

However, full bidirectional communication is not necessary for this use case.

Therefore, SSE provides a simpler solution with less infrastructure complexity while still supporting real-time AI response streaming.

---

## 🧠 LLM Prompt Design

The AI review is organized into structured categories rather than returning one large block of text.

Example categories include:

```text
Code Review
├── Bugs
├── Code Style
└── Commit Message
```

Structured reviews make the generated output easier to:

* Parse
* Display
* Understand
* Extend
* Integrate into the frontend

For very large Pull Requests, token limits become an important consideration. A future improvement would be to introduce intelligent diff chunking and combine the results into a final review.

---

## 🗄️ Data Persistence

Review information is stored so users can access their previous reviews from the dashboard.

Storing the full diff makes it possible to revisit a review without fetching the original information from GitHub again.

However, this also introduces a storage-growth tradeoff.

At larger scale, possible improvements could include:

* Storing a reference to the original Pull Request.
* Fetching the diff on demand.
* Applying retention policies.
* Expiring older diffs.

---

## 🛠️ Technology Concepts

The project demonstrates practical understanding of:

* Generative AI / LLM integration
* AI prompt engineering
* Real-time streaming
* Server-Sent Events (SSE)
* REST APIs
* JWT authentication
* Multi-user data isolation
* IDOR prevention
* GitHub API integration
* Git diff processing
* Database persistence
* React state management
* Express backend development
* SaaS product architecture
* Loading, error, and empty states

---

## 📁 Project Structure

A possible high-level structure is:

```text
genai-code-reviewer/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── ...
│
├── database/
│   └── ...
│
├── README.md
└── ...
```

> The exact structure may vary depending on the implementation.

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have the required development environment installed.

You will also need credentials/configuration for the services used by your implementation, such as:

* Database
* JWT authentication
* GitHub API
* LLM provider

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd <project-directory>
```

Install the frontend and backend dependencies according to the project's package configuration.

### Environment Variables

Create the appropriate environment configuration files for your local environment.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token
LLM_API_KEY=your_llm_api_key
```

> Never commit real API keys, passwords, tokens, or secrets to GitHub.

### Run the Application

Start the backend and frontend using the project's configured development commands.

Once running, open the frontend in your browser and sign in to begin reviewing code.

---

## 📈 Future Improvements

Possible future improvements include:

* Large-diff chunking and intelligent summarization.
* GitHub OAuth integration.
* Direct Pull Request review comments.
* Review severity levels.
* Code quality scoring.
* More advanced security vulnerability detection.
* Review comparison between commits.
* Improved retry handling for failed LLM requests.
* Usage limits and rate limiting per user.
* Free and paid SaaS tiers.
* Usage-based pricing.
* Review analytics.
* Better handling of interrupted AI streams.
* Scalable storage/retention strategies.

---

## 💰 SaaS Monetization

The application can be monetized using a subscription or usage-based model.

A possible approach:

```text
Free
├── Limited reviews
└── Basic review features

Pro
├── Higher review limits
├── Advanced reviews
└── Additional features

Team
├── Multiple users
├── Shared reviews
└── Higher usage limits
```

Another option is **per-review pricing**, where users pay based on the number of AI code reviews they perform.

---

## 🎯 Why This Project?

This project goes beyond simply connecting an application to an LLM.

It demonstrates how to build a **production-style AI SaaS application** with:

* Authentication
* Persistent user data
* Real-time AI streaming
* External API integration
* Security considerations
* Structured AI output
* Dashboard/history
* Error handling
* Product-oriented UX

The combination of **Generative AI + full-stack development + SaaS architecture** makes this project a practical demonstration of modern software engineering skills.

---

## 📚 Key Concepts Learned

The most important technical concepts demonstrated by this project are:

### 1. Streaming Responses

AI-generated responses can be delivered incrementally instead of waiting for the complete response.

### 2. Server-Sent Events

SSE maintains an HTTP connection through which the server can continuously send generated data to the client.

### 3. Authentication & Authorization

JWT-based authentication identifies users, while server-side authorization ensures users can only access their own resources.

### 4. GitHub API Integration

The application communicates with GitHub to work with Pull Requests and code diffs while considering API rate limits.

### 5. Prompt Engineering

Code diffs are structured into prompts that guide the LLM toward useful and structured code-review results.

### 6. SaaS Architecture

Multiple users, persistent data, authentication, dashboards, and product-style UX turn the application into a SaaS rather than a simple script.

---

## 👨‍💻 Author

**Your Name**

AI Undergraduate | Aspiring Artificial Intelligence Engineer

---

## ⭐ Project Status

🚧 **In Development**

This project is being developed as a production-style Generative AI SaaS application and will continue to evolve with additional features, security improvements, and scalability enhancements.

---

## 📄 License

Add your preferred license here, such as the MIT License, if applicable to your project.
