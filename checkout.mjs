export const names={black:'Black',pearl:'Pearl',ruby:'Ruby',moss:'Moss',navy:'Navy'};
export const prices={1:2499,2:4499,3:5999};
export function checkoutParams(items,site){
 if(!Array.isArray(items)||!items.length||items.length>15)throw Error('Invalid bag.');
 const line_items=items.map(x=>{
  if(!x||!Object.hasOwn(names,x.variant)||!Number.isInteger(x.bundle)||!Object.hasOwn(prices,x.bundle)||!Number.isInteger(x.count)||x.count<1||x.count>99)throw Error('Invalid bag item.');
  return {price_data:{currency:'eur',unit_amount:prices[x.bundle],product_data:{name:`MemoryOrb · ${names[x.variant]} · ${x.bundle} ${x.bundle===1?'orb':'orbs'}`,metadata:{variant:x.variant,bundle:String(x.bundle)}}},quantity:x.count};
 });
 return {mode:'payment',payment_method_types:['card'],line_items,shipping_address_collection:{allowed_countries:['SK']},billing_address_collection:'required',locale:'en',success_url:site+'/success.html?session_id={CHECKOUT_SESSION_ID}',cancel_url:site+'/?cancelled=1#shop'};
}
