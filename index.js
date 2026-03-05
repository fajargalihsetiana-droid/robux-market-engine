const {Client,GatewayIntentBits,EmbedBuilder} = require("discord.js")
const fs = require("fs")

const TOKEN = process.env.TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID
const ROLE_ID = process.env.ROLE_ID

const data = require("./data.json")

const client = new Client({
 intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
 ]
})

function save(){
 fs.writeFileSync("./data.json",JSON.stringify(data,null,2))
}

function marketText(){

 const texts=[
  "Market system sedang memantau supply dan demand robux.",
  "Market algorithm sedang menghitung perubahan rate.",
  "Market system mendeteksi aktivitas perdagangan robux.",
  "Supply robux sedang dianalisis oleh sistem.",
  "Market system melakukan penyesuaian harga."
 ]

 return texts[Math.floor(Math.random()*texts.length)]

}

function panel(){

 return new EmbedBuilder()

 .setTitle("📊 ROBUX MARKET ENGINE")

 .setDescription(marketText())

 .addFields(
  {name:"💰 Current Rate",value:`${data.rate} IDR / Robux`},
  {name:"📦 Stock Status",value:data.stock},
  {name:"📈 Market Status",value:"STABLE"}
 )

 .setFooter({text:"Rate dapat berubah mengikuti kondisi market."})
 .setColor(data.stock==="OPEN"?"Green":"Red")

}

client.on("ready",async()=>{

 console.log("Market Engine Online")

 const channel=await client.channels.fetch(CHANNEL_ID)

 if(!data.messageId){

  const msg=await channel.send({
   embeds:[panel()]
  })

  data.messageId=msg.id
  save()

 }

})

client.on("messageCreate",async message=>{

 if(message.author.bot)return

 const args=message.content.split(" ")

 if(args[0]==="!rate"){

  const newRate=args[1]

  if(!newRate)return

  data.rate=newRate
  data.history.push(newRate)

  save()

  const channel=await client.channels.fetch(CHANNEL_ID)
  const msg=await channel.messages.fetch(data.messageId)

  await msg.edit({embeds:[panel()]})

  channel.send(`<@&${ROLE_ID}>`)
 }

 if(args[0]==="!stock"){

  if(args[1]==="open"){
   data.stock="OPEN"
  }else{
   data.stock="CLOSED"
  }

  save()

  const channel=await client.channels.fetch(CHANNEL_ID)
  const msg=await channel.messages.fetch(data.messageId)

  await msg.edit({embeds:[panel()]})

 }

})

client.login(TOKEN)