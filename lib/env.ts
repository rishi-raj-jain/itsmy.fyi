import 'dotenv/config'

export function getENV(name) {
  try {
    return import.meta.env[name] || process.env[name]
  } catch (e) {
    return null
  }
}
