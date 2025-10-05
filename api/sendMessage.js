import fetch from "node-fetch";
import crypto from "crypto";

// Pool UA 50
const userAgents = Array.from({length:50}, (_,i) => `UA-${i+1}-${crypto.randomBytes(8).toString("hex")}`);

function getRandomUA() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Kirim 1 pesan dengan retry aman
async function sendOne(username,message,maxRetry=3){
  let attempts=0;
  while(attempts<maxRetry){
    const ua = getRandomUA();
    const deviceId = crypto.randomBytes(21).toString("hex");

    const headers={
      "User-Agent": ua,
      "Accept": "*/*",
      "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With":"XMLHttpRequest",
      "Referer": `https://ngl.link/${username}`,
      "Origin":"https://ngl.link"
    };

    const body=`username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;

    try{
      const res=await fetch("https://ngl.link/api/submit",{method:"POST",headers,body});
      if(res.status===200) return {success:true};
      if(res.status!==429) return {success:false,status:res.status};
    }catch(err){
      // error network, retry
    }
    attempts++;
  }
  return {success:false,status:429};
}

// Batch per UA
async function sendBatch(username,message,countPerUA){
  const results=[];
  for(let i=0;i<countPerUA;i++){
    results.push(await sendOne(username,message));
  }
  return results;
}

export default async function handler(req,res){
  const username = req.query.username || req.body?.username;
  const message = req.query.message || req.body?.message;
  const total = parseInt(req.query.total || req.body?.total || "5");
  const batchSize = 20;

  if(!username||!message||!total){
    res.setHeader("Content-Type","application/json");
    return res.status(400).send(JSON.stringify({
      dev:"Vinzz Official",
      status:false,
      error:"username, message, total required"
    },null,2));
  }

  // Hitung batch
  const fullBatches = Math.floor(total/batchSize);
  const remainder = total % batchSize;
  const batchCounts = [];
  for(let i=0;i<fullBatches;i++) batchCounts.push(batchSize);
  if(remainder>0) batchCounts.push(remainder);

  // Jalankan semua batch concurrent
  const allPromises = batchCounts.map(count => sendBatch(username,message,count));
  const batchResults = await Promise.all(allPromises);

  // Flatten hasil
  const flatResults = batchResults.flat();
  let counter=0;
  const successLogs=[];
  const errorLogs=[];
  const allLogs=[];

  for(const r of flatResults){
    if(r.success){
      counter++;
      successLogs.push(`Pengiriman #${counter}`);
      allLogs.push({success:`Pengiriman #${counter}`});
    }else{
      errorLogs.push(`Err Status: ${r.status}`);
      allLogs.push({error:`Err Status: ${r.status}`});
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
