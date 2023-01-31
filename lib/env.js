// Load from dotenv
import * as dotenv from 'dotenv'
dotenv.config()

// Populated and return from process.env
export function getENV(name) {
  try {
    return process.env[name]
  } catch (e) {
    return null
  }
}
