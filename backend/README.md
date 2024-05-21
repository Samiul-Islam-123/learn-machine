**Backend Overview**

This backend serves as the core of the application, providing the following functionalities:

- **Web Scrapping:**
  - Utilizes the `MakeGoogleSearch` function to perform Google searches.
  - Scrapes data from web pages using the `ScrapeData` and `scrapeImages` functions.

- **Gemini AI Integration:**
  - Connects to the Gemini Generative AI API using a unique API key.
  - Accesses various AI models, including "gemini-pro" and "gemini-pro-vision."

- **AI Prompt Processing:**
  - Receives AI prompts from the frontend via Socket.IO.
  - Processes prompts based on their type ("text" or "file") and feature ("material" or "roadmap"). 
  - Generates responses using suitable Gemini AI models.

- **Web API Request Handling:**
  - Makes API requests to external services, such as currency exchange rates.

- **Real-time Communication:**
  - Establishes real-time communication between the backend and frontend using Socket.IO.
  - Emits events to the frontend to provide updates on AI processing status and send generated responses.
 
**Start the development Server :**
    ```bash
    npm run dev
**Workflow**

1. **User Input:**
   - Users input prompts (text or files) through the frontend.

2. **Prompt Reception:**
   - The backend receives the prompts via Socket.IO.

3. **AI Model Selection:**
   - Based on the prompt type ("text" or "file") and feature, the backend selects the appropriate Gemini AI model.

4. **AI Processing:**
   - The prompt is passed to the selected AI model for processing.

5. **Response Generation:**
   - The backend receives the AI-generated response.

6. **Response Transmission:**
   - The backend sends the generated response to the frontend via Socket.IO.

7. **Frontend Display:**
   - The frontend displays the AI-generated response to the user.
