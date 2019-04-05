"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Argv_1 = require("./Argv");
var string_1 = require("lol/utils/string");
var argv = Argv_1.Argv.get('process');
exports.CaptureFramerate = argv.format.getFloat('--capture-framerate', 1); // 1 second between capture
exports.VideoFramerate = argv.format.getFloat('--video-framerate', 30); // 30 images per second
exports.Filename = argv.format.getString('--filename', 'capture_${i}.jpg');
exports.FrameCount = argv.format.getInt('--frame', -1);
exports.Version = string_1.generateVersionFromDate();
var Dir = argv.format.getString('--path', './Captures');
exports.Dirname = Dir + "_" + exports.Version;
