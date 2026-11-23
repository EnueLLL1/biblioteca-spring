export function extractApiError(error, fallbackMessage = 'Ocorreu um erro inesperado.') {
  const status = error?.status ?? error?.response?.status
  const data = error?.response?.data
  const fieldErrors =
    data?.fieldErrors && typeof data.fieldErrors === 'object' ? data.fieldErrors : {}

  const serverMessage =
    typeof data?.message === 'string' && data.message.trim()
      ? data.message
      : typeof error?.message === 'string' && error.message.trim()
        ? error.message
        : ''

  if (status === 409) {
    return {
      status,
      message: serverMessage || 'Registro duplicado já cadastrado.',
      fieldErrors,
    }
  }

  return {
    status,
    message: serverMessage || fallbackMessage,
    fieldErrors,
  }
}
