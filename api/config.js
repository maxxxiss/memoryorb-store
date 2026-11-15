import {ready,reply} from '../lib/payment.mjs';
export default function handler(req,res){if(req.method!=='GET')return reply(res,405,{error:'Method not allowed'});reply(res,200,{ready:ready()})}
