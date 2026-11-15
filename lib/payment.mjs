import Stripe from 'stripe';
export const site='https://memoryorb-shop.store';
export const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY,{timeout:20000,maxNetworkRetries:1}):null;
export const ready=()=>Boolean(stripe&&process.env.STRIPE_WEBHOOK_SECRET&&process.env.STORE_READY==='true');
export function reply(res,status,data){res.setHeader('Cache-Control','no-store');return res.status(status).json(data)}
