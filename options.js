const ARGV = require('./argv').get('process')
const { GenerateVersion } = require('./utils')

const Delay = ARGV.get('--delay') ? parseInt(ARGV.get('--delay')) : 1000
const Filename = ARGV.get('--filename') ? ARGV.get('--filename') : 'capture_###.jpg'
const Dirname = ARGV.get('--path') ? ARGV.get('--path') : './Captures'
const FrameCount = ARGV.get('--frame') ? parseInt(ARGV.get('--frame')) : -1
const Version = GenerateVersion()

module.exports = {
  Delay,
  Filename,
  FrameCount,
  Version,
  Dirname: `${Dirname}_${Version}`,
}