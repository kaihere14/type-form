import {
  AlignLeftIcon,
  CalendarIcon,
  ChevronDownSquareIcon,
  CircleDotIcon,
  HashIcon,
  MailIcon,
  SquareCheckIcon,
  StarIcon,
  TypeIcon,
  type LucideIcon,
} from "lucide-react"

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "email"
  | "number"
  | "date"
  | "rating"

export const CHOICE_QUESTION_TYPES: QuestionType[] = ["multiple_choice", "checkbox", "dropdown"]

export const QUESTION_TYPE_CONFIG: Record<QuestionType, { label: string; icon: LucideIcon }> = {
  short_text: { label: "Short answer", icon: TypeIcon },
  long_text: { label: "Long answer", icon: AlignLeftIcon },
  multiple_choice: { label: "Multiple choice", icon: CircleDotIcon },
  checkbox: { label: "Checkboxes", icon: SquareCheckIcon },
  dropdown: { label: "Dropdown", icon: ChevronDownSquareIcon },
  email: { label: "Email", icon: MailIcon },
  number: { label: "Number", icon: HashIcon },
  date: { label: "Date", icon: CalendarIcon },
  rating: { label: "Rating (5 stars)", icon: StarIcon },
}

export const QUESTION_TYPES = Object.keys(QUESTION_TYPE_CONFIG) as QuestionType[]
