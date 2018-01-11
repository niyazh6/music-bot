
const Discord = require("Discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const request = require("request");
const fs = require("fs");
const getYoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

const yt_api_key = "AIzaSyBQS2O3GceN-cuocacmbcmktRQYKAIP6t8";
const discord_token = "NDAwOTMxOTcyNzEwNDAwMDAw.DTi1Mw.uDZY3B9c4jl_c4-oDUZi6rlG0Hk";
const bot_controller = "400728062246912011";
const prefix = "-";

var  queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];

client.login(discord_token);

client.on('message', function(message){
    const member = message.member;
    const mess = message.content.toLowerCase();
    const args = message.content.split(' ').slice(1).join(" ");

    if (mess.startsWith(prefix + "play")){
      if (queue.length > 0 || isPlaying) {
          getID(args, function (id) {
              add_to_queue(id);
              fetchVideoInfo(id, function(err, videoInfo) {
                  if (err) throw new Error(err);
                  message.reply (" added to queue **" + videoInfo.title + "**");
              });
          });
        } else { 
            isPlaying = true;
            getID(args, function(id) {
                queue.push("placeholder");
                playMusic(id, message);
                fetchVideoInfo(id, function(err, videoInfo) {
                    if (err) throw new Error(err);
                    message.reply (" now playing **" + videoInfo.title + "**");
                 
                })
            })

        
      }
    }

});


client.on('ready', function() {
    console.log("ready");
});

function playMusic(id, message) {
    voiceChannel = message.member.voiceChannel;

    voiceChannel.join().then(function (connection) {
        stream = ytdl("https://youtube.com/watch?v=" + id,{
            fliter: 'audioonly'
        } );
        skipReq = 0;
        skippers = [];

        dispatcher = connection.playStream(stream); 
    })
}

function getID(str, cb) {
    if (isYoutube(str)) {
       cb(getYoutubeID(str));
    } else { 
        search_video(str, function (id) {
            cb(id);
        });
    }}
    
function add_to_queue(strID) {
    if(isYoutube(strID)) {
        queue.push(strID);
    } else {
        queue.push(strID);
    }
}    
 
//confusion
function search_video(query, callback){
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, fuction(error, response, body))
    var json = JSON.parse(body); 
    callback(json.items[0].id.videoID);
    };
 

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com")
}
 
 









