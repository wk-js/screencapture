const Path = require('path')

function GenerateArray(count, callback = null) {
  const arr = []
  let i = 0
  while(i < count) {
    callback ? arr.push(callback(i)) : arr.push( i )
    i++
  }
  return arr
}

function Pad(number, length, char) {
  const str = number+""
  if (str.length >= length) return str
  return Pad(char+str, length, char)
}

function GenerateVersion() {
  const now = new Date()

  const date = Pad(now.getDate(), 2, "0")
  const month = Pad(now.getMonth()+1, 2, "0")
  const year = Pad(now.getFullYear(), 4, "0")
  const hours = Pad(now.getHours(), 2, "0")
  const minutes = Pad(now.getMinutes(), 2, "0")
  const seconds = Pad(now.getSeconds(), 2, "0")

  return `${year}-${month}-${date}_${hours}-${minutes}-${seconds}`
}

function EnsureDir(path) {
  path = Path.normalize(path)
  const isAbsolute = path.match(/^(\/|[a-zA-Z]:)/)
  const parts = path.split(/\\|\//)

  const initial = isAbsolute ? parts.shift() : '.'

  const a = Array.prototype.reduce.call(parts, function(res, d, index, arr) {
    if (d == '.') return res
    res += '/' + d
    return res
  }, initial)

  return parts
}

function Interpolate(regex, str, something) {
  const padding_match = str.match(regex)//(/#+/)
  const padding = Array.isArray(padding_match) ? padding_match[0] : '#'
  return str.replace(padding, something)
}

module.exports = {
  GenerateArray,
  GenerateVersion,
  Pad,
  Interpolate,
  EnsureDir
}