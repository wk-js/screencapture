import { spawnSync } from 'child_process'
import Path from 'path'
import { Filename, Dirname } from './Options'
import { template } from 'lol/utils/string'

export function FFMpeg(input_path: string) {
  let output = template(Filename, { i: 'video' })
  output = Path.join(Dirname, Path.dirname(output), Path.basename(output, Path.extname(output)) + '.mp4')

  const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

  console.log(`${ffmpeg} -f concat -safe 0 -i ${input_path} -vsync vfr -pix_fmt yuv420p ${output}`);

  spawnSync('cmd.exe', [
    '/c',
    `${ffmpeg} -f concat -safe 0 -i ${input_path} -vsync vfr -pix_fmt yuv420p ${output}`
  ], { stdio: 'inherit', shell: true })
}