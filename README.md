# Backend README.md

````md
# CampusGPT Backend

AI-powered academic retrieval backend using:
- Flask
- ChromaDB
- RAG
- OCR
- Groq LLM
- Semantic Search

---

# Features

- Previous question paper retrieval
- OCR-based PDF understanding
- Semantic search using embeddings
- Attendance checking
- Official verification links
- Metadata-based retrieval
- Source PDF serving

---

# Tech Stack

- Python
- Flask
- ChromaDB
- Sentence Transformers
- LangChain
- Groq API
- PyMuPDF
- Tesseract OCR

---

# Project Structure

backend/
│
├── app.py
├── create_db.py
├── requirements.txt
│
├── data/
│   ├── question_papers/
│   └── attendance/
│
├── rag/
│   ├── loader.py
│   ├── chunker.py
│   ├── retriever.py
│   ├── vectorstore.py
│   ├── embeddings.py
│   ├── llm.py
│   └── metadata_extractor.py
│
├── utils/
│   ├── attendance_parser.py
│   └── attendance_query.py
│
└── chroma_db/

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your_repo_link>
cd backend
````

---

## 2. Create Virtual Environment

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Install Tesseract OCR

Download:
[https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)

After installation verify:

```bash
tesseract --version
```

---

## 5. Add Groq API Key

Create `.env`

```env
GROQ_API_KEY=your_api_key_here
```

---

# Adding Question Papers

Place PDFs inside:

```txt
data/question_papers/
```

Example:

```txt
20IT7301.pdf
20IT7402A.pdf
```

---

# Creating Vector Database

```bash
python create_db.py
```

You should see:

```txt
Vector Database Created Successfully
```

---

# Running Backend

```bash
python app.py
```

Backend runs on:

```txt
http://127.0.0.1:5000
```

---

# API Endpoint

## POST `/chat`

### Request

```json
{
  "question": "Give deep learning papers"
}
```

---

### Response

```json
{
  "answer": "...",
  "sources": [
    "20IT7301.pdf"
  ],
  "links": [
    {
      "filename": "20IT7301.pdf",
      "subject": "Deep Learning",
      "college": "VRSEC",
      "link": "https://vrsec.edu.in/questionpapers/20IT7301.pdf"
    }
  ]
}
```

---

# Attendance Feature

Attendance PDFs are parsed separately.

Query example:

```txt
Check attendance of student with roll no 238W1A1285
```

---

# Retrieval Pipeline

User Query
↓
Embedding Generation
↓
ChromaDB Semantic Retrieval
↓
Metadata Extraction
↓
LLM Response Generation
↓
Official Verification Links

---

# Future Scope

* Multi-college support
* Multilingual retrieval
* Voice assistant
* ERP integration
* AI explanation mode
* Analytics dashboard

---

# License

MIT License

````

---

# Frontend README.md

```md
# CampusGPT Frontend

Modern React frontend for CampusGPT Academic AI Assistant.

---

# Features

- Modern chatbot UI
- Real-time backend integration
- Semantic academic search
- PDF source display
- Official verification links
- Attendance query support
- Responsive design

---

# Tech Stack

- React
- Axios
- JavaScript
- CSS

---

# Project Structure

frontend/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js

---

# Setup Instructions

## 1. Navigate to Frontend

```bash
cd frontend
````

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://127.0.0.1:5173
```

---

# Backend Requirement

Ensure backend is already running:

```txt
http://127.0.0.1:5000
```

---

# Features Demonstration

## Academic Retrieval

```txt
Give deep learning previous papers
```

---

## Attendance Retrieval

```txt
Check attendance of student with roll no 238W1A1285
```

---

## Official Verification Links

Retrieved papers contain:

* PDF source chips
* Official verification URLs
* Subject metadata

---

# Frontend Components

* Chat interface
* Message rendering
* Source chips
* Official link cards
* Loading states
* Auto scrolling

---

# Screenshots

Add screenshots inside:

```txt
assets/
```

Recommended screenshots:

* Chat UI
* Paper retrieval
* Attendance feature
* Verification links

---

# Future Improvements

* Voice input
* Dark/light mode
* Authentication
* Student dashboard
* Mobile app
* Streaming responses

---

# License

MIT License

```
```
