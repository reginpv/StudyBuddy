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

1.  **📥 Ingestion:** Users upload study materials (PDFs/Notes), which are processed and stored securely using **Vercel Blob**.
2.  **🧠 Embedding & Storage:** The text is chunked and converted into vector embeddings using Google's model, then stored in **database** for efficient searching.
3.  **🔍 Retrieval:** When a user asks a question, the app performs a **semantic search** in database to find the most relevant paragraphs from the uploaded documents.
4.  **✨ Generation:** The retrieved context is sent to the **Gemini API**, which generates an accurate, context-aware answer based specifically on the user's material.
