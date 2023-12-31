import { format } from 'util'

function createError (code: string, message: string, statusCode: number = 500): (...args: any[]) => Error {
  code = code.toUpperCase()

  return function CustomError () {
    const err: any = Error(format(message, ...arguments))
    err.code = code
    err.statusCode = statusCode
    return err
  }
}

export const FST_MP_INVALID_OPTION = createError('FST_MP_INVALID_OPTION', '%s is expected to be "%s", but recieved "%s"')
export const FST_MP_CONFLICT_CONFIG = createError('FST_MP_CONFLICT_CONFIG', 'Cannot enable `addContentTypeParser` togather with `addHooks`')
export const FST_MP_FIELD_SIZE_LIMIT = createError('FST_MP_FIELD_SIZE_LIMIT', 'Field "%s" size limit reached.', 413)
export const FST_MP_FIELDS_LIMIT = createError('FST_MP_FIELDS_LIMIT', 'Fields limit reached.', 413)
export const FST_MP_FILE_SIZE_LIMIT = createError('FST_MP_FILE_SIZE_LIMIT', 'File "%s" size limit reached.', 413)
export const FST_MP_FILES_LIMIT = createError('FST_MP_FILES_LIMIT', 'Files limit reached.', 413)
export const FST_MP_PARTS_LIMIT = createError('FST_MP_PARTS_LIMIT', 'Parts limit reached.', 413)
export const FST_MP_UNEXPECTED = createError('FST_MP_UNEXPECTED', 'Unexpected error occured.', 500)
