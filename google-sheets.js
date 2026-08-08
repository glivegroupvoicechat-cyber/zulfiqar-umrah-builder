/* Zulfiqar Group - Google Sheets quotation sync */
(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbw5Q0x6EqnXE1Z9HsxRYik99RLtB7ERReKZKA5Q3XwaSXXptAbVOn8-3D4_FUz-HKsY/exec';
  const form = document.querySelector('#calculator');
  if (!form) return;
  const field = name => form.elements[name];
  const num = value => Number(value) || 0;
  const rows = type => {
    const list = document.querySelector(`#${type}s`);
    if (!list) return [];
    return [...list.querySelectorAll('article')].map(row => Object.fromEntries([...row.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input.value])));
  };
  const roomLabel = value => ({5:'Quint sharing',4:'Quad sharing',3:'Triple sharing',2:'Double sharing',1:'Single room'}[Number(value)] || 'Room type to be confirmed');
  function collectQuotation() {
    const adults=num(field('adults')?.value), children=num(field('children')?.value), infants=num(field('infants')?.value), hotels=rows('hotel');
    const flights=rows('flight'), transports=rows('transport'), ziyarat=rows('ziyarat');
    const inclusions=(field('packageInclusions')?.value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    const makkah=hotels.find(h=>String(h.city).toLowerCase()==='makkah')||{}, madinah=hotels.find(h=>String(h.city).toLowerCase()==='madinah')||{};
    const grandText=document.querySelector('#grandTotal')?.textContent||'PKR 0';
    const finalTotal=parseFloat(grandText.replace(/[^0-9.]/g,''))||0, totalPax=adults+children+infants;
    return {quoteNumber:field('quoteNumber')?.value||'',clientName:field('customerName')?.value||'',customerName:field('customerName')?.value||'',clientMobile:field('clientMobile')?.value||'',familyHead:field('familyHead')?.value||'',bookingDate:field('bookingDate')?.value||'',voucherDate:field('voucherDate')?.value||'',adults,children,infants,totalPassengers:totalPax,beds:num(field('beds')?.value),flights:flights.map(f=>({airline:f.airline,route:f.route,rate:num(f.rate)})),hotels:hotels.map(h=>({name:h.name,city:h.city,roomType:h.roomType,roomTypeLabel:roomLabel(h.roomType),rooms:num(h.rooms),nights:num(h.nights),rate:num(h.rate)})),makkahHotel:makkah.name||'',makkahNights:num(makkah.nights),makkahRoomType:roomLabel(makkah.roomType),madinahHotel:madinah.name||'',madinahNights:num(madinah.nights),madinahRoomType:roomLabel(madinah.roomType),visaRequired:!!field('visaRequired')?.checked,visaRate:num(field('visaRate')?.value),transports:transports.map(t=>({transportType:t.transportType,route:t.route,vehicle:t.vehicle,rate:num(t.rate)})),ziyarat:ziyarat.map(z=>({service:z.service,rate:num(z.rate)})),inclusions,finalTotal,perPax:totalPax?finalTotal/totalPax:0,profit:num(field('profit')?.value),commission:num(field('commission')?.value),discount:num(field('discount')?.value),companyName:field('companyName')?.value||'ZULFIQAR GROUP',whatsapp:field('whatsapp')?.value||'',phone:field('phone')?.value||'',email:field('email')?.value||'',website:field('website')?.value||'',officeAddress:field('officeAddress')?.value||'',preparedBy:field('preparedBy')?.value||''};
  }
  async function saveToGoogleSheets(){
    const button=document.querySelector('#saveToGoogleSheets'), original=button?.textContent||'Save to Google Sheets';
    if(button){button.disabled=true;button.textContent='Saving...';}
    try{
      const data=collectQuotation();
      if(!data.quoteNumber) throw new Error('Please create the quotation first so it has a Quote Number.');
      await fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
      if(button){button.textContent='Saved ✓';setTimeout(()=>{button.textContent=original;button.disabled=false;},1800);}
      alert('Quotation sent to Google Sheets.');
    }catch(error){if(button){button.textContent=original;button.disabled=false;}alert('Could not save quotation: '+error.message);}
  }
  function addButton(){
    if(document.querySelector('#saveToGoogleSheets')) return;
    const toolbar=document.querySelector('.toolbar.company-only'); if(!toolbar) return;
    const button=document.createElement('button'); button.id='saveToGoogleSheets';button.className='button';button.type='button';button.textContent='Save to Google Sheets';
    toolbar.insertBefore(button,toolbar.lastElementChild);button.addEventListener('click',saveToGoogleSheets);
  }
  addButton();
})();
