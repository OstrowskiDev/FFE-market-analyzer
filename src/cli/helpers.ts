import { rl } from "./rl.js"

export function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

export function logger(...args: any[]) {
  if (process.env.NODE_ENV === "production") return
  console.log(...args)
}
