export function IsSub<T>(subArray: T[], mainArray: T[]): boolean {
  return subArray.every((element) => mainArray.includes(element))
}
