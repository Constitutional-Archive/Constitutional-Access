# 📜 Constitutional Archive Data Management & Search Interface

A full-stack web application for managing, organizing, and semantically searching historical constitutional archives. Designed to empower researchers, archivists, and the public with intuitive access to rich constitutional documents—text, PDFs, multimedia—through a modern, user-friendly interface.

---

## 🌐 Live Demo

> 🧪 Deployed on [Microsoft Azure](https://salmon-pond-060a97a10.6.azurestaticapps.net/)

---

## 🎯 Project Overview

This application provides:

- A secure **Admin Portal** for uploading and managing archival data with a hierarchical structure and metadata.
- A **Public Search Interface** for querying the archive using **natural language**.
- A scalable and modular **RESTful API** backend.
- Full CI/CD automation and deployment on **Azure Cloud**.

The project follows **Agile methodology**, **test-driven development (TDD)**, and uses modern **DevOps** principles.

---

## ✨ Key Features

### 🔐 Admin Portal

- **Secure Authentication**: Signup/Login with role-based access control (RBAC).
- **File Upload Interface**: Upload PDF, text, and multimedia files with associated metadata.
- **Hierarchical Data Structure**: Organize content like "Access to Memory" (AtoM).
- **Metadata Management**: Edit, delete, and reorganize files with rich metadata.

### 🔎 Public Search Interface

- **Modern UI**: Clean, responsive interface.
- **Natural Language Search**: Ask questions like "When was the South African Bill of Rights adopted?" and get accurate results.
- **Semantic Ranking**: Search results ranked using embeddings and NLP techniques.
- **Rich Results**: Includes text snippets, PDF links, and multimedia previews.

### 🔧 RESTful API

- **Generalized API Design**: Supports current search functionality and future extensions (e.g., WhatsApp chatbot, mobile app).
- **Natural Language Processing**: Embedding-based query handling for high relevance.
- **Filter & Refine**: Future-ready for filters based on metadata like publication date, document type, etc.

### ☁️ Deployment & CI/CD

- **Azure Hosting**: End-to-end deployment on Microsoft Azure.
- **Automated Pipelines**: CI/CD using Azure DevOps for builds, testing, and deployments.

---

## 🧠 Bonus Enhancements

- **Multilingual Support**: Optional language detection and translation.
- **Advanced Filters**: Refine search by document type, time period, metadata tags.
- **Smarter Search**: Incorporate LLM-based query rephrasing and intent detection.

---

## 🏗️ Tech Stack

| Frontend        | Backend         | DevOps & Cloud     | NLP & Search       |
|-----------------|------------------|---------------------|--------------------|
| React.js / Next.js | Node.js + Express | Azure App Services  | OpenAI Embeddings  |
| TailwindCSS / Bootstrap | RESTful API | Azure DevOps Pipelines | Vector DB / cosine similarity |
| Axios / SWR      | JWT Auth / OAuth | Azure Blob Storage | Natural Language Queries |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Azure Subscription
- OpenAI API Key (for semantic embeddings)
- Our RESTful API key to access its features from any host
- Git + CI/CD configured (e.g., Azure DevOps)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/constitutional-archive-search.git
cd constitutional-archive-search

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with Azure Blob credentials, OpenAI key, etc.

# Run locally
npm start
