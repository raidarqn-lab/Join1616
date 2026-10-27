// Applicant evidence stays private; only the supplied guide images are public assets.
window.mountTransferEvidence = function({t,onChange}) {
 const input=document.getElementById('transfer-screenshot');
 const preview=document.getElementById('transfer-screenshot-preview');
 const status=document.getElementById('transfer-screenshot-status');
 const error=document.getElementById('transfer-screenshot-error');
 const remove=document.getElementById('transfer-screenshot-remove');
 const dialog=document.getElementById('transfer-guide');
 let saved=null,selected=null,busy=false,generation=0,errorKey='';
 const valid=e=>e&&typeof e.image==='string'&&e.image.length<=1200000&&/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(e.image)&&/^[a-f0-9-]{36}$/.test(e.version);
 function render(){const current=selected||saved;preview.hidden=!current;if(current)preview.src=current.image;else preview.removeAttribute('src');preview.alt=t('transferScreenshot');status.textContent=busy?t('screenshotBusy'):current?t(selected?'screenshotReady':'screenshotSaved'):'';error.textContent=errorKey?t(errorKey):'';input.classList.toggle('invalid',!!errorKey);input.setAttribute('aria-invalid',String(!!errorKey));remove.hidden=!selected;input.disabled=busy;}
 input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;const token=++generation;busy=true;errorKey='';render();try{const {prepareSeatImage}=await import('./transfer-image.js');const image=await prepareSeatImage(file);if(token!==generation)return;selected={image,version:crypto.randomUUID()};}catch(e){if(token!==generation)return;errorKey=e.code==='image_too_large'?'screenshotTooLarge':'screenshotInvalid';}finally{if(token===generation){busy=false;input.value='';render();onChange();}}});
 remove.onclick=()=>{selected=null;errorKey='';render();onChange();};
 document.getElementById('transfer-guide-open').onclick=()=>dialog.showModal();
 document.getElementById('transfer-guide-close').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 return {
  translate:render,
  validate(colour){errorKey=busy?'screenshotBusy':['gold','purple','blue','white'].includes(colour)&&!selected&&!saved?'screenshotRequired':'';render();return !errorKey;},
  payload(){return selected?{...selected}:null;},
  hasImage(){return !!(selected||saved);},
  draft(){return {saved,selected};},
  restore(data){generation++;busy=false;saved=valid(data?.saved)?data.saved:null;selected=valid(data?.selected)?data.selected:null;errorKey='';input.value='';render();},
  load(evidence){this.restore({saved:evidence});},
  reset(){this.restore(null);},
 };
};
