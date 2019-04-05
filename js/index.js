"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
var Options_1 = require("./Options");
var fs_1 = require("asset-pipeline/js/utils/fs");
var string_1 = require("lol/utils/string");
var array_1 = require("lol/utils/array");
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var fs_2 = __importDefault(require("fs"));
var FFMpeg_1 = require("./FFMpeg");
var readline_1 = require("readline");
var Recording = false;
var Frame = -1;
var PendingScreenshots = [];
var TmpDirname = path_1.default.join(os_1.default.tmpdir(), 'ScreenCapture');
var Readline = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
function Run() {
    fs_1.ensureDir(Options_1.Dirname)
        .then(function () { return fs_1.ensureDir(TmpDirname); })
        .then(StartCapture);
}
function StartCapture() {
    Readline.on('line', StopRecording);
    Recording = true;
    Capture();
}
function StopRecording() {
    Readline.off('line', StopRecording);
    Recording = false;
    Promise.all(PendingScreenshots).then(Processing);
}
function Capture() {
    if (!Recording)
        return;
    Frame++;
    var current_frame = Frame;
    if (Options_1.FrameCount > 0 && current_frame >= Options_1.FrameCount) {
        current_frame = Frame % Options_1.FrameCount;
    }
    var filename = path_1.default.join(Options_1.Dirname, string_1.template(Options_1.Filename, { i: current_frame }));
    var promise = screenshot_desktop_1.default({ format: 'jpg', filename: filename })
        .then(function () {
        console.log("File " + filename + " saved");
    });
    AddScreenshot(promise);
    setTimeout(Capture, Options_1.CaptureFramerate * 1000);
}
function AddScreenshot(p) {
    var index = PendingScreenshots.length;
    PendingScreenshots.push(p);
    p.then(function () {
        PendingScreenshots.splice(index, 1);
    });
}
function Processing() {
    var first = 0;
    var concat = null;
    var dirname = path_1.default.resolve(Options_1.Dirname);
    var frame_rate = 1 / Options_1.VideoFramerate;
    var frame_duration = "\nduration " + frame_rate + "\n";
    if (Options_1.FrameCount > 0 && Frame >= Options_1.FrameCount) {
        first = (Frame + 1) % Options_1.FrameCount;
        concat = array_1.generate(function (index, stop) {
            if (index + 1 == Options_1.FrameCount)
                stop();
            var filename = string_1.template(Options_1.Filename, { i: (first + index) % Options_1.FrameCount });
            return "file '" + path_1.default.join(dirname, filename) + "'";
        }).join(frame_duration);
    }
    else {
        concat = array_1.generate(function (index, stop) {
            if (index + 1 == Frame)
                stop();
            var filename = string_1.template(Options_1.Filename, { i: index });
            return "file '" + path_1.default.join(dirname, filename) + "'";
        }).join(frame_duration);
    }
    var description_filename = path_1.default.join(TmpDirname, Options_1.Version + ".txt");
    fs_2.default.writeFileSync(description_filename, concat);
    console.log('Processing with concat file', description_filename);
    FFMpeg_1.FFMpeg(description_filename);
    fs_1.remove(description_filename).then(function () { return process.exit(); });
}
Run();
