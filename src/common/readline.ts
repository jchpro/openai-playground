import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

export function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

export function done() {
  readline.close();
}
