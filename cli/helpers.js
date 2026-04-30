import { rl } from "./rl.js"

export function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

export function logger(message) {
  if (process.env.NODE_ENV === "production") return
  console.log(message)
}
