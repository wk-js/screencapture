const { spawnSync } = require('child_process')
const Path = require('path')
const { Filename, Dirname } = require('./options')
const { Interpolate } = require('./utils')

function FFMpeg(input_path) {
  let output = Interpolate(/#+/, Filename, 'video')
  output = Path.join(Dirname, Path.dirname(output), Path.basename(output, Path.extname(output)) + '.mp4')

  const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

  console.log(`${ffmpeg} -f concat -safe 0 -i ${input_path} -vsync vfr -pix_fmt yuv420p ${output}`);

  spawnSync('cmd.exe', [
    '/c',
    `${ffmpeg} -f concat -safe 0 -i ${input_path} -vsync vfr -pix_fmt yuv420p ${output}`
  ], { stdio: 'inherit', shell: true })
}

module.exports = FFMpeg