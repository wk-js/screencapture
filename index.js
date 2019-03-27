const Screenshot = require('screenshot-desktop')
const ARGV = require('./argv').get('process')
const Path = require('path')
const { ensureDir, remove } = require('asset-pipeline/js/utils/fs')
const { Delay, Filename, Dirname, FrameCount, Version } = require('./options')
const { Pad, GenerateArray, EnsureDir, Interpolate } = require('./utils')
const Os = require('os')
const Fs = require('fs')

const TmpDirname = Path.join(Os.tmpdir(), 'ScreenCapture')

let i = -1
let recording = false

function Capture()
{
  if (!recording) return

  i++

  let index = i
  if (FrameCount > 0 && i >= FrameCount) {
    index = i%FrameCount
  }

  const filename = Path.join(Dirname, Interpolate(/#+/, Filename, index))

  const before = new Date()
  Screenshot({ format: 'jpg', filename })
  .then(() => {
    console.log(`File ${filename} saved`);

    const after = new Date()
    const delay = Math.max(Delay - (after - before), 0)
    setTimeout(Capture, delay);
  })
}

ensureDir(Dirname)
.then(() => ensureDir(TmpDirname))
.then(() => {recording = true; Capture()})

process.on('SIGINT', function() {
  recording = false

  let first = 0
  let concat = null

  const dirname = Path.resolve(Dirname)
  const frame_rate = 1/30
  const frame_duration = `\nduration ${frame_rate}\n`

  if (FrameCount > 0 && i >= FrameCount) {
    first = (i+1)%FrameCount
    concat = GenerateArray(FrameCount, (index) => {
      const filename = Interpolate(/#+/, Filename, (first + index)%FrameCount)
      return `file '${Path.join(dirname, filename)}'`
    }).join(frame_duration)
  } else {
    concat = GenerateArray(i, (index) => {
      const filename = Interpolate(/#+/, Filename, index)
      return `file '${Path.join(dirname, filename)}'`
    }).join(frame_duration)
  }

  const description_filename = Path.join(TmpDirname, `${Version}.txt`)
  Fs.writeFileSync(description_filename, concat)

  require('./ffmpeg')( description_filename )
  remove(description_filename).then(() => process.exit())
})