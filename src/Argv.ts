const RG_ASSIGN = /=/
const RG_PARAMETER = /^-{1,2}/

export class Argv {

  format: ArgvFormatter

  constructor(public parameters: string[]) {
    this.format = new ArgvFormatter(this)
  }

  get(parameter: string) {
    const index = this.parameters.indexOf(parameter)
    if (index < 0) return false

    const io = this.parameters[index].split(RG_ASSIGN)
    if (io.length == 2) return io[1]

    const next_param = this.parameters[index+1]
    if (typeof next_param == 'string' && !next_param.match(RG_PARAMETER)) {
      return next_param
    }

    return true
  }

  has(parameter: string) {
    return this.parameters.indexOf(parameter) > -1
  }

  getIndex(parameter: string) {
    var regex = new RegExp(parameter)

    for (let i = 0; i < this.parameters.length; i++) {
      if (this.parameters[i].match(regex) != null) {
        return i
      }
    }

    return -1
  }

  at(index: number) {
    return this.parameters[index]
  }

  getValueAt(index: number) {
    const item = this.parameters[index]
    if (item == null) return null
    if (!item.match(RG_PARAMETER)) return item
    return this.get(item)
  }

  static register(id: string, parameters: string[]) {
    return this.ARGVs[id] = new Argv(parameters)
  }

  static get(id: string) {
    return this.ARGVs[id]
  }

  static ARGVs: Record<string, Argv> = {}

}

export class ArgvFormatter {

  constructor(public argv: Argv) {}

  getString(parameter: string, defaultValue: string = '') {
    if (this.argv.has(parameter)) {
      return this.argv.get(parameter) as string
    }

    return defaultValue
  }

  getInt(parameter: string, defaultValue: number = 0) {
    if (this.argv.has(parameter)) {
      const value = this.argv.get(parameter) as string
      return parseInt(value)
    }

    return defaultValue
  }

  getFloat(parameter: string, defaultValue: number = 0.0) {
    if (this.argv.has(parameter)) {
      const value = this.argv.get(parameter) as string
      return parseFloat(value)
    }

    return defaultValue
  }

  getBoolean(parameter: string, defaultValue: boolean = false) {
    if (this.argv.has(parameter)) {
      return this.argv.get(parameter) as boolean
    }

    return defaultValue
  }

  getJSON(parameter: string, defaultValue: any = null) {
    if (this.argv.has(parameter)) {
      const value = this.argv.get(parameter) as string
      return JSON.parse(value)
    }

    return defaultValue
  }

}

// Register process argv by default
if (process && Array.isArray(process.argv)) {
  Argv.register('process', process.argv.slice(2))
}