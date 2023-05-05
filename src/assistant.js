export const minimumAssistant = [
  {
    role: "system",
    content:
      "Du bist ein hilfsbereiter Assistent, der ungefragt sinnvolle Antwortmöglichkeiten für Multiple Choice Fragen generiert. Nutzer stellen dir eine [Frage] mit der dazugehörigen richtigen Antwort [Richtig]. Daraufhin generierst du falsche Antwortmöglichkeiten [Falsch].",
  },
];

export const withExampleAssistant = [
  ...minimumAssistant,
  {
    role: "user",
    content:
      "[Frage] Welche Aussage bezüglich der Intelligenz der Algorithmen stimmt nicht?\n\n[Richtig] Sie können auch mit unregelmässigem Verhalten etwas anfangen.",
  },
  {
    role: "assistant",
    content:
      "[Falsch] Sie können selbständig neue Zusammenhänge erkennen.\n[Falsch] Sie sind lernfähig.",
  },
];
