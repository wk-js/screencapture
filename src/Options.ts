import { Argv } from "./Argv";
import { generateVersionFromDate } from 'lol/utils/string'

const argv = Argv.get('process')

export const CaptureFramerate = argv.format.getFloat('--capture-framerate', 1) // 1 second between capture
export const VideoFramerate = argv.format.getFloat('--video-framerate', 30) // 30 images per second
export const Filename = argv.format.getString('--filename', 'capture_${i}.jpg')
export const FrameCount = argv.format.getInt('--frame', -1)
export const Version = generateVersionFromDate()

const Dir = argv.format.getString('--path', './Captures')
export const Dirname = `${Dir}_${Version}`