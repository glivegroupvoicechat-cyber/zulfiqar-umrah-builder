/* Zulfiqar Group client quotation sharing enhancements */
(() => {
  const form = document.querySelector('#calculator');
  const clientBox = document.querySelector('#clientQuotation');
  if (!form || !clientBox) return;
  const style = document.createElement('style');
  style.textContent = `.client-share-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.client-share-actions .button{min-width:118px;text-align:center}.whatsapp-button{background:#176b3a!important;border-color:#176b3a!important}.per-pax-box{margin-top:10px;padding-top:9px;border-top:1px solid rgba(200,162,58,.35)}.per-pax-box small{display:block;color:#66788a;text-transform:uppercase;letter-spacing:.65px;font-weight:800}.per-pax-box strong{display:block;color:#8c6810;font:700 1.2rem Georgia,serif;margin-top:2px}.client-contact{margin-top:7px!important;color:#52677a!important}.client-contact strong{color:#19324d}.client-mobile-field{grid-column:span 2}.client-company-contact{margin-top:12px;padding:11px 14px;border:1px solid #d7dfe6;border-radius:8px;background:#fbfaf5;color:#52677a;font-size:.86rem;line-height:1.65}.client-company-contact strong{color:#19324d}.client-company-contact .company-line{display:block}.client-accommodation-detail{margin-top:4px!important;color:#52677a!important}.client-accommodation-detail strong{color:#19324d}.client-hotel-rate{margin-top:5px!important;color:#8c6810!important;font-weight:700}`;
  document.head.appendChild(style);
  const money = value => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0));
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[c]));
  const field = name => form.elements[name];
  const pkr = value => `PKR ${money(value)}`;
  const sar = value => `SAR ${money(value)}`;
  const mobileKey = 'zulfiqar-client-mobile';
  const roomTypeLabel = value => ({ 5:'Quint sharing', 4:'Quad sharing', 3:'Triple sharing', 2:'Double sharing', 1:'Single room' }[Number(value)] || 'Room type to be confirmed');

  function addClientMobileField() {
    if (field('clientMobile')) return;
    const grid = document.querySelector('.card.company-only .form-grid.four');
    if (!grid) return;
    const label = document.createElement('label');
    label.className = 'client-mobile-field';
    label.innerHTML = 'Client mobile number<input name="clientMobile" inputmode="tel" autocomplete="tel" placeholder="03XX XXXXXXX">';
    grid.appendChild(label);
    const saved = localStorage.getItem(mobileKey);
    if (saved) label.querySelector('input').value = saved;
    label.querySelector('input').addEventListener('input', () => localStorage.setItem(mobileKey, label.querySelector('input').value.trim()));
  }

  function rows(type) {
    const list = document.querySelector(`#${type}s`);
    if (!list) return [];
    return [...list.querySelectorAll('article')].map(row => Object.fromEntries([...row.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input.value])));
  }

  function packageInclusions() {
    const custom = (field('packageInclusions')?.value || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const flights = rows('flight').filter(x => x.airline || x.route || Number(x.rate));
    const hotels = rows('hotel').filter(x => x.name || x.checkIn || x.checkOut || Number(x.rate));
    const transport = rows('transport').filter(x => x.route || x.vehicle || Number(x.rate));
    const ziyarat = rows('ziyarat').filter(x => x.service || Number(x.rate));
    const defaults = [flights.length ? 'Return air ticket' : '', field('visaRequired')?.checked ? 'Umrah visa included' : '', hotels.length ? 'Hotel accommodation' : '', transport.length ? 'Ground transport' : '', ziyarat.some(x => /makkah/i.test(x.service)) ? 'Makkah Ziyarat' : '', ziyarat.some(x => /madinah/i.test(x.service)) ? 'Madinah Ziyarat' : ''].filter(Boolean);
    return [...new Set([...defaults, ...custom])];
  }

  function hotelSharingDetails(x, pax) {
    const capacity = Number(x.roomType) || 0;
    const rooms = Number(x.rooms) || (capacity && pax ? Math.ceil(pax / capacity) : 0);
    const roomRate = Number(x.rate) || 0;
    const perPersonNight = capacity ? roomRate / capacity : 0;
    return `${roomTypeLabel(x.roomType)} — ${rooms} room(s) — ${x.nights || 0} night(s) — ${sar(perPersonNight)} per person/night`;
  }

  function quoteText() {
    const name = field('customerName')?.value.trim() || 'Esteemed Guest';
    const mobile = field('clientMobile')?.value.trim() || '';
    const company = field('companyName')?.value.trim() || 'ZULFIQAR GROUP';
    const companyMobile = field('whatsapp')?.value.trim() || '';
    const email = field('email')?.value.trim() || '';
    const address = field('officeAddress')?.value.trim() || '';
    const pax = Number(field('adults')?.value || 0) + Number(field('children')?.value || 0) + Number(field('infants')?.value || 0);
    const grand = document.querySelector('#grandTotal')?.textContent || 'PKR 0';
    const grandNumber = parseFloat(grand.replace(/[^0-9.]/g, '')) || 0;
    const per = pax ? pkr(grandNumber / pax) : 'PKR 0';
    const hotels = rows('hotel').filter(x => x.name || x.city).map(x => `${x.city || 'Hotel'}: ${x.name || 'Hotel'} — ${hotelSharingDetails(x, pax)}`).join('\n');
    const flight = rows('flight').filter(x => x.airline || x.route).map(x => `${x.airline || 'Airline'} — ${x.route || 'Route TBC'}`).join('\n');
    const inc = packageInclusions().map(x => `✓ ${x}`).join('\n');
    return `🕋 ${company} — UMRAH QUOTATION\n${companyMobile ? `WhatsApp: ${companyMobile}\n` : ''}${email ? `Email: ${email}\n` : ''}${address ? `Office: ${address}\n` : ''}\nClient: ${name}${mobile ? `\nMobile: ${mobile}` : ''}\nPassengers: ${pax || 'To be confirmed'}\n\n✈️ FLIGHT\n${flight || 'To be confirmed'}\n\n🏨 ACCOMMODATION\n${hotels || 'To be confirmed'}\n\n✅ INCLUSIONS\n${inc || 'To be confirmed'}\n\n💰 FINAL TOTAL: ${grand}\n💵 PER PAX: ${per}\n\nThank you for choosing ${company}.`;
  }

  function whatsapp() {
    let number = (field('clientMobile')?.value || '').replace(/[^0-9]/g, '');
    if (number.startsWith('0')) number = `92${number.slice(1)}`;
    const base = number ? `https://wa.me/${number}` : 'https://wa.me/';
    window.open(`${base}?text=${encodeURIComponent(quoteText())}`, '_blank', 'noopener,noreferrer');
  }

  async function shareText() {
    const text = quoteText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Zulfiqar Group Umrah Quotation', text }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); alert('Quotation text copied. Paste it into WhatsApp or any chat.'); }
    catch { window.prompt('Copy quotation text:', text); }
  }

  function sharePdf() {
    alert('PDF sharing is ready. In the print preview choose Save to Files, Print, or the Share option to send the PDF.');
    window.print();
  }

  function enhanceAccommodation() {
    const section = [...clientBox.querySelectorAll('.client-section')].find(s => /^Accommodation$/i.test(s.querySelector('h2')?.textContent.trim() || ''));
    if (!section) return;
    const hotels = rows('hotel').filter(x => x.name || x.city || x.roomType || x.nights);
    const grid = section.querySelector('.client-grid');
    if (!grid) return;
    if (!hotels.length) return;
    const pax = Number(field('adults')?.value || 0) + Number(field('children')?.value || 0) + Number(field('infants')?.value || 0);
    const cards = [...grid.querySelectorAll('.client-item')];
    hotels.forEach((hotel, index) => {
      const card = cards[index];
      if (!card) return;
      const content = card.querySelector('div:last-child') || card;
      const name = hotel.name || `${hotel.city || 'Hotel'} hotel`;
      content.innerHTML = `<h3>${esc(name)}</h3><p class="client-accommodation-detail"><strong>${esc(hotel.city || 'Hotel')}</strong> · ${esc(hotelSharingDetails(hotel, pax))}</p>`;
    });
    section.querySelectorAll('p').forEach(p => {
      if (/\d{1,2}-[A-Za-z]{3}-\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|To be confirmed\s*[–-]\s*To be confirmed/i.test(p.textContent)) p.remove();
    });
    const meta = clientBox.querySelector('.client-meta');
    if (meta && /Travel period/i.test(meta.textContent)) {
      const quoteNo = field('quoteNumber')?.value || '';
      meta.innerHTML = `<b>Quote no:</b> ${esc(quoteNo)}<br><b>Passengers:</b> ${esc(String(pax || 'To be confirmed'))}`;
    }
  }

  function enhanceClientQuotation() {
    if (!document.body.classList.contains('client-mode')) return;
    enhanceAccommodation();
    const pax = Number(field('adults')?.value || 0) + Number(field('children')?.value || 0) + Number(field('infants')?.value || 0);
    const grandText = document.querySelector('#grandTotal')?.textContent || 'PKR 0';
    const grand = parseFloat(grandText.replace(/[^0-9.]/g, '')) || 0;
    const per = pax ? grand / pax : 0;
    const hero = clientBox.querySelector('.client-hero');
    if (!hero) return;
    const total = hero.querySelector('.client-total');
    if (total) {
      total.querySelector('.per-pax-box')?.remove();
      const perBox = document.createElement('div');
      perBox.className = 'per-pax-box';
      perBox.innerHTML = `<small>Per passenger</small><strong>${pkr(per)}</strong>`;
      total.appendChild(perBox);
    }
    const heroMain = hero.firstElementChild;
    if (heroMain) {
      heroMain.querySelector('.client-contact')?.remove();
      const mobile = field('clientMobile')?.value.trim() || '';
      const contact = document.createElement('p');
      contact.className = 'client-contact';
      contact.innerHTML = `<strong>Client:</strong> ${esc(field('customerName')?.value.trim() || 'Esteemed Guest')}${mobile ? ` &nbsp;·&nbsp; <strong>Mobile:</strong> ${esc(mobile)}` : ''}`;
      heroMain.appendChild(contact);
    }
    clientBox.querySelector('.client-company-contact')?.remove();
    const company = field('companyName')?.value.trim() || 'ZULFIQAR GROUP';
    const companyMobile = field('whatsapp')?.value.trim() || '';
    const email = field('email')?.value.trim() || '';
    const address = field('officeAddress')?.value.trim() || '';
    const phone = field('phone')?.value.trim() || '';
    const website = field('website')?.value.trim() || '';
    const footer = clientBox.querySelector('.client-footer');
    if (footer) {
      const contactBox = document.createElement('div');
      contactBox.className = 'client-company-contact';
      contactBox.innerHTML = `<strong>${esc(company)}</strong>${companyMobile ? `<span class="company-line">WhatsApp: ${esc(companyMobile)}</span>` : ''}${phone ? `<span class="company-line">Phone: ${esc(phone)}</span>` : ''}${email ? `<span class="company-line">Email: ${esc(email)}</span>` : ''}${website ? `<span class="company-line">Website: ${esc(website)}</span>` : ''}${address ? `<span class="company-line">Office: ${esc(address)}</span>` : ''}`;
      footer.insertBefore(contactBox, footer.firstChild);
    }
    if (footer && !footer.querySelector('.client-share-actions')) {
      footer.querySelector('#clientPrintButton')?.remove();
      const actions = document.createElement('div');
      actions.className = 'client-share-actions no-print';
      actions.innerHTML = `<button class="button" type="button" data-client-action="pdf">PDF / Print</button><button class="button whatsapp-button" type="button" data-client-action="whatsapp">WhatsApp</button><button class="button secondary" type="button" data-client-action="text">Share Text</button>`;
      footer.appendChild(actions);
    }
  }

  function refresh() { addClientMobileField(); setTimeout(enhanceClientQuotation, 0); }
  document.addEventListener('click', event => {
    const action = event.target.closest('[data-client-action]')?.dataset.clientAction;
    if (!action) return;
    event.preventDefault();
    if (action === 'pdf') sharePdf();
    if (action === 'whatsapp') whatsapp();
    if (action === 'text') shareText();
  });
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', refresh));
  addClientMobileField();
  setTimeout(enhanceClientQuotation, 100);
})();
