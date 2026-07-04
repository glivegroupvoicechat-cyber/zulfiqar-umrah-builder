import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Hotel,
  ImageDown,
  Layers,
  MapPin,
  PackageOpen,
  Plane,
  Plus,
  Printer,
  QrCode,
  Save,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './styles.css';

const brand = {
  name: 'Zulfiqar Group',
  title: 'Umrah Packages 2026',
  tagline: 'Connecting faith, delivering excellence',
  footer: 'A comfortable journey, a deeper faith',
};

const designStyles = {
  royal: 'Royal Green Gold',
  navy: 'Navy Executive',
  brochure: '3D Brochure',
  elegant: 'Elegant White',
  compact: 'Rate Sheet',
};

const exportSizes = {
  a4: { label: 'A4 PDF', width: 794, height: 1123 },
  whatsapp: { label: 'WhatsApp Portrait', width: 1080, height: 1350 },
  instagram: { label: 'Instagram Post', width: 1080, height: 1080 },
  facebook: { label: 'Facebook Post', width: 1200, height: 630 },
  story: { label: 'Story Size', width: 1080, height: 1920 },
};

const airlines = ['Air Sial', 'PIA', 'Saudi Airlines', 'Serene Air', 'Airblue', 'Emirates', 'Qatar Airways'];
const airports = ['LHE', 'ISB', 'KHI', 'MUX', 'JED', 'MED', 'RUH', 'DXB', 'DOH'];
const makkahHotels = ['Hiba Hijra', 'Anwar Al Rayan', 'Emaar Al Khair Golden Hotel', 'Jada Khalil', 'Mira Shaeb', 'Saif Al Majd'];
const madinahHotels = ['Diyar Safa', 'Retaj Al Madina', 'Safeer Sakni 2', 'Nozl Al Falah', 'Asnar Plus', 'Kinan Or Similar'];

const blankHotel = {
  name: '',
  distance: '',
  nights: '',
  roomOnly: '',
  sharing: '',
  quad: '',
  triple: '',
  double: '',
};

const defaultBranding = {
  logo: '',
  qrCode: '',
  qrText: 'Scan to book',
  backgroundImage: '',
  name: brand.name,
  title: brand.title,
  tagline: brand.tagline,
  whatsapp: '0302-6081935',
  phone: '0300-8893236',
  website: 'www.zulfiqargroup.com',
  address: 'Office No. 31, Mediacom Plaza, Faisalabad',
  logoShape: 'rounded',
  logoSize: 'cover',
};

const defaultVoucher = {
  style: 'compact',
  branding: defaultBranding,
  info: {
    packageTitle: '21 Days Umrah Packages',
    baggage: '20KG + 7KG / 20KG + 7KG',
    extra: '10 KG extra on return flight with extra amount',
    travellingFrom: 'Lahore',
    date: new Date().toISOString().slice(0, 10),
    validUntil: '',
  },
  flights: {
    outbound: 'PA 470 | 16-Jul | LHE-JED | 11:35 - 03:15',
    inbound: 'PA 471 | 05-Aug | JED-LHE | 04:30 - 12:00',
    airlineLogo: '',
  },
  rows: [
    { id: crypto.randomUUID(), nights: '08', makkahName: 'HIBA HIJRA 6 OR SIMILAR', makkahDistance: 'Shuttle', makkahImage: '', madinahName: 'RETAJ AL MADINA OR SIMILAR', madinahDistance: 'Shuttle', madinahImage: '', sharing: '268,600', quad: '273,700', triple: '282,000', double: '298,700' },
    { id: crypto.randomUUID(), nights: '09', makkahName: 'HIBA HIJRA 6 OR SIMILAR', makkahDistance: 'Shuttle', makkahImage: '', madinahName: 'SAFEER SAKNI 2 OR SIMILAR', madinahDistance: '700M', madinahImage: '', sharing: '275,900', quad: '280,500', triple: '291,100', double: '312,400' },
    { id: crypto.randomUUID(), nights: '10', makkahName: 'JADA KHALIL OR SIMILAR', makkahDistance: '1200M', makkahImage: '', madinahName: 'KINAN OR SIMILAR', madinahDistance: '900M', madinahImage: '', sharing: '273,600', quad: '280,300', triple: '289,700', double: '311,000' },
  ],
};

const defaultPackage = {
  style: 'brochure',
  branding: defaultBranding,
  info: {
    packageName: 'PKG#63',
    days: '21',
    availableSeats: '12',
    travellingDate: '19 JUL',
    nights: '20 Nights',
    registerText: 'Register Now',
  },
  flight: {
    airline: 'Air Sial',
    airlineLogo: '',
    outFlight: 'SV735',
    outDate: '19 JUL',
    outRoute: 'LHE-JED',
    outTime: '10:30/13:35',
    inFlight: 'SV738',
    inDate: '08 AUG',
    inRoute: 'JED-LHE',
    inTime: '18:05/01:00',
    baggage: '20kg + 7kg',
    meal: true,
  },
  hotels: {
    makkahName: 'ANWAR AL RAYAN',
    makkahDistance: 'Makkah',
    makkahImage: '',
    madinahName: 'DIYAR SAFA',
    madinahDistance: 'Madina',
    madinahImage: '',
  },
  transport: {
    visa: true,
    ticket: true,
    hotel: true,
    transport: true,
    ziyarat: true,
    support: true,
  },
  prices: {
    sharing: '289,999',
    quad: '298,999',
    triple: '313,999',
    double: '362,999',
  },
  currency: 'PKR',
};

const defaultTicket = {
  style: 'navy',
  branding: defaultBranding,
  passenger: {
    name: 'Customer Name',
    bookingRef: 'ZF-100087',
    ticketNo: 'UP-100087',
    status: 'Confirmed',
  },
  flight: {
    airline: 'Air Sial',
    airlineLogo: '',
    flightNumber: 'PF716',
    date: '11 July 2026',
    route: 'Lahore to Jeddah',
    from: 'LHE',
    to: 'JED',
    departure: '22:10',
    arrival: '02:00',
    baggage: '20KG + 7KG',
    terminal: 'International',
    meal: true,
  },
  contact: {
    phone: '0302-6081935',
    whatsapp: '0300-8893236',
    note: 'Please arrive at airport at least 4 hours before departure.',
  },
};

function readTemplates() {
  try {
    return JSON.parse(localStorage.getItem('zg_templates') || '[]');
  } catch {
    return [];
  }
}

function App() {
  const [view, setView] = useState('package');
  const [voucher, setVoucher] = useState(defaultVoucher);
  const [pkg, setPkg] = useState(defaultPackage);
  const [ticket, setTicket] = useState(defaultTicket);
  const [templates, setTemplates] = useState(readTemplates);
  const [exportSize, setExportSize] = useState('whatsapp');
  const previewRef = useRef(null);

  const activeData = view === 'voucher' ? voucher : view === 'package' ? pkg : ticket;
  const setActiveData = view === 'voucher' ? setVoucher : view === 'package' ? setPkg : setTicket;
  const activeTitle = view === 'voucher' ? 'Hotel Rate Builder' : view === 'package' ? 'Umrah Package Builder' : view === 'ticket' ? 'Flight Ticket Builder' : 'Saved Templates';

  function persistTemplates(next) {
    setTemplates(next);
    localStorage.setItem('zg_templates', JSON.stringify(next));
  }

  function saveTemplate() {
    if (view === 'templates') return;
    persistTemplates([
      {
        id: crypto.randomUUID(),
        type: view,
        name: `${activeTitle} - ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        data: activeData,
      },
      ...templates,
    ]);
  }

  function loadTemplate(template) {
    if (template.type === 'voucher') setVoucher(template.data);
    if (template.type === 'package') setPkg(template.data);
    if (template.type === 'ticket') setTicket(template.data);
    setView(template.type);
  }

  function duplicateTemplate(template) {
    persistTemplates([{ ...template, id: crypto.randomUUID(), name: `${template.name} Copy`, createdAt: new Date().toISOString() }, ...templates]);
  }

  function deleteTemplate(id) {
    persistTemplates(templates.filter((template) => template.id !== id));
  }

  async function exportPreview(format = 'png') {
    if (!previewRef.current) return;
    const selectedSize = exportSizes[exportSize];
    const canvas = await html2canvas(previewRef.current, {
      width: previewRef.current.offsetWidth,
      height: previewRef.current.offsetHeight,
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    if (format === 'pdf') {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const image = canvas.toDataURL('image/png', 1);
      pdf.addImage(image, 'PNG', 0, 0, 210, 297);
      pdf.save(`${view}-zulfiqar-group.pdf`);
      return;
    }

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = selectedSize.width;
    outputCanvas.height = selectedSize.height;
    const context = outputCanvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, selectedSize.width, selectedSize.height);
    context.drawImage(canvas, 0, 0, selectedSize.width, selectedSize.height);
    const link = document.createElement('a');
    link.download = `${view}-${selectedSize.label.toLowerCase().replaceAll(' ', '-')}.png`;
    link.href = outputCanvas.toDataURL('image/png', 1);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Hero view={view} setView={setView} />
        <Dashboard view={view} setView={setView} />

        <div className="toolbar">
          <div>
            <p className="eyebrow">Live creator</p>
            <h1>{activeTitle}</h1>
          </div>
          <div className="toolbar-actions">
            <SelectField compact label="Design" value={activeData.style} onChange={(value) => setActiveData({ ...activeData, style: value })} options={designStyles} />
            <select value={exportSize} onChange={(event) => setExportSize(event.target.value)} aria-label="Export size">
              {Object.entries(exportSizes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            {view !== 'templates' && (
              <>
                <IconButton label="Save" onClick={saveTemplate} icon={<Save size={18} />} />
                <IconButton label="PNG" onClick={() => exportPreview('png')} icon={<ImageDown size={18} />} />
                <IconButton label="PDF" onClick={() => exportPreview('pdf')} icon={<Download size={18} />} />
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
              {view === 'voucher' && <VoucherForm data={voucher} setData={setVoucher} />}
              {view === 'package' && <PackageForm data={pkg} setData={setPkg} />}
              {view === 'ticket' && <TicketForm data={ticket} setData={setTicket} />}
            </div>
            <div className="preview-panel">
              <div className="preview-shell">
                <div className={`export-stage size-${exportSize}`}>
                  <div ref={previewRef} className="preview-document">
                    {view === 'voucher' && <VoucherPreview data={voucher} />}
                    {view === 'package' && <PackagePreview data={pkg} />}
                    {view === 'ticket' && <TicketPreview data={ticket} />}
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
        <span>Umrah creative studio</span>
      </div>
    </header>
  );
}

function Hero({ view, setView }) {
  return (
    <section className="hero-band">
      <div>
        <p className="eyebrow">Premium travel agency software</p>
        <h2>Zulfiqar Group</h2>
        <p>Create stylish Umrah flyers, rate sheets, and flight tickets with live preview and instant export.</p>
      </div>
      <div className="hero-actions">
        <button className={view === 'package' ? 'hero-tab active' : 'hero-tab'} onClick={() => setView('package')}><Sparkles size={18} />Package</button>
        <button className={view === 'voucher' ? 'hero-tab active' : 'hero-tab'} onClick={() => setView('voucher')}><Hotel size={18} />Rates</button>
        <button className={view === 'ticket' ? 'hero-tab active' : 'hero-tab'} onClick={() => setView('ticket')}><Plane size={18} />Ticket</button>
      </div>
    </section>
  );
}

function Dashboard({ view, setView }) {
  const cards = [
    { id: 'package', title: 'Umrah Package Builder', icon: <PackageOpen />, body: '3D flyer style with hotel, flights, seats, prices, and inclusions.' },
    { id: 'voucher', title: 'Hotel Rate Builder', icon: <Hotel />, body: 'Manual hotel rows, rate cards, flight schedule, and WhatsApp-ready layout.' },
    { id: 'ticket', title: 'Flight Ticket Builder', icon: <Plane />, body: 'Customer-friendly booking ticket image with route and baggage details.' },
    { id: 'templates', title: 'Saved Templates', icon: <Layers />, body: 'Save, load, duplicate, and delete your own designs.' },
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

function TextField({ label, value, onChange, type = 'text', wide = false, list }) {
  const id = list ? `${label.replace(/\W/g, '')}-list` : undefined;
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span>{label}</span>
      <input type={type} list={id} value={value || ''} onChange={(event) => onChange(event.target.value)} />
      {list && <datalist id={id}>{list.map((item) => <option key={item} value={item} />)}</datalist>}
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

function SelectField({ label, value, onChange, options, compact = false }) {
  return (
    <label className={compact ? 'select-compact' : 'field'}>
      {!compact && <span>{label}</span>}
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {Object.entries(options).map(([key, labelText]) => <option key={key} value={key}>{labelText}</option>)}
      </select>
    </label>
  );
}

function LogoUpload({ branding, onChange }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...branding, logo: reader.result });
    reader.readAsDataURL(file);
  }
  return (
    <>
      <label className="field wide">
        <span>Company Logo Upload</span>
        <input type="file" accept="image/*" onChange={handleFile} />
        {branding.logo && <img className={`logo-thumb logo-${branding.logoShape} fit-${branding.logoSize}`} src={branding.logo} alt="Uploaded logo preview" />}
      </label>
      <SelectField label="Logo Shape" value={branding.logoShape} onChange={(value) => onChange({ ...branding, logoShape: value })} options={{ rounded: 'Rounded Corner', circle: 'Circle', square: 'Square' }} />
      <SelectField label="Logo Fit" value={branding.logoSize} onChange={(value) => onChange({ ...branding, logoSize: value })} options={{ contain: 'Show Full Logo', cover: 'Fill Box', padded: 'Padded Premium' }} />
    </>
  );
}

function ImageUpload({ label, value, onChange, wide = true }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={handleFile} />
      {value && <img className="upload-thumb" src={value} alt={`${label} preview`} />}
    </label>
  );
}

function QRUpload({ branding, onChange }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...branding, qrCode: reader.result });
    reader.readAsDataURL(file);
  }
  return (
    <>
      <label className="field wide">
        <span>QR Code Upload</span>
        <input type="file" accept="image/*" onChange={handleFile} />
        {branding.qrCode && <img className="qr-thumb" src={branding.qrCode} alt="Uploaded QR preview" />}
      </label>
      <TextField label="QR Text" value={branding.qrText} onChange={(value) => onChange({ ...branding, qrText: value })} />
    </>
  );
}

function BrandingFields({ data, setData }) {
  const branding = data.branding;
  const update = (key, value) => setData({ ...data, branding: { ...branding, [key]: value } });
  return (
    <Section icon={<Building2 size={19} />} title="Branding">
      <LogoUpload branding={branding} onChange={(next) => setData({ ...data, branding: next })} />
      <QRUpload branding={branding} onChange={(next) => setData({ ...data, branding: next })} />
      <ImageUpload label="Voucher Background Picture" value={branding.backgroundImage} onChange={(value) => update('backgroundImage', value)} />
      <TextField label="Company Name" value={branding.name} onChange={(value) => update('name', value)} />
      <TextField label="Main Title" value={branding.title} onChange={(value) => update('title', value)} />
      <TextField label="Tagline" value={branding.tagline} onChange={(value) => update('tagline', value)} wide />
      <TextField label="WhatsApp" value={branding.whatsapp} onChange={(value) => update('whatsapp', value)} />
      <TextField label="Phone" value={branding.phone} onChange={(value) => update('phone', value)} />
      <TextField label="Website" value={branding.website} onChange={(value) => update('website', value)} />
      <TextField label="Office Address" value={branding.address} onChange={(value) => update('address', value)} wide />
    </Section>
  );
}

function VoucherForm({ data, setData }) {
  const setInfo = (key, value) => setData({ ...data, info: { ...data.info, [key]: value } });
  const setFlight = (key, value) => setData({ ...data, flights: { ...data.flights, [key]: value } });
  const setRow = (index, key, value) => {
    const rows = data.rows.map((row, i) => (i === index ? { ...row, [key]: value } : row));
    setData({ ...data, rows });
  };
  const addRow = () => setData({ ...data, rows: [...data.rows, { id: crypto.randomUUID(), nights: '', makkahName: '', makkahDistance: '', makkahImage: '', madinahName: '', madinahDistance: '', madinahImage: '', sharing: '', quad: '', triple: '', double: '' }] });
  return (
    <>
      <BrandingFields data={data} setData={setData} />
      <Section icon={<CalendarDays size={19} />} title="Voucher Details">
        <TextField label="Package Title" value={data.info.packageTitle} onChange={(value) => setInfo('packageTitle', value)} />
        <TextField label="Baggage" value={data.info.baggage} onChange={(value) => setInfo('baggage', value)} />
        <TextField label="Extra Note" value={data.info.extra} onChange={(value) => setInfo('extra', value)} wide />
        <TextField label="Travelling From" value={data.info.travellingFrom} onChange={(value) => setInfo('travellingFrom', value)} list={['Lahore', 'Islamabad', 'Karachi', 'Multan']} />
        <TextField type="date" label="Date" value={data.info.date} onChange={(value) => setInfo('date', value)} />
        <TextField type="date" label="Valid Until" value={data.info.validUntil} onChange={(value) => setInfo('validUntil', value)} />
      </Section>
      <Section icon={<Plane size={19} />} title="Flight Schedule">
        <ImageUpload label="Airline Logo Upload" value={data.flights.airlineLogo} onChange={(value) => setFlight('airlineLogo', value)} />
        <TextField label="Outbound Flight" value={data.flights.outbound} onChange={(value) => setFlight('outbound', value)} wide />
        <TextField label="Return Flight" value={data.flights.inbound} onChange={(value) => setFlight('inbound', value)} wide />
      </Section>
      <section className="form-section">
        <div className="section-title-row">
          <h2><Hotel size={19} />Hotel Rate Rows</h2>
          <button className="add-button" onClick={addRow}><Plus size={16} />Add Row</button>
        </div>
        {data.rows.map((row, index) => (
          <div className="rate-row-editor" key={row.id}>
            <TextField label="Nights" value={row.nights} onChange={(value) => setRow(index, 'nights', value)} />
            <TextField label="Makkah Hotel" value={row.makkahName} onChange={(value) => setRow(index, 'makkahName', value)} list={makkahHotels} />
            <TextField label="Makkah Distance" value={row.makkahDistance} onChange={(value) => setRow(index, 'makkahDistance', value)} />
            <ImageUpload label="Makkah Hotel Picture" value={row.makkahImage} onChange={(value) => setRow(index, 'makkahImage', value)} wide={false} />
            <TextField label="Madinah Hotel" value={row.madinahName} onChange={(value) => setRow(index, 'madinahName', value)} list={madinahHotels} />
            <TextField label="Madinah Distance" value={row.madinahDistance} onChange={(value) => setRow(index, 'madinahDistance', value)} />
            <ImageUpload label="Madinah Hotel Picture" value={row.madinahImage} onChange={(value) => setRow(index, 'madinahImage', value)} wide={false} />
            <TextField label="Sharing" value={row.sharing} onChange={(value) => setRow(index, 'sharing', value)} />
            <TextField label="Quad" value={row.quad} onChange={(value) => setRow(index, 'quad', value)} />
            <TextField label="Triple" value={row.triple} onChange={(value) => setRow(index, 'triple', value)} />
            <TextField label="Double" value={row.double} onChange={(value) => setRow(index, 'double', value)} />
            <button className="remove-button" onClick={() => setData({ ...data, rows: data.rows.filter((_, i) => i !== index) })} title="Remove row" aria-label="Remove row"><Trash2 size={16} /></button>
          </div>
        ))}
      </section>
    </>
  );
}

function PackageForm({ data, setData }) {
  const update = (group, key, value) => setData({ ...data, [group]: { ...data[group], [key]: value } });
  return (
    <>
      <BrandingFields data={data} setData={setData} />
      <Section icon={<PackageOpen size={19} />} title="Package Information">
        <TextField label="Package Name" value={data.info.packageName} onChange={(value) => update('info', 'packageName', value)} />
        <TextField label="Days" value={data.info.days} onChange={(value) => update('info', 'days', value)} />
        <TextField label="Available Seats" value={data.info.availableSeats} onChange={(value) => update('info', 'availableSeats', value)} />
        <TextField label="Travelling Date" value={data.info.travellingDate} onChange={(value) => update('info', 'travellingDate', value)} />
        <TextField label="Nights" value={data.info.nights} onChange={(value) => update('info', 'nights', value)} />
        <TextField label="Button Text" value={data.info.registerText} onChange={(value) => update('info', 'registerText', value)} />
      </Section>
      <Section icon={<Plane size={19} />} title="Flight Details">
        <ImageUpload label="Airline Logo Upload" value={data.flight.airlineLogo} onChange={(value) => update('flight', 'airlineLogo', value)} />
        <TextField label="Airline" value={data.flight.airline} onChange={(value) => update('flight', 'airline', value)} list={airlines} />
        <TextField label="Outbound Flight" value={data.flight.outFlight} onChange={(value) => update('flight', 'outFlight', value)} />
        <TextField label="Outbound Date" value={data.flight.outDate} onChange={(value) => update('flight', 'outDate', value)} />
        <TextField label="Outbound Route" value={data.flight.outRoute} onChange={(value) => update('flight', 'outRoute', value)} />
        <TextField label="Outbound Time" value={data.flight.outTime} onChange={(value) => update('flight', 'outTime', value)} />
        <TextField label="Return Flight" value={data.flight.inFlight} onChange={(value) => update('flight', 'inFlight', value)} />
        <TextField label="Return Date" value={data.flight.inDate} onChange={(value) => update('flight', 'inDate', value)} />
        <TextField label="Return Route" value={data.flight.inRoute} onChange={(value) => update('flight', 'inRoute', value)} />
        <TextField label="Return Time" value={data.flight.inTime} onChange={(value) => update('flight', 'inTime', value)} />
        <TextField label="Baggage" value={data.flight.baggage} onChange={(value) => update('flight', 'baggage', value)} />
        <label className="check-field"><input type="checkbox" checked={data.flight.meal} onChange={(event) => update('flight', 'meal', event.target.checked)} />Meal Included</label>
      </Section>
      <Section icon={<Hotel size={19} />} title="Hotels">
        <ImageUpload label="Makkah Hotel Picture" value={data.hotels.makkahImage} onChange={(value) => update('hotels', 'makkahImage', value)} />
        <TextField label="Makkah Hotel" value={data.hotels.makkahName} onChange={(value) => update('hotels', 'makkahName', value)} list={makkahHotels} />
        <TextField label="Makkah Distance" value={data.hotels.makkahDistance} onChange={(value) => update('hotels', 'makkahDistance', value)} />
        <ImageUpload label="Madinah Hotel Picture" value={data.hotels.madinahImage} onChange={(value) => update('hotels', 'madinahImage', value)} />
        <TextField label="Madinah Hotel" value={data.hotels.madinahName} onChange={(value) => update('hotels', 'madinahName', value)} list={madinahHotels} />
        <TextField label="Madinah Distance" value={data.hotels.madinahDistance} onChange={(value) => update('hotels', 'madinahDistance', value)} />
      </Section>
      <Section icon={<Users size={19} />} title="Prices">
        <TextField label="Currency" value={data.currency} onChange={(value) => setData({ ...data, currency: value })} list={['PKR', 'SAR', 'AED', 'USD']} />
        <TextField label="Sharing" value={data.prices.sharing} onChange={(value) => update('prices', 'sharing', value)} />
        <TextField label="Quad" value={data.prices.quad} onChange={(value) => update('prices', 'quad', value)} />
        <TextField label="Triple" value={data.prices.triple} onChange={(value) => update('prices', 'triple', value)} />
        <TextField label="Double" value={data.prices.double} onChange={(value) => update('prices', 'double', value)} />
      </Section>
      <Section icon={<CheckCircle2 size={19} />} title="Package Includes">
        {Object.entries({ visa: 'Umrah Visa', ticket: 'Return Air Ticket', hotel: 'Hotel Accommodation', transport: 'Ground Transportation', ziyarat: 'Ziyarat', support: '24/7 Support' }).map(([key, label]) => (
          <label className="check-field" key={key}><input type="checkbox" checked={data.transport[key]} onChange={(event) => update('transport', key, event.target.checked)} />{label}</label>
        ))}
      </Section>
    </>
  );
}

function TicketForm({ data, setData }) {
  const update = (group, key, value) => setData({ ...data, [group]: { ...data[group], [key]: value } });
  return (
    <>
      <BrandingFields data={data} setData={setData} />
      <Section icon={<Users size={19} />} title="Passenger & Booking">
        <TextField label="Passenger Name" value={data.passenger.name} onChange={(value) => update('passenger', 'name', value)} />
        <TextField label="Booking Reference" value={data.passenger.bookingRef} onChange={(value) => update('passenger', 'bookingRef', value)} />
        <TextField label="Ticket Number" value={data.passenger.ticketNo} onChange={(value) => update('passenger', 'ticketNo', value)} />
        <TextField label="Status" value={data.passenger.status} onChange={(value) => update('passenger', 'status', value)} list={['Confirmed', 'Pending', 'Issued', 'Cancelled']} />
      </Section>
      <Section icon={<Plane size={19} />} title="Flight Ticket Details">
        <ImageUpload label="Airline Logo Upload" value={data.flight.airlineLogo} onChange={(value) => update('flight', 'airlineLogo', value)} />
        <TextField label="Airline" value={data.flight.airline} onChange={(value) => update('flight', 'airline', value)} list={airlines} />
        <TextField label="Flight Number" value={data.flight.flightNumber} onChange={(value) => update('flight', 'flightNumber', value)} />
        <TextField label="Date" value={data.flight.date} onChange={(value) => update('flight', 'date', value)} />
        <TextField label="Route" value={data.flight.route} onChange={(value) => update('flight', 'route', value)} />
        <TextField label="From Airport" value={data.flight.from} onChange={(value) => update('flight', 'from', value)} list={airports} />
        <TextField label="To Airport" value={data.flight.to} onChange={(value) => update('flight', 'to', value)} list={airports} />
        <TextField label="Departure Time" value={data.flight.departure} onChange={(value) => update('flight', 'departure', value)} />
        <TextField label="Arrival Time" value={data.flight.arrival} onChange={(value) => update('flight', 'arrival', value)} />
        <TextField label="Baggage" value={data.flight.baggage} onChange={(value) => update('flight', 'baggage', value)} />
        <TextField label="Terminal" value={data.flight.terminal} onChange={(value) => update('flight', 'terminal', value)} />
        <label className="check-field"><input type="checkbox" checked={data.flight.meal} onChange={(event) => update('flight', 'meal', event.target.checked)} />Meal Included</label>
      </Section>
      <Section icon={<FileText size={19} />} title="Customer Note">
        <TextField label="Phone" value={data.contact.phone} onChange={(value) => update('contact', 'phone', value)} />
        <TextField label="WhatsApp" value={data.contact.whatsapp} onChange={(value) => update('contact', 'whatsapp', value)} />
        <TextArea label="Note" value={data.contact.note} onChange={(value) => update('contact', 'note', value)} />
      </Section>
    </>
  );
}

function PreviewLogo({ branding, large = false }) {
  return (
    <div className={`preview-logo logo-${branding.logoShape} fit-${branding.logoSize} ${large ? 'large' : ''}`}>
      {branding.logo ? <img src={branding.logo} alt="" /> : <span>Z</span>}
    </div>
  );
}

function QRBlock({ branding }) {
  return (
    <div className="qr-wrap">
      <div className="qr-placeholder">
        {branding.qrCode ? <img src={branding.qrCode} alt="" /> : <QrCode size={34} />}
      </div>
      <span>{branding.qrText || 'Scan to book'}</span>
    </div>
  );
}

function BrochureBackground({ branding }) {
  if (!branding?.backgroundImage) return null;
  return <img className="brochure-bg-image" src={branding.backgroundImage} alt="" />;
}

function AirlineLogo({ logo, airline }) {
  return (
    <div className="airline-logo-box">
      {logo ? <img src={logo} alt="" /> : <Plane size={26} />}
      <span>{airline || 'Airline'}</span>
    </div>
  );
}

function HotelPhoto({ image, label }) {
  return (
    <div className="hotel-photo">
      {image ? <img src={image} alt="" /> : <Hotel size={28} />}
      <span>{label}</span>
    </div>
  );
}

function PackagePreview({ data }) {
  const includes = Object.entries(data.transport).filter(([, value]) => value).map(([key]) => ({
    visa: 'Umrah Visa',
    ticket: `${data.flight.airline} Return Air Ticket`,
    hotel: 'Hotel Accommodation',
    transport: 'Ground Transportation',
    ziyarat: 'Ziyarat',
    support: '24/7 Customer Support',
  }[key]));
  return (
    <article className={`brochure brochure-${data.style}`}>
      <BrochureBackground branding={data.branding} />
      <div className="package-top">
        <aside className="brand-slab">
          <PreviewLogo branding={data.branding} large />
          <h2>{data.branding.name}</h2>
          <p>{data.branding.tagline}</p>
        </aside>
        <section className="package-main-title">
          <div className="gold-pill"><Plane size={18} />Umrah Package</div>
          <AirlineLogo logo={data.flight.airlineLogo} airline={data.flight.airline} />
          <h1>{data.info.packageName}</h1>
          <p>{data.flight.outFlight} {data.flight.outDate} {data.flight.outRoute} {data.flight.outTime}</p>
          <p>{data.flight.inFlight} {data.flight.inDate} {data.flight.inRoute} {data.flight.inTime}</p>
        </section>
        <section className="stats-panel">
          <div><Users /><strong>{data.info.availableSeats}</strong><span>Seats</span></div>
          <div><CalendarDays /><strong>{data.info.travellingDate}</strong><span>{data.info.nights}</span></div>
        </section>
      </div>

      <div className="hotel-duo">
        <InfoCard image={data.hotels.makkahImage} icon={<Hotel />} title="Makkah Hotel" main={data.hotels.makkahName} sub={data.hotels.makkahDistance} />
        <InfoCard image={data.hotels.madinahImage} icon={<MapPin />} title="Madinah Hotel" main={data.hotels.madinahName} sub={data.hotels.madinahDistance} />
      </div>

      <div className="price-board">
        {Object.entries(data.prices).map(([label, value]) => (
          <div className="price-tile" key={label}>
            <Users />
            <span>{label}</span>
            <strong><small>{data.currency}</small>{value || 'TBA'}</strong>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <section className="glass-panel">
          <h3>Package Includes</h3>
          <ul>{includes.map((item) => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul>
        </section>
        <section className="glass-panel">
          <h3>Booking Contact</h3>
          <p>{data.branding.address}</p>
          <strong>{data.branding.whatsapp}</strong>
          <strong>{data.branding.phone}</strong>
          <QRBlock branding={data.branding} />
        </section>
      </div>
      <footer className="poster-footer">{data.info.registerText}</footer>
    </article>
  );
}

function VoucherPreview({ data }) {
  return (
    <article className={`brochure brochure-${data.style} rate-sheet`}>
      <BrochureBackground branding={data.branding} />
      <header className="rate-header">
        <PreviewLogo branding={data.branding} large />
        <div>
          <h1>{data.info.packageTitle}</h1>
          <p>{data.info.baggage}</p>
          <strong>{data.info.extra}</strong>
        </div>
        <div className="contact-box">
          <span>Booking Contact</span>
          <strong>{data.branding.whatsapp}</strong>
        </div>
      </header>
      <div className="rate-meta">
        <span>Travelling from {data.info.travellingFrom}</span>
        <span>Updated rates</span>
        <span>Date: {data.info.date}</span>
      </div>
      <div className="rate-list">
        {data.rows.map((row, index) => (
          <section className="rate-item" key={row.id}>
            <div className="night-badge">{row.nights || index + 1}</div>
            <div className="hotel-pair">
              <div><span>Makkah Hotel</span><HotelPhoto image={row.makkahImage} label="Makkah" /><strong>{row.makkahName || 'Makkah Hotel'}</strong><p>{row.makkahDistance}</p></div>
              <div><span>Flight Schedule</span><AirlineLogo logo={data.flights.airlineLogo} airline="Flight" /><p>{data.flights.outbound}</p><p>{data.flights.inbound}</p></div>
              <div><span>Madinah Hotel</span><HotelPhoto image={row.madinahImage} label="Madinah" /><strong>{row.madinahName || 'Madinah Hotel'}</strong><p>{row.madinahDistance}</p></div>
            </div>
            <div className="rate-prices">
              {['sharing', 'quad', 'triple', 'double'].map((key) => <div key={key}><span>{key}</span><strong>{row[key] || '-'}</strong></div>)}
            </div>
          </section>
        ))}
      </div>
      <footer className="preview-footer"><div><strong>{data.branding.name}</strong><p>{data.branding.address}</p></div><QRBlock branding={data.branding} /></footer>
    </article>
  );
}

function TicketPreview({ data }) {
  return (
    <article className={`brochure brochure-${data.style} ticket-preview`}>
      <BrochureBackground branding={data.branding} />
      <header className="ticket-head">
        <div>
          <PreviewLogo branding={data.branding} />
          <h1>Flight Booking Ticket</h1>
          <p>{data.branding.name}</p>
        </div>
        <div className="ticket-status">{data.passenger.status}</div>
      </header>
      <AirlineLogo logo={data.flight.airlineLogo} airline={data.flight.airline} />
      <section className="route-board">
        <div><span>From</span><strong>{data.flight.from}</strong><small>{data.flight.departure}</small></div>
        <Plane size={40} />
        <div><span>To</span><strong>{data.flight.to}</strong><small>{data.flight.arrival}</small></div>
      </section>
      <section className="ticket-grid">
        <InfoLine label="Passenger" value={data.passenger.name} />
        <InfoLine label="Booking Ref" value={data.passenger.bookingRef} />
        <InfoLine label="Ticket No" value={data.passenger.ticketNo} />
        <InfoLine label="Airline" value={data.flight.airline} />
        <InfoLine label="Flight" value={data.flight.flightNumber} />
        <InfoLine label="Date" value={data.flight.date} />
        <InfoLine label="Route" value={data.flight.route} />
        <InfoLine label="Baggage" value={data.flight.baggage} />
        <InfoLine label="Terminal" value={data.flight.terminal} />
        <InfoLine label="Meal" value={data.flight.meal ? 'Included' : 'Not included'} />
      </section>
      <footer className="ticket-note">
        <p>{data.contact.note}</p>
        <strong>Call {data.contact.phone} | WhatsApp {data.contact.whatsapp}</strong>
        <QRBlock branding={data.branding} />
      </footer>
    </article>
  );
}

function InfoCard({ icon, image, title, main, sub }) {
  return <div className="info-card">{image ? <HotelPhoto image={image} label={title} /> : icon}<div><span>{title}</span><strong>{main}</strong><p>{sub}</p></div></div>;
}

function InfoLine({ label, value }) {
  return <div className="info-line"><span>{label}</span><strong>{value || 'TBA'}</strong></div>;
}

function Templates({ templates, loadTemplate, duplicateTemplate, deleteTemplate }) {
  return (
    <section className="templates-view">
      {templates.length === 0 ? (
        <div className="empty-state">
          <Layers size={42} />
          <h2>No saved templates yet</h2>
          <p>Save a design to reuse it later.</p>
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
