import Screenshot from 'screenshot-desktop';
import { CaptureFramerate, FrameCount, Dirname, Filename, Version, VideoFramerate } from './Options';
import { ensureDir, remove } from 'asset-pipeline/js/utils/fs';
import { template } from 'lol/utils/string'
import { generate } from 'lol/utils/array'
import Os from 'os';
import Path from 'path';
import Fs from 'fs';
import { FFMpeg } from './FFMpeg';
import { createInterface } from 'readline';

let Recording = false
let Frame = -1
const PendingScreenshots: any[] = []
const TmpDirname = Path.join(Os.tmpdir(), 'ScreenCapture')
const Readline = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

function Run() {
  ensureDir(Dirname)
  .then(() => ensureDir(TmpDirname))
  .then(StartCapture)
}

function StartCapture() {
  Readline.on('line', StopRecording)
  Recording = true
  Capture()
}

function StopRecording() {
  Readline.off('line', StopRecording)
  Recording = false
  Promise.all(PendingScreenshots).then(Processing)
}

function Capture() {
  if (!Recording) return

  Frame++

  let current_frame = Frame
  if (FrameCount > 0 && current_frame >= FrameCount) {
    current_frame = Frame%FrameCount
  }

  const filename = Path.join(Dirname, template(Filename, { i: current_frame }))

  const promise = Screenshot({ format: 'jpg', filename })
  .then(() => {
    console.log(`File ${filename} saved`);
  })
  AddScreenshot( promise )

  setTimeout(Capture, CaptureFramerate * 1000)
}

function AddScreenshot(p: Promise<void>) {
  const index = PendingScreenshots.length
  PendingScreenshots.push( p )
  p.then(() => {
    PendingScreenshots.splice(index, 1)
  })
}

function Processing() {
  let first = 0
  let concat = null

  const dirname = Path.resolve(Dirname)
  const frame_rate = 1/VideoFramerate
  const frame_duration = `\nduration ${frame_rate}\n`

  if (FrameCount > 0 && Frame >= FrameCount) {
    first = (Frame+1)%FrameCount
    concat = generate(function(index, stop) {
      if (index+1 == FrameCount) stop()
      const filename = template(Filename, { i: (first + index)%FrameCount })
      return `file '${Path.join(dirname, filename)}'`
    }).join(frame_duration)
  } else {
    concat = generate(function(index, stop) {
      if (index+1 == Frame) stop()
      const filename = template(Filename, { i: index })
      return `file '${Path.join(dirname, filename)}'`
    }).join(frame_duration)
  }

  const description_filename = Path.join(TmpDirname, `${Version}.txt`)
  Fs.writeFileSync(description_filename, concat)

  console.log('Processing with concat file', description_filename);

  FFMpeg(description_filename)
  remove(description_filename).then(() => process.exit())
}

Run()