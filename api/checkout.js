import {stripe,site,ready,reply} from '../lib/payment.mjs';
import {checkoutParams} from '../checkout.mjs';
export default async function handler(req,res){
 if(req.method!=='POST')return reply(res,405,{error:'Method not allowed'});
 if(!ready())return reply(res,503,{error:'Orders are not open yet.'});
 if(req.headers.origin!==site)return reply(res,403,{error:'Invalid request origin.'});
 let params;try{const data=typeof req.body==='string'?JSON.parse(req.body):req.body;params=checkoutParams(data?.items,site)}catch{return reply(res,400,{error:'Please check the items in your bag.'})}
 try{const session=await stripe.checkout.sessions.create(params);return reply(res,200,{url:session.url})}catch{return reply(res,502,{error:'Unable to open Stripe checkout. Please try again.'})}
}
