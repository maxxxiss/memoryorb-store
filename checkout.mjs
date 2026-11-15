export const names=['Black','White','Blue','Green','Red','Grey'];
export function checkoutParams(items,site){
 if(!Array.isArray(items)||!items.length||items.length>6)throw Error('Invalid bag.');
 const seen=new Set();
 for(const x of items){if(!x||!Number.isInteger(x.colour)||x.colour<0||x.colour>=names.length||!Number.isInteger(x.qty)||x.qty<1||x.qty>99||seen.has(x.colour))throw Error('Invalid bag item.');seen.add(x.colour)}
 const count=items.reduce((sum,x)=>sum+x.qty,0);
 if(count>99)throw Error('Too many items.');
 const unit=count>=3?1999:count===2?2249:2499;
 const line_items=items.map(x=>({price_data:{currency:'usd',unit_amount:unit,product_data:{name:`MemoryOrb · ${names[x.colour]}`,metadata:{colour:String(x.colour)}}},quantity:x.qty}));
 return {mode:'payment',payment_method_types:['card'],line_items,shipping_address_collection:{allowed_countries:['SK']},billing_address_collection:'required',locale:'en',success_url:site+'/success.html?session_id={CHECKOUT_SESSION_ID}',cancel_url:site+'/#cart'};
}
