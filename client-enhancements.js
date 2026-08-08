/* Zulfiqar Group client quotation sharing enhancements */
(() => {
  const form = document.querySelector('#calculator');
  const clientBox = document.querySelector('#clientQuotation');
  if (!form || !clientBox) return;
  const money = value => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const field = name => form.elements[name];
  const pkr = value => `PKR ${money(value)}`;
  const mobileKey = 'zulfiqar-client-mobile';

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
    const defaults = [
      flights.length ? 'Return air ticket' : '',
      field('visaRequired')?.checked ? 'Umrah visa included' : '',
      hotels.length ? 'Hotel accommodation' : '',
      transport.length ? 'Ground transport' : '',
      ziyarat.some(x => /makkah/i.test(x.service)) ? 'Makkah Ziyarat' : '',
      ziyarat.some(x => /madinah/i.test(x.service)) ? 'Madinah Ziyarat' : ''
    ].filter(Boolean);
    return [...new Set([...defaults, ...custom])];
  }

  function quoteText() {
    const name = field('customerName')?.value.trim() || 'Esteemed Guest';
    const mobile = field('clientMobile')?.value.trim() || '';
    const pax = Number(field('adults')?.value || 0) + Number(field('children')?.value || 0) + Number(field('infants')?.value || 0);
    const grand = document.querySelector('#grandTotal')?.textContent || 'PKR 0';
    const grandNumber = parseFloat(grand.replace(/[^0-9.]/g, '')) || 0;
    const per = pax ? pkr(grandNumber / pax) : 'PKR 0';
    const hotels = rows('hotel').filter(x => x.name || x.city).map(x => `${x.city || 'Hotel'}: ${x.name || 'Hotel'}${x.nights ? ` (${x.nights} nights)` : ''}`).join('\n');
    const flight = rows('flight').filter(x => x.airline || x.route).map(x => `${x.airline || 'Airline'} — ${x.route || 'Route TBC'}`).join('\n');
    const inc = packageInclusions().map(x => `✓ ${x}`).join('\n');
    return `🕋 ZULFIQAR GROUP — UMRAH QUOTATION\n\nClient: ${name}${mobile ? `\nMobile: ${mobile}` : ''}\nPassengers: ${pax || 'To be confirmed'}\n\n✈️ FLIGHT\n${flight || 'To be confirmed'}\n\n🏨 HOTELS\n${hotels || 'To be confirmed'}\n\n✅ INCLUSIONS\n${inc || 'To be confirmed'}\n\n💰 FINAL TOTAL: ${grand}\n💵 PER PAX: ${per}\n\nThank you for choosing Zulfiqar Group.`;
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

  function enhanceClientQuotation() {
    if (!document.body.classList.contains('client-mode')) return;
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
    const footer = clientBox.querySelector('.client-footer');
    if (footer && !footer.querySelector('.client-share-actions')) {
      footer.querySelector('#clientPrintButton')?.remove();
      const actions = document.createElement('div');
      actions.className = 'client-share-actions no-print';
      actions.innerHTML = `<button class="button" type="button" data-client-action="pdf">PDF / Print</button><button class="button whatsapp-button" type="button" data-client-action="whatsapp">WhatsApp</button><button class="button secondary" type="button" data-client-action="text">Share Text</button>`;
      footer.appendChild(actions);
    }
  }

  function refresh() {
    addClientMobileField();
    setTimeout(enhanceClientQuotation, 0);
  }

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
