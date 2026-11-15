import {stripe,reply} from '../lib/payment.mjs';
export default async function handler(req,res){
 if(req.method!=='GET')return reply(res,405,{error:'Method not allowed'});
 const id=req.query.id;if(!stripe||typeof id!=='string'||!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(id))return reply(res,400,{error:'Invalid payment.'});
 try{const session=await stripe.checkout.sessions.retrieve(id);return reply(res,200,{paid:session.payment_status==='paid'})}catch{return reply(res,400,{error:'Unable to verify payment.'})}
}
