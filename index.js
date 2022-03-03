const app = require("express")();
const Stream = require("node-rtsp-stream");
var ffmpeg = require("fluent-ffmpeg")
// var ffmpegPath = require("ffmpeg-binaries")

// ffmpeg
//   .setFfmpegPath(ffmpegPath)
const streams = {}
const stream_configs = [{
    key: "rtsp",
    port: 9000,
    url: "rtsp://admin:pikpart@123@103.36.83.212:554/cam/realmonitor?channel=1&subtype=0"
}]
const startStream = (name, streamUrl, wsPort) => {
    const stream = new Stream({
        name,
        streamUrl,
        wsPort,
        ffmpegOptions: {
            "-stats": "",
            "-r": 30,
        }
    })
    console.log(stream)
    streams[wsPort] = stream
}
app.get("start-stream", (req, res) => {
    const {
        url,
        port,
        key = "stream"
    } = req.query;
    if (streams[port]) {
        return res.json({
            message: 'port in use'
        })
    }
    startStream(key, url, port);
    res.json({
        message: "started Stream"
    })
});
app.listen('8000', () => {
    console.log('running')
    stream_configs.forEach((cinfigs) => {
        startStream(cinfigs.key, cinfigs.url, cinfigs.port)
    })
});