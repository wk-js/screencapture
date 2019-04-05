# ScreenCapture

**ScreenCapture** is a tool that take a screenshot every `X` seconds and concat them into a video. You can change the capture frequency with the option `--capture-framerate` and the output path with `--path`.

You can limit the number of frames captured with the option `--frame`. When the limit is exceeded, it overrides the frame 0 and further. It offers the possibility to only capture the last `X` frames.

## Options

* `--path` - Output directory (Default: `./Captures`)
* `--capture-framerate` - Delay between each capture (in seconds) (Default: `1`)
* `--video-framerate` - Delay between each capture (in frame per seconds) (Default: `30`)
* `--frame` - Limit frame creation. When the limit is exceeded, the capture continue but at frame 0. (Default: `-1`)
<!-- * `--filename` - Frame file name (Default: `capture_#.jpg`) -->

## Example

I want to take a screenshot every minute and capture only the last 24 hours.

- Set the delay to one minute: `60000`
- Set the frame limit to 24 hours: 60*24=`1440`

`screencapture --capture-framerate 60 --frame 1440`