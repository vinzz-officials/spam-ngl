import fetch from "node-fetch";
import crypto from "crypto";

// Pool User-Agent (50 UA)
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 Version/17.7 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/605.1.15 Version/18.0",
  "Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) Safari/605.1.15 Version/17.7 Mobile/15E148",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",
  "Mozilla/5.0 (Linux; Android 13; SM-F936B) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_1) Safari/605.1.15 Version/17.7",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edge/116.0.1938.69",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) Safari/605.1.15 Version/16.7 Mobile/15E148",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Safari/605.1.15 Version/17.6",
  "Mozilla/5.0 (Linux; X11; Linux x86_64) Chrome/116.0.5845.110 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 16_7 like Mac OS X) Safari/605.1.15 Version/16.7 Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/605.1.15 Version/18.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) Safari/605.1.15 Version/17.7 Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 13; SM-F936B) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) Safari/605.1.15 Version/17.7",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) Safari/605.1.15 Version/16.7 Mobile/15E148",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_1) Safari/605.1.15 Version/17.7",
  "Mozilla/5.0 (Linux; Android 14; SM-G991B) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) Safari/605.1.15 Version/17.7 Mobile/15E148",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/605.1.15 Version/18.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) Safari/605.1.15 Version/17.7 Mobile/15E148",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) Safari/605.1.15 Version/17.7",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; SM-F936B) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 16_7 like Mac OS X) Safari/605.1.15 Version/16.7 Mobile/15E148",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Safari/605.1.15 Version/17.6",
  "Mozilla/5.0 (Linux; X11; Linux x86_64) Chrome/116.0.5845.110 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) Safari/605.1.15 Version/16.7 Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/605.1.15 Version/18.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0"
];

// Pool deviceId (50)
const deviceIds = Array.from({ length: 50 }, () => crypto.randomBytes(21).toString("hex"));

// Optional Proxy pool
const proxies = [];
// Status tracking
let uaStatus = userAgents.map(() => true);
let deviceStatus = deviceIds.map(() => true);
let proxyStatus = proxies.map(() => true);

function getAvailableIndex(statusArray) {
  const available = statusArray.map((v,i)=>v?i:-1).filter(i=>i!==-1);
  if(available.length===0) return null;
  return available[Math.floor(Math.random()*available.length)];
}

async function sendRequest(username,message){
  let uaIndex=getAvailableIndex(uaStatus);
  let deviceIndex=getAvailableIndex(deviceStatus);
  let proxyIndex=getAvailableIndex(proxyStatus);
  if(uaIndex===null) uaIndex=Math.floor(Math.random()*userAgents.length);
  if(deviceIndex===null) deviceIndex=Math.floor(Math.random()*deviceIds.length);
  if(proxyIndex===null && proxies.length) proxyIndex=Math.floor(Math.random()*proxies.length);

  while(true){
    const ua=userAgents[uaIndex];
    const deviceId=deviceIds[deviceIndex];
    const proxy=proxyIndex!==null?proxies[proxyIndex]:null;

    const headers={
      "User-Agent":ua,
      "Accept":"*/*",
      "Accept-Language":"en-US,en;q=0.5",
      "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With":"XMLHttpRequest",
      "Referer":`https://ngl.link/${username}`,
      "Origin":"https://ngl.link"
    };
    const body=`username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;
    const fetchOptions={method:"POST",headers,body};
    if(proxy) fetchOptions.agent=new (await import('https')).Agent({proxy});

    try{
      const response=await fetch("https://ngl.link/api/submit",fetchOptions);
      if(response.status===200) return {success:true};
      if(response.status===429){
        if(uaIndex!==null) uaStatus[uaIndex]=false;
        if(deviceIndex!==null) deviceStatus[deviceIndex]=false;
        if(proxyIndex!==null) proxyStatus[proxyIndex]=false;

        uaIndex=getAvailableIndex(uaStatus) ?? Math.floor(Math.random()*userAgents.length);
        deviceIndex=getAvailableIndex(deviceStatus) ?? Math.floor(Math.random()*deviceIds.length);
        proxyIndex=getAvailableIndex(proxyStatus);
        continue;
      }
      return {success:false,status:response.status};
    }catch(err){
      uaIndex=getAvailableIndex(uaStatus) ?? Math.floor(Math.random()*userAgents.length);
      deviceIndex=getAvailableIndex(deviceStatus) ?? Math.floor(Math.random()*deviceIds.length);
      proxyIndex=getAvailableIndex(proxyStatus);
    }
  }
}

export default async function handler(req,res){
  const username=req.query.username||req.body?.username;
  const message=req.query.message||req.body?.message;
  const total=parseInt(req.query.total||req.body?.total||"5");

  if(!username||!message||!total){
    res.setHeader("Content-Type","application/json");
    return res.status(400).send(JSON.stringify({dev:"Vinzz Official",status:false,error:"username, message, total required"},null,2));
  }

  let counter=0;
  const successLogs=[];
  const errorLogs=[];
  const allLogs=[];

  for(let i=0;i<total;i++){
    const result=await sendRequest(username,message);
    if(result.success){
      counter++;
      successLogs.push(`Pengiriman #${counter}`);
      allLogs.push({success:`Pengiriman #${counter}`});
    }else{
      errorLogs.push(`Err Status: ${result.status}`);
      allLogs.push({error:`Err Status: ${result.status}`});
    }
  }

  res.setHeader("Content-Type","application/json");
  res.status(200).send(JSON.stringify({
    dev:"Vinzz Official",
    status:counter>0,
    totalSent:counter,
    success:successLogs,
    error:errorLogs,
    logs:allLogs
  },null,2));
                     }
