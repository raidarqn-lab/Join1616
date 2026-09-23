// Used only when the separately approved public Supabase endpoint is configured.
let scriptReady;
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve();
 if(!scriptReady)scriptReady=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
  const timer=setTimeout(()=>{script.remove();scriptReady=undefined;reject(Error('Verification could not load. Please try again.'));},15000);
  script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);script.remove();scriptReady=undefined;reject(Error('Verification could not load. Please try again.'));};document.head.append(script);
 });
 return scriptReady;
}
async function verify(sitekey){
 if(!sitekey)throw Error('Application verification is not configured.');
 await loadTurnstile();
 return new Promise((resolve,reject)=>{
  const dialog=document.createElement('dialog');dialog.setAttribute('aria-label','Verify your request');dialog.style.cssText='border:1px solid #d6bda5;border-radius:16px;padding:24px;background:#fffaf2;color:#272326;max-width:95vw';
  const title=document.createElement('h2');title.textContent='Verify your request';const widget=document.createElement('div');const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';dialog.append(title,widget,cancel);document.body.append(dialog);
  let widgetId,settled=false;const timer=setTimeout(()=>finish(Error('Verification expired. Please try again.')),300000);
  function finish(error,token){if(settled)return;settled=true;clearTimeout(timer);if(widgetId!=null)window.turnstile.remove(widgetId);dialog.close();dialog.remove();if(error)reject(error);else resolve(token);}
  cancel.onclick=()=>finish(Error('Verification cancelled.'));dialog.addEventListener('cancel',event=>{event.preventDefault();finish(Error('Verification cancelled.'));});dialog.showModal();
  try{widgetId=window.turnstile.render(widget,{sitekey,action:'transfer_intake',callback:token=>finish(null,token),'error-callback':()=>finish(Error('Verification failed. Please try again.')),'expired-callback':()=>finish(Error('Verification expired. Please try again.'))});}catch{finish(Error('Verification could not start.'));}
 });
}
export async function sendPublicIntake(endpoint,sitekey,payload,gatewayKey=''){
 // This migration supports one-way questions; readiness must never prompt a visitor.
 if(payload?.requestType==='chat.ready')return {ok:true,enabled:false};
 if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(gatewayKey))throw Error('Application connection is not configured.');
 const turnstileToken=await verify(sitekey);
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:gatewayKey},credentials:'omit',redirect:'error',body:JSON.stringify({...payload,turnstileToken}),signal:AbortSignal.timeout(45000)});
 const result=await response.json();if(!response.ok||result.ok!==true){const error=Error(result.error||'Unable to complete your request. Please try again.');error.code=result.errorCode;throw error;}return result;
}
