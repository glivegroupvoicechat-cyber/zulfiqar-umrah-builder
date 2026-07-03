import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2,
  CalendarDays,
  Copy,
  Download,
  FileText,
  Hotel,
  ImageDown,
  Layers,
  PackageOpen,
  Plane,
  Plus,
  Printer,
  Save,
  Trash2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './styles.css';

const brand = {
  name: 'Zulfiqar Group',
  title: 'Umrah Hotel Voucher',
  description: 'Premium Umrah accommodation rates for Makkah and Madinah.',
  footer: 'May Allah accept your journey and worship.',
};

const blankHotel = {
  name: '',
  distance: '',
  roomOnly: '',
  sharing: '',
  quad: '',
  triple: '',
  double: '',
};

const defaultVoucher = {
  company: {
    logo: '',
    name: brand.name,
    title: brand.title,
    description: brand.description,
    footer: brand.footer,
    whatsapp: '+966 50 000 0000',
    phone: '+966 11 000 0000',
    website: 'www.zulfiqargroup.com',
    address: 'Makkah Road, Jeddah, Saudi Arabia',
  },
  info: {
    date: new Date().toISOString().slice(0, 10),
    season: 'Umrah Season 2026',
    validUntil: '',
  },
  makkahHotels: [
    { ...blankHotel, name: 'Makkah Premium Hotel', distance: '350m', sharing: 'SAR 95', quad: 'SAR 120', triple: 'SAR 150', double: 'SAR 220' },
  ],
  madinahHotels: [
    { ...blankHotel, name: 'Madinah Comfort Hotel', distance: '450m', sharing: 'SAR 85', quad: 'SAR 105', triple: 'SAR 135', double: 'SAR 190' },
  ],
};

const defaultPackage = {
  company: {
    logo: '',
    name: brand.name,
  },
  info: {
    name: 'Premium Umrah Package',
    days: '14',
    departureDate: '',
    returnDate: '',
  },
  flight: {
    airline: 'Saudi Airlines',
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: 'JED / MED',
    departureTime: '',
    arrivalTime: '',
    baggage: '23kg baggage included',
    meal: true,
  },
  hotels: {
    makkahName: 'Makkah Premium Hotel',
    makkahDistance: '350m from Haram',
    madinahName: 'Madinah Comfort Hotel',
    madinahDistance: '450m from Masjid Nabawi',
  },
  transport: {
    airportTransfer: true,
    bus: true,
    ziyarat: true,
    visa: true,
  },
  prices: {
    sharing: 'SAR 3,950',
    quad: 'SAR 4,350',
    triple: 'SAR 4,850',
    double: 'SAR 5,950',
  },
  description: 'Package Includes\nHotel Stay\nVisa\nTransport\nBreakfast\nZiyarat\nCustomer Support',
  footer: {
    terms: 'Prices are subject to availability. Passport validity and visa approval required.',
    contact: '+966 11 000 0000',
    whatsapp: '+966 50 000 0000',
    website: 'www.zulfiqargroup.com',
    address: 'Makkah Road, Jeddah, Saudi Arabia',
  },
};

const exportSizes = {
  a4: { label: 'A4 PDF', width: 794, height: 1123 },
  whatsapp: { label: 'WhatsApp Portrait', width: 1080, height: 1350 },
  instagram: { label: 'Instagram Post', width: 1080, height: 1080 },
  facebook: { label: 'Facebook Post', width: 1200, height: 630 },
  story: { label: 'Story Size', width: 1080, height: 1920 },
};

function readTemplates() {
  try {
    return JSON.parse(localStorage.getItem('zg_templates') || '[]');
  } catch {
    return [];
  }
}

function App() {
  const [view, setView] = useState('voucher');
  const [voucher, setVoucher] = useState(defaultVoucher);
  const [pkg, setPkg] = useState(defaultPackage);
  const [templates, setTemplates] = useState(readTemplates);
  const [exportSize, setExportSize] = useState('a4');
  const previewRef = useRef(null);

  const currentData = view === 'voucher' ? voucher : pkg;
  const activeTitle = view === 'voucher' ? 'Hotel Voucher Builder' : view === 'package' ? 'Umrah Package Builder' : 'Saved Templates';

  function persistTemplates(next) {
    setTemplates(next);
    localStorage.setItem('zg_templates', JSON.stringify(next));
  }

  function saveTemplate() {
    if (view === 'templates') return;
    const template = {
      id: crypto.randomUUID(),
      type: view,
      name: `${activeTitle} - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      data: currentData,
    };
    persistTemplates([template, ...templates]);
  }

  function loadTemplate(template) {
    if (template.type === 'voucher') {
      setVoucher(template.data);
      setView('voucher');
    } else {
      setPkg(template.data);
      setView('package');
    }
  }

  function duplicateTemplate(template) {
    persistTemplates([{ ...template, id: crypto.randomUUID(), name: `${template.name} Copy`, createdAt: new Date().toISOString() }, ...templates]);
  }

  function deleteTemplate(id) {
    persistTemplates(templates.filter((template) => template.id !== id));
  }

  async function exportImage(format = 'png') {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      scale: 2.5,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    if (format === 'pdf') {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const image = canvas.toDataURL('image/png');
      pdf.addImage(image, 'PNG', 0, 0, 210, 297);
      pdf.save(`${view}-zulfiqar-group.pdf`);
      return;
    }

    const selectedSize = exportSizes[exportSize];
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = selectedSize.width;
    outputCanvas.height = selectedSize.height;
    const context = outputCanvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
    context.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height);

    const link = document.createElement('a');
    link.download = `${view}-${selectedSize.label.toLowerCase().replaceAll(' ', '-')}-zulfiqar-group.png`;
    link.href = outputCanvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-5 lg:px-6">
        <Dashboard view={view} setView={setView} />

        <div className="toolbar">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{activeTitle}</h1>
          </div>
          <div className="toolbar-actions">
            <select value={exportSize} onChange={(event) => setExportSize(event.target.value)} aria-label="Export size">
              {Object.entries(exportSizes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            {view !== 'templates' && (
              <>
                <IconButton label="Save Template" onClick={saveTemplate} icon={<Save size={18} />} />
                <IconButton label="Download PNG" onClick={() => exportImage('png')} icon={<ImageDown size={18} />} />
                <IconButton label="Download PDF" onClick={() => exportImage('pdf')} icon={<Download size={18} />} />
                <IconButton label="Print" onClick={() => window.print()} icon={<Printer size={18} />} />
              </>
            )}
          </div>
        </div>

        {view === 'templates' ? (
          <Templates templates={templates} loadTemplate={loadTemplate} duplicateTemplate={duplicateTemplate} deleteTemplate={deleteTemplate} />
        ) : (
          <section className="builder-grid">
            <div className="form-panel">
              {view === 'voucher' ? (
                <VoucherForm data={voucher} setData={setVoucher} />
              ) : (
                <PackageForm data={pkg} setData={setPkg} />
              )}
            </div>
            <div className="preview-panel">
              <div className="preview-shell">
                <div className={`export-stage size-${exportSize}`}>
                  <div ref={previewRef} className="preview-document">
                    {view === 'voucher' ? <VoucherPreview data={voucher} /> : <PackagePreview data={pkg} />}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="app-header">
      <div className="brand-mark">ZG</div>
      <div>
        <strong>Zulfiqar Group</strong>
        <span>Umrah Voucher & Package Builder</span>
      </div>
    </header>
  );
}

function Dashboard({ view, setView }) {
  const cards = [
    { id: 'voucher', title: 'Hotel Voucher Builder', icon: <Hotel />, body: 'Create Makkah and Madinah hotel rate vouchers.' },
    { id: 'package', title: 'Umrah Package Builder', icon: <PackageOpen />, body: 'Build flight, hotel, transport, and price flyers.' },
    { id: 'templates', title: 'Saved Templates', icon: <Layers />, body: 'Load, duplicate, or delete saved layouts.' },
  ];
  return (
    <nav className="dashboard-cards" aria-label="Builder sections">
      {cards.map((card) => (
        <button className={view === card.id ? 'dash-card active' : 'dash-card'} key={card.id} onClick={() => setView(card.id)}>
          {React.cloneElement(card.icon, { size: 24 })}
          <span>
            <strong>{card.title}</strong>
            <small>{card.body}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}

function IconButton({ label, onClick, icon }) {
  return (
    <button className="icon-button" onClick={onClick} title={label} aria-label={label}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className="form-section">
      <h2>{icon}{title}</h2>
      <div className="field-grid">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, type = 'text', wide = false }) {
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span>{label}</span>
      <input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea value={value || ''} rows="5" onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function LogoUpload({ value, onChange }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }
  return (
    <label className="field wide">
      <span>Company Logo Upload</span>
      <input type="file" accept="image/*" onChange={handleFile} />
      {value && <img className="logo-thumb" src={value} alt="Uploaded logo preview" />}
    </label>
  );
}

function VoucherForm({ data, setData }) {
  const setCompany = (key, value) => setData({ ...data, company: { ...data.company, [key]: value } });
  const setInfo = (key, value) => setData({ ...data, info: { ...data.info, [key]: value } });
  const setHotel = (city, index, key, value) => {
    const next = data[city].map((hotel, i) => (i === index ? { ...hotel, [key]: value } : hotel));
    setData({ ...data, [city]: next });
  };
  const addHotel = (city) => setData({ ...data, [city]: [...data[city], { ...blankHotel }] });
  const removeHotel = (city, index) => setData({ ...data, [city]: data[city].filter((_, i) => i !== index) });

  return (
    <>
      <Section icon={<Building2 size={19} />} title="Company Information">
        <LogoUpload value={data.company.logo} onChange={(value) => setCompany('logo', value)} />
        <TextField label="Company Name" value={data.company.name} onChange={(value) => setCompany('name', value)} />
        <TextField label="Header Title" value={data.company.title} onChange={(value) => setCompany('title', value)} />
        <TextArea label="Description" value={data.company.description} onChange={(value) => setCompany('description', value)} />
        <TextField label="Footer Text" value={data.company.footer} onChange={(value) => setCompany('footer', value)} />
        <TextField label="WhatsApp Number" value={data.company.whatsapp} onChange={(value) => setCompany('whatsapp', value)} />
        <TextField label="Phone Number" value={data.company.phone} onChange={(value) => setCompany('phone', value)} />
        <TextField label="Website" value={data.company.website} onChange={(value) => setCompany('website', value)} />
        <TextField label="Office Address" value={data.company.address} onChange={(value) => setCompany('address', value)} wide />
      </Section>
      <Section icon={<CalendarDays size={19} />} title="Voucher Information">
        <TextField type="date" label="Voucher Date" value={data.info.date} onChange={(value) => setInfo('date', value)} />
        <TextField label="Season" value={data.info.season} onChange={(value) => setInfo('season', value)} />
        <TextField type="date" label="Valid Until" value={data.info.validUntil} onChange={(value) => setInfo('validUntil', value)} />
      </Section>
      <HotelEditor title="Makkah Hotels" hotels={data.makkahHotels} distanceLabel="Distance from Haram" onChange={(i, k, v) => setHotel('makkahHotels', i, k, v)} onAdd={() => addHotel('makkahHotels')} onRemove={(i) => removeHotel('makkahHotels', i)} />
      <HotelEditor title="Madinah Hotels" hotels={data.madinahHotels} distanceLabel="Distance from Masjid Nabawi" onChange={(i, k, v) => setHotel('madinahHotels', i, k, v)} onAdd={() => addHotel('madinahHotels')} onRemove={(i) => removeHotel('madinahHotels', i)} />
    </>
  );
}

function HotelEditor({ title, hotels, distanceLabel, onChange, onAdd, onRemove }) {
  return (
    <section className="form-section">
      <div className="section-title-row">
        <h2><Hotel size={19} />{title}</h2>
        <button className="add-button" onClick={onAdd}><Plus size={16} />Add Hotel</button>
      </div>
      {hotels.map((hotel, index) => (
        <div className="hotel-row" key={index}>
          <TextField label="Hotel Name" value={hotel.name} onChange={(value) => onChange(index, 'name', value)} />
          <TextField label={distanceLabel} value={hotel.distance} onChange={(value) => onChange(index, 'distance', value)} />
          <TextField label="Room Only Rate" value={hotel.roomOnly} onChange={(value) => onChange(index, 'roomOnly', value)} />
          <TextField label="Sharing Rate" value={hotel.sharing} onChange={(value) => onChange(index, 'sharing', value)} />
          <TextField label="Quad Rate" value={hotel.quad} onChange={(value) => onChange(index, 'quad', value)} />
          <TextField label="Triple Rate" value={hotel.triple} onChange={(value) => onChange(index, 'triple', value)} />
          <TextField label="Double Rate" value={hotel.double} onChange={(value) => onChange(index, 'double', value)} />
          <button className="remove-button" onClick={() => onRemove(index)} title="Remove hotel" aria-label="Remove hotel"><Trash2 size={16} /></button>
        </div>
      ))}
    </section>
  );
}

function PackageForm({ data, setData }) {
  const update = (group, key, value) => setData({ ...data, [group]: { ...data[group], [key]: value } });

  return (
    <>
      <Section icon={<Building2 size={19} />} title="Company Information">
        <LogoUpload value={data.company.logo} onChange={(value) => update('company', 'logo', value)} />
        <TextField label="Company Name" value={data.company.name} onChange={(value) => update('company', 'name', value)} />
      </Section>
      <Section icon={<PackageOpen size={19} />} title="Package Information">
        <TextField label="Package Name" value={data.info.name} onChange={(value) => update('info', 'name', value)} />
        <TextField label="Number of Days" value={data.info.days} onChange={(value) => update('info', 'days', value)} />
        <TextField type="date" label="Departure Date" value={data.info.departureDate} onChange={(value) => update('info', 'departureDate', value)} />
        <TextField type="date" label="Return Date" value={data.info.returnDate} onChange={(value) => update('info', 'returnDate', value)} />
      </Section>
      <Section icon={<Plane size={19} />} title="Flight Details">
        {Object.entries({
          airline: 'Airline',
          flightNumber: 'Flight Number',
          departureAirport: 'Departure Airport',
          arrivalAirport: 'Arrival Airport',
          departureTime: 'Departure Time',
          arrivalTime: 'Arrival Time',
          baggage: 'Baggage Allowance',
        }).map(([key, label]) => (
          <TextField key={key} label={label} value={data.flight[key]} onChange={(value) => update('flight', key, value)} />
        ))}
        <label className="check-field"><input type="checkbox" checked={data.flight.meal} onChange={(event) => update('flight', 'meal', event.target.checked)} />Meal Included</label>
      </Section>
      <Section icon={<Hotel size={19} />} title="Hotels">
        <TextField label="Makkah Hotel" value={data.hotels.makkahName} onChange={(value) => update('hotels', 'makkahName', value)} />
        <TextField label="Makkah Distance" value={data.hotels.makkahDistance} onChange={(value) => update('hotels', 'makkahDistance', value)} />
        <TextField label="Madinah Hotel" value={data.hotels.madinahName} onChange={(value) => update('hotels', 'madinahName', value)} />
        <TextField label="Madinah Distance" value={data.hotels.madinahDistance} onChange={(value) => update('hotels', 'madinahDistance', value)} />
      </Section>
      <Section icon={<Layers size={19} />} title="Transportation">
        {Object.entries({ airportTransfer: 'Airport Transfer Included', bus: 'Bus Transport Included', ziyarat: 'Ziyarat Included', visa: 'Visa Included' }).map(([key, label]) => (
          <label className="check-field" key={key}><input type="checkbox" checked={data.transport[key]} onChange={(event) => update('transport', key, event.target.checked)} />{label}</label>
        ))}
      </Section>
      <Section icon={<FileText size={19} />} title="Package Prices">
        {Object.entries({ sharing: 'Sharing Price', quad: 'Quad Price', triple: 'Triple Price', double: 'Double Price' }).map(([key, label]) => (
          <TextField key={key} label={label} value={data.prices[key]} onChange={(value) => update('prices', key, value)} />
        ))}
      </Section>
      <Section icon={<FileText size={19} />} title="Package Description">
        <TextArea label="Large Rich Text Area" value={data.description} onChange={(value) => setData({ ...data, description: value })} />
      </Section>
      <Section icon={<Building2 size={19} />} title="Footer">
        <TextArea label="Terms & Conditions" value={data.footer.terms} onChange={(value) => update('footer', 'terms', value)} />
        <TextField label="Contact Number" value={data.footer.contact} onChange={(value) => update('footer', 'contact', value)} />
        <TextField label="WhatsApp" value={data.footer.whatsapp} onChange={(value) => update('footer', 'whatsapp', value)} />
        <TextField label="Website" value={data.footer.website} onChange={(value) => update('footer', 'website', value)} />
        <TextField label="Office Address" value={data.footer.address} onChange={(value) => update('footer', 'address', value)} wide />
      </Section>
    </>
  );
}

function VoucherPreview({ data }) {
  return (
    <article className="brochure voucher-preview">
      <PreviewHeader logo={data.company.logo} name={data.company.name} title={data.company.title} description={data.company.description} />
      <div className="meta-strip">
        <span>Date: {data.info.date || 'TBA'}</span>
        <span>{data.info.season || 'Season'}</span>
        <span>Valid Until: {data.info.validUntil || 'TBA'}</span>
      </div>
      <HotelTable title="Makkah Hotels" subtitle="Distance from Haram" hotels={data.makkahHotels} />
      <HotelTable title="Madinah Hotels" subtitle="Distance from Masjid Nabawi" hotels={data.madinahHotels} />
      <PreviewFooter data={data.company} />
    </article>
  );
}

function PackagePreview({ data }) {
  const inclusions = useMemo(() => data.description.split('\n').filter(Boolean), [data.description]);
  return (
    <article className="brochure package-preview">
      <PreviewHeader logo={data.company.logo} name={data.company.name} title={data.info.name} description={`${data.info.days || '0'} days Umrah journey with flights, hotels, transport, and support.`} />
      <div className="package-hero">
        <div><small>Departure</small><strong>{data.info.departureDate || 'TBA'}</strong></div>
        <div><small>Return</small><strong>{data.info.returnDate || 'TBA'}</strong></div>
        <div><small>Airline</small><strong>{data.flight.airline || 'TBA'}</strong></div>
      </div>
      <div className="preview-columns">
        <div className="preview-card">
          <h3>Flight Details</h3>
          <p>{data.flight.flightNumber || 'Flight number'} - {data.flight.departureAirport || 'Departure'} to {data.flight.arrivalAirport || 'Arrival'}</p>
          <p>{data.flight.departureTime || 'Departure time'} - {data.flight.arrivalTime || 'Arrival time'}</p>
          <p>{data.flight.baggage}</p>
          <p>{data.flight.meal ? 'Meal included' : 'Meal not included'}</p>
        </div>
        <div className="preview-card">
          <h3>Hotels</h3>
          <p><strong>Makkah:</strong> {data.hotels.makkahName} - {data.hotels.makkahDistance}</p>
          <p><strong>Madinah:</strong> {data.hotels.madinahName} - {data.hotels.madinahDistance}</p>
        </div>
      </div>
      <div className="price-grid">
        {Object.entries(data.prices).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value || 'TBA'}</strong></div>)}
      </div>
      <div className="preview-columns">
        <div className="preview-card">
          <h3>Package Includes</h3>
          <ul>{inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="preview-card">
          <h3>Transportation</h3>
          <ul>
            {Object.entries(data.transport).filter(([, value]) => value).map(([key]) => <li key={key}>{key.replace(/([A-Z])/g, ' $1')}</li>)}
          </ul>
        </div>
      </div>
      <PreviewFooter data={{ footer: data.footer.terms, phone: data.footer.contact, whatsapp: data.footer.whatsapp, website: data.footer.website, address: data.footer.address }} />
    </article>
  );
}

function PreviewHeader({ logo, name, title, description }) {
  return (
    <header className="preview-header">
      <div className="preview-logo">{logo ? <img src={logo} alt="" /> : 'ZG'}</div>
      <div>
        <p>{name}</p>
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
    </header>
  );
}

function HotelTable({ title, subtitle, hotels }) {
  return (
    <section className="preview-table-block">
      <h3>{title}<span>{subtitle}</span></h3>
      <table>
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Distance</th>
            <th>Room Only</th>
            <th>Sharing</th>
            <th>Quad</th>
            <th>Triple</th>
            <th>Double</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel, index) => (
            <tr key={index}>
              <td>{hotel.name || 'Hotel name'}</td>
              <td>{hotel.distance || '-'}</td>
              <td>{hotel.roomOnly || '-'}</td>
              <td>{hotel.sharing || '-'}</td>
              <td>{hotel.quad || '-'}</td>
              <td>{hotel.triple || '-'}</td>
              <td>{hotel.double || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PreviewFooter({ data }) {
  return (
    <footer className="preview-footer">
      <div>
        <strong>{data.footer}</strong>
        <p>{data.phone} | WhatsApp {data.whatsapp} | {data.website}</p>
        <p>{data.address}</p>
      </div>
      <div className="qr-placeholder">QR</div>
    </footer>
  );
}

function Templates({ templates, loadTemplate, duplicateTemplate, deleteTemplate }) {
  return (
    <section className="templates-view">
      {templates.length === 0 ? (
        <div className="empty-state">
          <Layers size={42} />
          <h2>No saved templates yet</h2>
          <p>Save a voucher or package to reuse it later.</p>
        </div>
      ) : templates.map((template) => (
        <article className="template-card" key={template.id}>
          <div>
            <p className="eyebrow">{template.type}</p>
            <h2>{template.name}</h2>
            <span>{new Date(template.createdAt).toLocaleString()}</span>
          </div>
          <div className="template-actions">
            <IconButton label="Load" onClick={() => loadTemplate(template)} icon={<FileText size={18} />} />
            <IconButton label="Duplicate" onClick={() => duplicateTemplate(template)} icon={<Copy size={18} />} />
            <IconButton label="Delete" onClick={() => deleteTemplate(template.id)} icon={<Trash2 size={18} />} />
          </div>
        </article>
      ))}
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
