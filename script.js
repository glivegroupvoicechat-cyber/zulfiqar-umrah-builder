/* Zulfiqar Group Umrah calculator — static, dependency-free, and GitHub Pages safe. */
const form = document.querySelector('#calculator');
const lists = { flight: '#flights', hotel: '#hotels', transport: '#transports', ziyarat: '#ziyarats', charge: '#charges' };
const storageKey = 'zulfiqar-umrah-package';
const clientRoute = 'Jeddah \u2192 Makkah \u2192 Madinah \u2192 Makkah \u2192 Jeddah';
const num = value => Math.max(0, Number(value) || 0);
const money = value => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(value));
const rateNumber = value => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num(value));
const sar = value => `SAR ${money(value)}`;
const pkr = value => `PKR ${money(value)}`;
const field = name => form.elements[name];
const eachRow = type => [...document.querySelectorAll(`${lists[type]} > article`)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function quoteNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `ZUG-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
}
function ensureQuoteDetails() {
  if (!field('quoteNumber').value) field('quoteNumber').value = quoteNumber();
  if (!field('quoteGeneratedAt').value) field('quoteGeneratedAt').value = new Date().toISOString();
}
function activeLogo() { return field('logoData').value || field('logoUrl').value.trim() || 'assets/zulfiqar-logo.png'; }
function setImage(image, source) {
  image.onerror = () => {
    const fallback = new URL('assets/zulfiqar-logo.png', window.location.href).href;
    if (image.src !== fallback) image.src = 'assets/zulfiqar-logo.png';
  };
  image.src = source;
}
function syncBrand() {
  const company = field('companyName').value.trim() || 'ZULFIQAR GROUP';
  document.querySelector('#headerCompanyName').textContent = company;
  document.querySelector('#headerLogo').alt = `${company} logo`;
  setImage(document.querySelector('#headerLogo'), activeLogo());
  setImage(document.querySelector('#logoPreview'), activeLogo());
}
function setMode(mode, recalculate = true) {
  const activeMode = mode === 'client' ? 'client' : 'company';
  field('viewMode').value = activeMode;
  document.body.classList.toggle('client-mode', activeMode === 'client');
  document.body.classList.toggle('company-mode', activeMode === 'company');
  document.querySelectorAll('[data-mode]').forEach(button => {
    const active = button.dataset.mode === activeMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (recalculate) calculate();
}
function addRow(type, values = {}) {
  const template = document.querySelector(`#${type}Template`);
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelectorAll('[data-field]').forEach(input => {
    if (values[input.dataset.field] !== undefined) input.value = values[input.dataset.field];
  });
  document.querySelector(lists[type]).append(row);
  return row;
}
function rowData(type) {
  return eachRow(type).map(row => Object.fromEntries([...row.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input.value])));
}
function hotelCalc(row, rate) {
  const rooms = num(row.querySelector('[data-field="rooms"]').value);
  const capacityPerRoom = num(row.querySelector('[data-field="roomType"]').value);
  const checkIn = row.querySelector('[data-field="checkIn"]').value;
  const checkOut = row.querySelector('[data-field="checkOut"]').value;
  const nights = checkIn && checkOut ? Math.max(0, Math.round((new Date(`${checkOut}T00:00`) - new Date(`${checkIn}T00:00`)) / 86400000)) : 0;
  row.querySelector('[data-field="nights"]').value = nights;
  const capacity = rooms * capacityPerRoom;
  const totalSar = num(row.querySelector('[data-field="rate"]').value) * rooms * nights;
  row.querySelector('.capacity').textContent = capacity;
  row.querySelector('.per-person').textContent = sar(capacity ? totalSar / capacity : 0);
  row.querySelector('.hotel-total').textContent = `${sar(totalSar)} \u00b7 ${pkr(totalSar * rate)}`;
  return { ...Object.fromEntries([...row.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input.value])), capacity, totalSar, nights };
}
function calculate() {
  ensureQuoteDetails();
  form.querySelectorAll('input[type="number"]').forEach(input => { if (Number(input.value) < 0) input.value = 0; });
  const pax = num(field('adults').value) + num(field('children').value) + num(field('infants').value);
  const rate = num(field('exchangeRate').value);
  document.querySelector('#totalPax').textContent = pax;
  document.querySelector('#rateDisplay').textContent = `${rateNumber(rate)} PKR`;
  field('visaRate').disabled = !field('visaRequired').checked;
  const visa = field('visaRequired').checked ? num(field('visaRate').value) * rate * pax : 0;
  document.querySelector('#visaPreview').textContent = `${pkr(visa)} total`;
  const hotels = eachRow('hotel').map(row => hotelCalc(row, rate));
  const hotelSar = hotels.reduce((sum, hotel) => sum + hotel.totalSar, 0);
  const capacity = hotels.reduce((sum, hotel) => sum + hotel.capacity, 0);
  document.querySelector('#hotelCapacity').textContent = capacity;
  const flights = eachRow('flight').map(row => {
    const total = num(row.querySelector('[data-field="rate"]').value) * pax;
    row.querySelector('.row-total b').textContent = pkr(total);
    return total;
  });
  const transports = eachRow('transport').map(row => {
    const total = num(row.querySelector('[data-field="rate"]').value) * rate;
    row.querySelector('.row-total b').textContent = pkr(total);
    return total;
  });
  const ziyarat = eachRow('ziyarat').map(row => {
    const total = num(row.querySelector('[data-field="rate"]').value) * rate;
    row.querySelector('.row-total b').textContent = pkr(total);
    return total;
  });
  const charges = eachRow('charge').reduce((sum, row) => sum + num(row.querySelector('[data-field="rate"]').value), 0);
  const totals = {
    hotelSar,
    hotelPkr: hotelSar * rate,
    visa,
    flight: flights.reduce((a, b) => a + b, 0),
    transport: transports.reduce((a, b) => a + b, 0),
    ziyarat: ziyarat.reduce((a, b) => a + b, 0),
    charges,
    profit: num(field('profit').value),
    commission: num(field('commission').value),
    discount: num(field('discount').value),
  };
  totals.grand = totals.hotelPkr + totals.visa + totals.flight + totals.transport + totals.ziyarat + totals.charges + totals.profit + totals.commission - totals.discount;
  syncBrand();
  renderSummary(totals, pax);
  renderWarnings(pax, capacity, hotels);
  renderClientQuotation(totals, pax, hotels);
  renderInvoice(totals, pax, rate, hotels);
  persist();
}
function renderSummary(totals, pax) {
  const rows = [['Hotel total', `${sar(totals.hotelSar)} \u00b7 ${pkr(totals.hotelPkr)}`], ['Visa + transport', pkr(totals.visa)], ['Flights', pkr(totals.flight)], ['Private transport', pkr(totals.transport)], ['Ziyarat', pkr(totals.ziyarat)], ['Other charges', pkr(totals.charges)], ['Profit', pkr(totals.profit)], ['Commission', pkr(totals.commission)], ['Discount', `\u2212 ${pkr(totals.discount)}`]];
  document.querySelector('#summaryRows').innerHTML = rows.map(([label, value]) => `<div class="summary-row"><span>${label}</span><b>${value}</b></div>`).join('');
  document.querySelector('#grandTotal').textContent = pkr(totals.grand);
  document.querySelector('#perPerson').textContent = `${pkr(pax ? totals.grand / pax : 0)} / passenger`;
}
function renderWarnings(pax, capacity, hotels) {
  const messages = [];
  if (hotels.some(hotel => hotel.checkIn && hotel.checkOut && !hotel.nights)) messages.push('A hotel check-out date must be after its check-in date.');
  if (pax && capacity > pax) messages.push(`Unused bed warning: hotel capacity (${capacity}) is greater than total passengers (${pax}).`);
  if (pax && capacity && pax > capacity) messages.push(`Room capacity warning: ${pax} passengers exceed the hotel capacity of ${capacity}.`);
  document.querySelector('#alerts').innerHTML = messages.map(message => `<div class="alert">${message}</div>`).join('');
}
function formatDate(value) {
  if (!value) return 'To be confirmed';
  const date = new Date(`${value}T00:00`);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}
function travelPeriod(hotels) {
  const starts = hotels.map(hotel => hotel.checkIn).filter(Boolean).sort();
  const ends = hotels.map(hotel => hotel.checkOut).filter(Boolean).sort();
  if (!starts.length && !ends.length) return 'Travel dates to be confirmed';
  return `${formatDate(starts[0])} \u2013 ${formatDate(ends[ends.length - 1])}`;
}
function normaliseTransportType(item) {
  return /bus/i.test(item.transportType || item.vehicle || '') ? 'Bus Transport' : 'Private Transport';
}
function roomTypeLabel(value) {
  return ({ 5: 'Quint sharing', 4: 'Quad sharing', 3: 'Triple sharing', 2: 'Double sharing', 1: 'Single room' }[Number(value)] || 'Room type to be confirmed');
}
function renderClientQuotation(totals, pax, hotels) {
  const client = document.querySelector('#clientQuotation');
  const company = field('companyName').value.trim() || 'ZULFIQAR GROUP';
  const flights = rowData('flight').filter(item => item.airline || item.route || num(item.rate));
  const transports = rowData('transport').filter(item => item.transportType || item.vehicle || item.route || num(item.rate));
  const customInclusions = field('packageInclusions').value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  const defaultInclusions = [
    flights.length ? 'Return air ticket' : '',
    field('visaRequired').checked ? 'Umrah visa included' : '',
    hotels.length ? 'Hotel accommodation' : '',
    transports.length ? 'Ground transport' : '',
    rowData('ziyarat').some(item => item.service || num(item.rate)) ? 'Ziyarat as selected' : '',
  ].filter(Boolean);
  const inclusions = [...new Set([...defaultInclusions, ...customInclusions])];
  const airlineCards = flights.length ? flights.map(item => `<article class="client-item airline-item">${item.airlineLogo ? `<img class="airline-logo" src="${esc(item.airlineLogo)}" alt="${esc(item.airline || 'Airline')} logo">` : '<div class="service-icon" aria-hidden="true">&#9992;</div>'}<div><h3>${esc(item.airline || 'Airline to be confirmed')}</h3><p>${esc(item.route || 'Route to be confirmed')}</p></div></article>`).join('') : '<p class="client-empty">Airline details to be confirmed.</p>';
  const hotelCards = hotels.length ? hotels.map(hotel => `<article class="client-item"><div class="service-icon hotel-icon" aria-hidden="true">&#127976;</div><div><h3>${esc(hotel.name || `${hotel.city} hotel`)}</h3><p>${esc(hotel.city)} &middot; ${esc(roomTypeLabel(hotel.roomType))} &middot; ${esc(String(hotel.nights || 0))} night(s)</p><p>${esc(formatDate(hotel.checkIn))} &ndash; ${esc(formatDate(hotel.checkOut))}</p></div></article>`).join('') : '<p class="client-empty">Hotel details to be confirmed.</p>';
  const transportCards = transports.length ? transports.map(item => {
    const type = normaliseTransportType(item);
    const icon = type === 'Bus Transport' ? '&#128652;' : '&#128663;';
    return `<article class="client-item"><div class="service-icon" aria-hidden="true">${icon}</div><div><h3>${esc(type)}</h3><p>${esc(clientRoute)}</p></div></article>`;
  }).join('') : '<p class="client-empty">Transport details to be confirmed.</p>';
  const inclusionList = inclusions.length ? `<ul class="inclusion-list">${inclusions.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '<p class="client-empty">Package inclusions to be confirmed.</p>';
  client.innerHTML = `<header class="client-quote-header"><div class="invoice-brand"><img src="${esc(activeLogo())}" alt="${esc(company)} logo"><div><p class="eyebrow">${esc(company)}</p><h1>Umrah Package Quotation</h1><p class="client-subtitle">A carefully arranged journey of faith.</p></div></div><div class="client-meta"><b>Quote no:</b> ${esc(field('quoteNumber').value)}<br><b>Travel period:</b> ${esc(travelPeriod(hotels))}<br><b>Passengers:</b> ${esc(String(pax || 'To be confirmed'))}</div></header><div class="client-hero"><div><p class="eyebrow">Your selected package</p><h2>${esc(field('customerName').value || 'Esteemed Guest')}</h2><p>Visa: <strong>${field('visaRequired').checked ? 'Included' : 'Not included'}</strong></p></div><div class="client-total">${totals.discount > 0 ? `<span>Discount: ${pkr(totals.discount)}</span>` : ''}<small>Final payable amount</small><strong>${pkr(totals.grand)}</strong></div></div><section class="client-section"><h2>Flight</h2><div class="client-grid">${airlineCards}</div></section><section class="client-section"><h2>Accommodation</h2><div class="client-grid">${hotelCards}</div></section><section class="client-section"><h2>Transport</h2><div class="client-grid">${transportCards}</div></section><section class="client-section"><h2>Package inclusions</h2>${inclusionList}</section><footer class="client-footer"><p>${esc(field('footerText').value || 'Thank you for choosing Zulfiqar Group.')}</p><strong>Prepared by: ${esc(field('preparedBy').value || 'Country Manager Muhammad Mubeen')}</strong><button class="button no-print" type="button" id="clientPrintButton">Print / Save Client Quote</button></footer>`;
}
function values() {
  return { version: 3, fields: Object.fromEntries([...form.querySelectorAll('[name]')].map(input => [input.name, input.type === 'checkbox' ? input.checked : input.value])), rows: Object.fromEntries(Object.keys(lists).map(type => [type, rowData(type)])) };
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(values())); } catch { /* Browser storage is optional; JSON export still works. */ }
}
function restore(data) {
  if (!data || !data.fields || !data.rows) throw new Error('This file is not a valid Umrah package.');
  Object.entries(data.fields).forEach(([name, value]) => {
    if (!field(name)) return;
    field(name)[field(name).type === 'checkbox' ? 'checked' : 'value'] = value;
  });
  Object.keys(lists).forEach(type => {
    document.querySelector(lists[type]).innerHTML = '';
    const savedRows = data.rows[type] || [];
    savedRows.forEach(value => addRow(type, value));
    if (!savedRows.length && (type === 'flight' || type === 'hotel')) addRow(type);
  });
  ensureQuoteDetails();
  setMode(field('viewMode').value, false);
  calculate();
}
function dateTime(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.valueOf()) ? '—' : date.toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
}
function renderInvoice(totals, pax, rate, hotels) {
  const value = name => field(name).value || '—';
  const flights = rowData('flight');
  const transports = rowData('transport');
  const ziyarat = rowData('ziyarat');
  const company = field('companyName').value.trim() || 'ZULFIQAR GROUP';
  const contactItems = [['WhatsApp', field('whatsapp').value], ['Phone', field('phone').value], ['Email', field('email').value], ['Website', field('website').value], ['Office', field('officeAddress').value]].filter(([, contact]) => contact.trim());
  const contacts = contactItems.length ? contactItems.map(([label, contact]) => `<div>${esc(label)}: ${esc(contact)}</div>`).join('') : '<span class="muted">Contact information not provided.</span>';
  const table = (heads, rows) => rows.length ? `<table><thead><tr>${heads.map(head => `<th>${esc(head)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell || '—')}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '<p class="muted">Not included.</p>';
  document.querySelector('#invoice').innerHTML = `<header class="invoice-header"><div class="invoice-brand"><img src="${esc(activeLogo())}" alt="${esc(company)} logo"><div><p class="eyebrow">${esc(company)}</p><h1>Umrah Package Company Sheet</h1><div class="invoice-contact">${contacts}</div></div></div><div class="invoice-meta"><b>Quote no:</b> ${esc(value('quoteNumber'))}<br><b>Date & time:</b> ${esc(dateTime(value('quoteGeneratedAt')))}<br><span class="muted">1 SAR = ${rateNumber(rate)} PKR</span></div></header><div class="invoice-grid"><section><h2>Customer details</h2>${table(['Customer', 'Family head', 'Booking date', 'Voucher date'], [[value('customerName'), value('familyHead'), value('bookingDate'), value('voucherDate')]])}</section><section><h2>Passenger summary</h2>${table(['Adults', 'Children', 'Infants', 'Total pax', 'Beds'], [[field('adults').value, field('children').value, field('infants').value, pax, field('beds').value]])}</section></div><h2>Flights</h2>${table(['Airline', 'Route', 'Cost / person'], flights.map(item => [item.airline, item.route, pkr(num(item.rate))]))}<h2>Hotels</h2>${table(['Hotel', 'City', 'Sharing', 'Rooms', 'Nights', 'Room rate', 'Total'], hotels.map(hotel => [hotel.name, hotel.city, `${hotel.roomType} sharing`, hotel.rooms, hotel.nights, sar(hotel.rate), `${sar(hotel.totalSar)} / ${pkr(hotel.totalSar * rate)}`]))}<h2>Visa, transport & ziyarat</h2>${table(['Service', 'Details', 'Total'], [[field('visaRequired').checked ? 'Visa + transport' : 'Visa', 'Per passenger', pkr(totals.visa)], ...transports.map(item => [normaliseTransportType(item), `${item.route || clientRoute} — ${item.vehicle || 'Vehicle to be confirmed'}`, pkr(num(item.rate) * rate)]), ...ziyarat.map(item => [item.service, '', pkr(num(item.rate) * rate)])])}<div class="total-box">${[['Hotel', totals.hotelPkr], ['Visa + transport', totals.visa], ['Flights', totals.flight], ['Private transport', totals.transport], ['Ziyarat', totals.ziyarat], ['Other charges', totals.charges], ['Profit', totals.profit], ['Commission', totals.commission], ['Discount', -totals.discount]].map(([label, amount]) => `<div class="total-line"><span>${esc(label)}</span><b>${pkr(amount)}</b></div>`).join('')}<div class="total-line grand-print"><span>Grand total</span><span>${pkr(totals.grand)}</span></div><div class="total-line"><span>Per passenger</span><span>${pkr(pax ? totals.grand / pax : 0)}</span></div></div><footer class="quote-footer"><strong>Prepared by:</strong> ${esc(value('preparedBy'))}<br><span class="muted">${esc(value('footerText'))}</span></footer>`;
}
document.addEventListener('click', event => {
  const modeButton = event.target.closest('[data-mode]');
  if (modeButton) { setMode(modeButton.dataset.mode); return; }
  if (event.target.id === 'clientPrintButton') { calculate(); window.print(); return; }
  const add = event.target.dataset.add;
  if (add) { addRow(add); calculate(); }
  if (event.target.closest('.remove-row')) { event.target.closest('article').remove(); calculate(); }
});
form.addEventListener('input', event => {
  if (event.target.name === 'logoUrl') field('logoData').value = '';
  calculate();
});
form.addEventListener('change', calculate);
document.querySelector('#logoUpload').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { field('logoData').value = reader.result; calculate(); };
  reader.readAsDataURL(file);
});
document.querySelector('#resetButton').addEventListener('click', () => {
  if (!confirm('Clear the entire package?')) return;
  form.reset();
  localStorage.removeItem(storageKey);
  Object.values(lists).forEach(id => { document.querySelector(id).innerHTML = ''; });
  addRow('flight');
  addRow('hotel');
  ensureQuoteDetails();
  setMode('company', false);
  calculate();
});
document.querySelector('#saveButton').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(values(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `umrah-package-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});
document.querySelector('#loadFile').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { restore(JSON.parse(reader.result)); }
    catch (error) { document.querySelector('#alerts').innerHTML = `<div class="alert danger">${esc(error.message)}</div>`; }
  };
  reader.readAsText(file);
  event.target.value = '';
});
document.querySelector('#printButton').addEventListener('click', () => { calculate(); window.print(); });
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) restore(saved);
  else {
    addRow('flight');
    addRow('hotel');
    ensureQuoteDetails();
    setMode('company', false);
    calculate();
  }
} catch {
  addRow('flight');
  addRow('hotel');
  ensureQuoteDetails();
  setMode('company', false);
  calculate();
}
