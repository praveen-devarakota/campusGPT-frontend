# CampusGPT — Frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| HTTP Client | Axios |
| Language | JavaScript |
| Build Tool | Vite |

---

## Request Workflow

```
User types query
    ↓
Axios POST → http://127.0.0.1:5000/chat
    ↓
Response received { answer, sources, links }
    ↓
Answer rendered in chat bubble
    ↓
PDF source chips displayed
    ↓
Official verification link cards displayed
```

1. **User submits a question** via the chat input (Enter or Send button)
2. **Axios** sends a `POST /chat` request to the Flask backend with the query
3. **Response** arrives with `answer`, `sources` (PDF filenames), and `links` (verification metadata)
4. **Chat bubble** renders the answer text
5. **Source chips** link directly to the raw PDF files served by the backend
6. **Verification cards** display subject, college, and an external URL for each matched paper
