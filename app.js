(()=>{
'use strict';
const variants={
 black:{name:'Čierna',description:'Nadčasová čierna s jemným leskom.'},
 pearl:{name:'Perlová',description:'Jemná perlová s teplým nádychom.'},
 ruby:{name:'Rubínová',description:'Sýta rubínová pre sviatočnú náladu.'},
 moss:{name:'Machová',description:'Pokojná machová inšpirovaná lesom.'},
 navy:{name:'Modrá',description:'Hlboká modrá s jemným leskom.'}
};
const bundles={1:24.99,2:44.99,3:59.99};
const money=n=>new Intl.NumberFormat('sk-SK',{style:'currency',currency:'EUR'}).format(n);
const $=(selector,base=document)=>base.querySelector(selector);
const $$=(selector,base=document)=>Array.from(base.querySelectorAll(selector));
let selectedVariant='pearl',selectedBundle=1,selectedPhoto='primary',toastTimeout;
let cart=[]; let checkoutReady=false;
try{const data=JSON.parse(localStorage.getItem('memoryorb-cart-v1')||'[]');if(Array.isArray(data))cart=data.filter(x=>Object.hasOwn(variants,x.variant)&&Number.isInteger(x.bundle)&&Object.hasOwn(bundles,x.bundle)&&Number.isInteger(x.count)&&x.count>0&&x.count<100)}catch{}
const cartDrawer=$('#cart-drawer'),backdrop=$('#cart-backdrop');
function persist(){try{localStorage.setItem('memoryorb-cart-v1',JSON.stringify(cart))}catch{}}
function renderProduct(){
 const v=variants[selectedVariant];
 $('#selected-finish-label').textContent=v.name;
 $('#variant-description').textContent=v.description;
 $('#product-price').textContent=money(bundles[selectedBundle]);
 $('#add-price').textContent=money(bundles[selectedBundle])+' ↗';
 $$('.swatch').forEach(x=>{let active=x.dataset.variant===selectedVariant;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
 $$('.bundle').forEach(x=>{let active=Number(x.dataset.bundle)===selectedBundle;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
 $('#thumb-primary').src=`assets/${selectedVariant}.webp`;
 $('#thumb-detail').src=`assets/${selectedVariant}-detail.webp`;
 changePhoto(selectedPhoto,false);
}
function changePhoto(kind,animated=true){
 selectedPhoto=kind;
 const newSrc=kind==='lifestyle'?'assets/hero.webp':`assets/${selectedVariant}${kind==='detail'?'-detail':''}.webp`;
 const main=$('#product-main-image');
 $$('.thumb').forEach(x=>x.classList.toggle('active',x.dataset.photo===kind));
 const set=()=>{main.src=newSrc;main.alt=kind==='lifestyle'?'Guľa MemoryOrb na stromčeku':`${variants[selectedVariant].name} guľa MemoryOrb ${kind==='detail'?'detail':'fotografia'}`;main.classList.remove('loading')};
 if(animated){main.classList.add('loading');setTimeout(set,140)}else{set()}
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2800)}
function updateCart(){
 const items=cart.reduce((sum,x)=>sum+x.count*x.bundle,0),amount=cart.reduce((sum,x)=>sum+x.count*bundles[x.bundle],0);
 $('#checkout').disabled=!checkoutReady||!cart.length; $('#bag-count').textContent=items;$('#drawer-count').textContent=items?'('+items+' ks)':'';$('#cart-subtotal').textContent=money(amount);
 const container=$('#cart-items');container.textContent='';
 if(!cart.length){container.innerHTML='<div class="cart-empty"><strong>Váš košík je prázdny.</strong><span>Vyberte si svoju prvú guľu.</span></div>';return}
 cart.forEach((item,index)=>{
  const block=document.createElement('div');block.className='cart-item';
  block.innerHTML=`<img src="assets/${item.variant}.webp" alt="${variants[item.variant].name} MemoryOrb"><div><div class="cart-item-title"><span>MemoryOrb</span><span>${money(item.count*bundles[item.bundle])}</span></div><div class="cart-item-meta">${variants[item.variant].name} · ${item.bundle} ${item.bundle===1?'ks':'ks'} v balení</div><div class="cart-item-actions"><div class="cart-qty"><button type="button" data-step="-1" data-index="${index}" aria-label="Menej balení">−</button><span aria-label="Počet balení">${item.count}</span><button type="button" data-step="1" data-index="${index}" aria-label="Viac balení">+</button></div><button class="remove" type="button" data-remove="${index}">Odstrániť</button></div></div>`;
  container.append(block);
 });
}
let returnFocus=null;
function openCart(){returnFocus=document.activeElement;backdrop.hidden=false;cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');$('#close-cart').focus()}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');backdrop.hidden=true;document.body.classList.remove('no-scroll');returnFocus?.focus?.()}
$$('[data-open-cart]').forEach(x=>x.addEventListener('click',openCart));
$$('[data-close-cart],#close-cart').forEach(x=>x.addEventListener('click',closeCart));
backdrop.addEventListener('click',closeCart);
$('#variant-selector').addEventListener('click',e=>{const b=e.target.closest('[data-variant]');if(!b)return;selectedVariant=b.dataset.variant;selectedPhoto='primary';renderProduct()});
$$('[data-bundle]').forEach(x=>x.addEventListener('click',()=>{selectedBundle=Number(x.dataset.bundle);renderProduct()}));
$$('[data-photo]').forEach(x=>x.addEventListener('click',()=>changePhoto(x.dataset.photo)));
$('#add-to-bag').addEventListener('click',()=>{let existing=cart.find(x=>x.variant===selectedVariant&&x.bundle===selectedBundle);if(existing){if(existing.count>=99){toast('Maximum je 99 balení.');return}existing.count++;}else cart.push({variant:selectedVariant,bundle:selectedBundle,count:1});persist();updateCart();openCart();toast(`${selectedBundle} ${selectedBundle===1?'ks':'ks'} pridané do košíka`)});
$('#cart-items').addEventListener('click',e=>{const step=e.target.closest('[data-step]'),rem=e.target.closest('[data-remove]');if(step){const idx=Number(step.dataset.index),delta=Number(step.dataset.step);cart[idx].count=Math.min(99,cart[idx].count+delta);if(cart[idx].count<=0)cart.splice(idx,1)}else if(rem){cart.splice(Number(rem.dataset.remove),1)}else return;persist();updateCart()});
$('#zoom-image').addEventListener('click',()=>{$('#zoomed-image').src=$('#product-main-image').src;$('#zoomed-image').alt=$('#product-main-image').alt;$('#zoom-modal').hidden=false;document.body.classList.add('no-scroll')});
function closeZoom(){$('#zoom-modal').hidden=true;if(!cartDrawer.classList.contains('open'))document.body.classList.remove('no-scroll')}
$('#close-zoom').addEventListener('click',closeZoom);$('#zoom-modal').addEventListener('click',e=>{if(e.target.id==='zoom-modal')closeZoom()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){$('#zoom-modal').hidden||closeZoom();if(cartDrawer.classList.contains('open'))closeCart()}
 if(e.key==='Tab'&&cartDrawer.classList.contains('open')){const elems=$$('button:not([disabled]),a[href]',cartDrawer).filter(n=>n.offsetParent!==null);if(!elems.length)return;const first=elems[0],last=elems[elems.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});
if('IntersectionObserver'in window){const observer=new IntersectionObserver((entries)=>{entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');observer.unobserve(x.target)}})},{threshold:.1});$$('.section-heading,.gallery-column,.purchase-column,.how-content,.faq-lead,.faq-accordions').forEach(x=>{x.classList.add('fade-up');observer.observe(x)})}
renderProduct();updateCart();
fetch('/api/config').then(r=>r.json()).then(c=>{checkoutReady=c.ready;$('#checkout').textContent=c.ready?'Zaplatiť cez Stripe →':'Platby pripravujeme';$('#checkout-status').textContent=c.ready?'Cenu a adresu potvrdíte v ďalšom kroku.':'Objednávanie zatiaľ nie je dostupné.';updateCart()}).catch(()=>{$('#checkout').textContent='Platby pripravujeme';$('#checkout-status').textContent='Spustite web cez priložený server.'});
$('#checkout').addEventListener('click',async()=>{const button=$('#checkout');button.disabled=true;button.textContent='Otváram Stripe…';try{const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})});const data=await r.json();if(!r.ok)throw Error(data.error||'Platbu sa nepodarilo otvoriť.');location.assign(data.url)}catch(e){$('#checkout-status').textContent=e.message;button.disabled=false;button.textContent='Skúsiť platbu znova →'}});
if(new URLSearchParams(location.search).has('cancelled')){openCart();toast('Platba bola zrušená. Košík zostal uložený.');}

})();
