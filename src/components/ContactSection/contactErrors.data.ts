import type { ContactFieldErrors, FieldError } from "@/lib/validateContactForm";

export const contactErrorMessages: Record<
  keyof ContactFieldErrors,
  Record<FieldError, string>
> = {
  name: {
    required: "Укажите, как к вам обращаться.",
    too_long: "Сократите имя до 100 символов.",
    invalid:
      "Введите имя буквами. Между частями имени допустимы пробел, дефис или апостроф — без повторов.",
  },
  country: {
    required: "Выберите страну из списка.",
    too_long: "Выберите страну из списка.",
    invalid: "Выберите страну из списка.",
  },
  phone: {
    required: "Укажите номер телефона.",
    too_long: "Проверьте номер телефона и код страны.",
    invalid:
      "Введите корректный номер страны из списка. Для международного номера укажите код с +.",
  },
  comment: {
    required: "Комментарий можно оставить пустым.",
    too_long: "Сократите комментарий до 1000 символов.",
    invalid: "Введите комментарий текстом или оставьте поле пустым.",
  },
};
