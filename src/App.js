import { useState } from "react";
import "./App.css";
import InputTextArea from "./components/InputTextArea";
import { minimumAssistant, withExampleAssistant } from "./assistant";

function App() {
  const [model, setModel] = useState("gpt-3.5-turbo");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [deltaResponse, setDeltaResponse] = useState("");

  const complete = async () => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          ...withExampleAssistant,
          {
            role: "user",
            content: `[Frage] ${question}\n\n[Richtig] ${answer}`,
          },
        ],
        stream: true,
      }),
    };

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    try {
      let result = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              const data = decoder.decode(value);

              const lines = data
                .toString()
                .split("\n")
                .filter((line) => line.trim() !== "");
              for (const line of lines) {
                const message = line.replace(/^data: /, "");
                if (message === "[DONE]") {
                  return; // Stream finished
                }
                try {
                  const parsed = JSON.parse(message);
                  const newToken = parsed.choices[0].delta?.content; // chat
                  // const newToken = parsed.choices[0].text // completion
                  console.log(result);
                  if (newToken) {
                    result += newToken;
                    setDeltaResponse(result);
                  }
                } catch (error) {
                  console.error(
                    "Could not JSON parse stream message",
                    message,
                    error
                  );
                }
              }
              return pump();
            });
          }
        },
      });
    } catch (error) {
      console.error("An error occurred during OpenAI request", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Multiple Choice KI Demo</h1>
      <div className="w-full max-w-lg mt-4">
        <div>
          <label for="model">Modell:</label>
          <select
            id="model"
            className="ml-2"
            onChange={(ev) => setModel(ev.target.value)}
          >
            <option>gpt-3.5-turbo</option>
            <option>gpt-4</option>
          </select>
        </div>
        <div className="p-2 mt-4 border-2 rounded-xl">
          <InputTextArea
            onChange={(ev) => setQuestion(ev.target.value)}
            placeholder="Frage..."
            className="font-semibold"
          />
          <div className="p-2 mt-2">
            <div className="flex items-center font-semibold">
              <input
                type="checkbox"
                id="correct_answer"
                checked
                className="accent-indigo-600"
              />
              <label for="correct_answer" className="w-full pl-2">
                <InputTextArea
                  onChange={(ev) => setAnswer(ev.target.value)}
                  placeholder="Korrekte Antwort..."
                />
              </label>
            </div>
            {deltaResponse.split("[Falsch]").map((txt, i) => {
              const trimmed = txt.trim();
              if (trimmed.length > 0) {
                return (
                  <div
                    className="flex items-center mt-1 font-semibold"
                    key={"answer_" + i}
                  >
                    <input
                      type="checkbox"
                      id={"answer_" + i}
                      className="accent-indigo-600"
                    />
                    <label for={"answer_" + i} className="w-full pl-2">
                      {txt}
                    </label>
                  </div>
                );
              }
            })}
          </div>
          <div className="flex justify-center w-full">
            <button
              className="p-2 px-3 font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500"
              onClick={() => complete()}
            >
              Berechne
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
