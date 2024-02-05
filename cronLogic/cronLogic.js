require('dotenv').config();
const accountSid = process.env.TWILIO_SSID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const db = require("../util/dbConnect");
const cron = require('node-cron');


async function createCall(number){
  console.log("HELLOOOOO");
  try{
    client.calls.create({
    url: "http://demo.twilio.com/docs/voice.xml",
    to: number,
    from: process.env.TWILIO_NUMBER,
    }).then(call => console.log(call.sid));
  }catch(err){
    console.log(err);
  }
}
async function sendVoiceCall(phoneNumber) {
  try {
      const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: phoneNumber,
      from: process.env.TWILIO_NUMBER
    });
    console.log(`Voice call sent to ${phoneNumber}, Call SID: ${call.sid}`);
    return true;
  } catch (error) {
    console.error(`Error sending voice call to ${phoneNumber}: ${error.message}`);
    return false;
  }
}

// Cron logic for voice calling based on task due_date and user priority
async function Startcron() { cron.schedule('*/10 * * * * *', async () => {
  const now = new Date();
  let data = `${new Date().toLocaleTimeString()} : Server is working\n`; 
  console.log(data);
  try {
    let result = await db.query("SELECT DISTINCT(user_id) FROM tasks WHERE due_date < '2024-01-01' and status = 'TODO'");
    await db.query("UPDATE tasks SET status = 'DONE' WHERE due_date < '2024-01-01' and status = 'TODO'");
    result = result.rows;
    var req_ids = result.map( function(el) { return el.user_id;});
    console.log(req_ids);
    result = await db.query("SELECT id,phone from users ORDER by priority");
    result = result.rows;
    for(let i = 0; i < result.length; i++){
      if(req_ids.includes(result[i].id)){
        await createCall(result[i].phone);
      }
    }
  } catch (error) {
    console.log(error);    
  }
});
}




module.exports = {Startcron};
