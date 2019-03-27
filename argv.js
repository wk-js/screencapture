/**
 * @typedef {Object} ARGVObject
 * @function get
 * @function has
 * @function index
 */

/**
 * @type {Object.<string, ARGVObject>}
 */
const ARGVS = {}

module.exports.register = function( id, argv ) {

  ARGVS[id] = {

    /**
     * @param {string} arg
     * @returns {boolean|string}
     */
    get(arg) {
      const index = ARGVS[id].index(arg)

      if (index > -1) {
        const io = argv[index].split(/=/)
        if (io.length == 2) return io[1]

        if (typeof argv[index+1] == 'string' && !argv[index+1].match(/^-/)) {
          return argv[index+1]
        }

        return true
      }

      return false
    },

    /**
     * @param {string} arg
     * @returns {boolean}
     */
    has(arg) {
      return ARGVS[id].index(arg) > -1
    },

    /**
     * @param {string} arg
     * @returns {number}
     */
    index(arg) {
      var regex = new RegExp(`${arg}`)

      for (var i = 0; i < argv.length; i++) {
        if (argv[i].match(regex) != null) {
          return i
        }
      }

      return -1
    },

    at(index) {
      return argv[index]
    }

  }
}

/**
 * @param {string} id
 * @return {ARGVObject}
 */
module.exports.get = function( id ) {
  return ARGVS[id]
}

module.exports.register('process', process.argv.slice(2))