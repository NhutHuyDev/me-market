import { Types } from 'mongoose'

export default function IsValidObjectId(id: string) {
  if (id && Types.ObjectId.isValid(id)) {
    if (String(new Types.ObjectId(id)) === id) return true
    return false
  }
  return false
}
