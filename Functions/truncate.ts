// ("Hi everybody how are you ?", 10) => 'Hi everybod...'
const truncate: (str: string, maxSize: number) => string = (str, maxSize) => {
  return (str.length > maxSize) ? str.substring(0, maxSize) + '...' : str;
}

export default truncate;