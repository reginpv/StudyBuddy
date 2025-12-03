# 📚 Study Buddy AI (Workshop Project)

This is a basic **RAG (Retrieval-Augmented Generation)** application built during a hands-on technical workshop.

### 🎓 Project Context

The goal of this project was to learn the fundamentals of AI engineering by building a functional "Chat with your Data" assistant. It serves as a starter kit for understanding how to connect a database, file storage, and an LLM to create intelligent applications.

- **Fullstack development** Built with **Next.js 15** (App Router), **TailwindCSS**.
- **Deployment:** Fully deployed on **Vercel** FREE tier.
- **Database:** Uses **Neon PostgreSQL** as a serverless vector database (via `pgvector`) to store and query semantic data(embeddings).
- **AI Engine:** Powered by **Google Gemini** (`gemini-2.5-flash` model) for generation and **Google's Embedding Models** for vectorization.

### 🔄 The RAG Pipeline (How it Works)

The application follows a standard Retrieval-Augmented Generation lifecycle:

1.  **Ingestion:** Users upload study materials (PDFs/Notes), which are processed and stored securely using **Vercel Blob**.
2.  **Embedding & Storage:** The text is chunked and converted into vector embeddings using Google's model, then stored in **database** for efficient searching.
3.  **Retrieval:** When a user asks a question, the app performs a **semantic search** in database to find the most relevant paragraphs from the uploaded documents.
4.  **Generation:** The retrieved context is sent to the **Gemini API**, which generates an accurate, context-aware answer based specifically on the user's material.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher)
- A **Vercel account** (free tier works perfectly)
- A **Neon account** for PostgreSQL database
- A **Google AI Studio account** for Gemini API access

### Required API Keys & Services

#### 1. **Google Gemini API Key**

- Visit [Google AI Studio](https://aistudio.google.com/)
- Create a new API key
- Save it for later use in your environment variables

#### 2. **Neon PostgreSQL Database**

- Go to [Neon Console](https://neon.tech/)
- Create a new project and database
- **Enable pgvector extension:**
  - Navigate to your database in the Neon console
  - Run the following SQL command:

```sql
    CREATE EXTENSION IF NOT EXISTS vector;
```

- Copy your connection string (you'll need this for `DATABASE_URL`)

#### 3. **Vercel Blob Storage**

- Create a Vercel account at [vercel.com](https://vercel.com)
- Create a new Blob store in your Vercel dashboard
- The blob storage credentials will be automatically available after linking your project

### Installation Steps

1. **Clone the repository**

```bash
   git clone <your-repo-url>
   cd study-buddy-ai
```

2. **Install dependencies**

```bash
   npm install
```

3. **Link your Vercel project**

```bash
   vercel link
```

Follow the prompts to connect your local project to your Vercel account.

4. **Pull environment variables**

```bash
   vercel env pull
```

This will download all your Vercel-managed environment variables (like Blob storage credentials) into a `.env.local` file.

5. **Add additional environment variables**

   Open `.env.local` and add the following:

```env
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here

   # Neon Database (if not already pulled from Vercel)
   DATABASE_URL=your_neon_connection_string_here
```

6. **Run database migrations** (if applicable)

```bash
   npm run db:migrate
   # or your specific migration command
```

7. **Start the development server**

```bash
   npm run dev
```

8. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see your Study Buddy AI in action!

### Deployment

The app is designed to be deployed on Vercel with zero configuration:

```bash
vercel deploy
```

Make sure all your environment variables are set in the Vercel dashboard under your project settings.

---

## 📝 Environment Variables Summary

| Variable                | Description                       | Where to Get It                                  |
| ----------------------- | --------------------------------- | ------------------------------------------------ |
| `GEMINI_API_KEY`        | Google Gemini API key             | [Google AI Studio](https://aistudio.google.com/) |
| `DATABASE_URL`          | Neon PostgreSQL connection string | [Neon Console](https://neon.tech/)               |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token         | Auto-configured via `vercel link`                |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** Neon PostgreSQL with pgvector
- **Storage:** Vercel Blob
- **AI:** Google Gemini 2.5 Flash, Google Embedding Models
- **Deployment:** Vercel

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon pgvector Guide](https://neon.tech/docs/extensions/pgvector)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [RAG Architecture Overview](https://www.pinecone.io/learn/retrieval-augmented-generation/)

---

## 🤝 Contributing

This is a workshop project, but contributions and improvements are welcome! Feel free to open issues or submit pull requests.
