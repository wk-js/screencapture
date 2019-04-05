"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var Options_1 = require("./Options");
var string_1 = require("lol/utils/string");
function FFMpeg(input_path) {
    var output = string_1.template(Options_1.Filename, { i: 'video' });
    output = path_1.default.join(Options_1.Dirname, path_1.default.dirname(output), path_1.default.basename(output, path_1.default.extname(output)) + '.mp4');
    var ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
    console.log(ffmpeg + " -f concat -safe 0 -i " + input_path + " -vsync vfr -pix_fmt yuv420p " + output);
    child_process_1.spawnSync('cmd.exe', [
        '/c',
        ffmpeg + " -f concat -safe 0 -i " + input_path + " -vsync vfr -pix_fmt yuv420p " + output
    ], { stdio: 'inherit', shell: true });
}
exports.FFMpeg = FFMpeg;
