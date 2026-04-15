import { rl } from "./rl.js"

export function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}
