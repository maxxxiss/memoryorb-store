import {stripe,site,ready,reply} from '../lib/payment.mjs';
import {checkoutParams} from '../checkout.mjs';
export default async function handler(req,res){
 if(req.method!=='POST')return reply(res,405,{error:'Method not allowed'});
 if(!ready())return reply(res,503,{error:'Objednávanie zatiaľ nie je dostupné.'});
 if(req.headers.origin!==site)return reply(res,403,{error:'Neplatný pôvod požiadavky.'});
 let params;try{const data=typeof req.body==='string'?JSON.parse(req.body):req.body;params=checkoutParams(data?.items,site)}catch{return reply(res,400,{error:'Skontrolujte obsah košíka.'})}
 try{const session=await stripe.checkout.sessions.create(params);return reply(res,200,{url:session.url})}catch{return reply(res,502,{error:'Stripe platbu sa nepodarilo otvoriť. Skúste to znova.'})}
}
