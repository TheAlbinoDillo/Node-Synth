const fetch = require("node-fetch");
function run(){
fetch​(​"https:/"+
"/e621.net/posts.json",{​method​: ​'get',​
    headers: 
{​ 
    'User-Agent': ​"Node-Synth/1.0 (by thealbinoarmadillo on e621)" ​}​,​
​}​)​​.​then​(​res​ ​=>​ ​console.log(res) )​;}

module.exports = {runFunction:run, permissions:["BOT_OWNER"], calls:["e6"]};
