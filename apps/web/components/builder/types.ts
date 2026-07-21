import type { QuestionType } from "./question-types"

export interface BuilderQuestion {
  localId: string
  id?: string
  type: QuestionType
  label: string
  description?: string
  required: boolean
  options?: string[]
  order: number
}
