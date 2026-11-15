import {stripe,reply} from '../lib/payment.mjs';
export const config={api:{bodyParser:false}};
export default async function handler(req,res){
 if(req.method!=='POST')return reply(res,405,{error:'Method not allowed'});
 if(!stripe||!process.env.STRIPE_WEBHOOK_SECRET)return reply(res,503,{error:'Webhook unavailable'});
 let event;try{let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>1048576)throw Error();chunks.push(chunk)}event=stripe.webhooks.constructEvent(Buffer.concat(chunks),req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET)}catch{return reply(res,400,{error:'Invalid signature'})}
 const s=event.data.object;
 if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)&&s.payment_status==='paid'){
  // Store confirmation durably in Stripe, not in Vercel's temporary filesystem.
  // Fulfil manually in Stripe Dashboard; repeated deliveries have the same effect.
  try{await stripe.checkout.sessions.update(s.id,{metadata:{memoryorb_payment_verified:'true'}})}catch{return reply(res,500,{error:'Retry event'})}
 }
 return reply(res,200,{received:true});
}
