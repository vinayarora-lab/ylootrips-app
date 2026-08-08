'use client';
import { useState, useEffect } from 'react';

const SECTIONS = ['banners', 'quick_actions', 'features', 'trending', 'deals', 'promos', 'categories', 'stats', 'nav', 'popup', 'settings'] as const;
type Section = typeof SECTIONS[number];

export default function AppConfigAdmin() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [section, setSection] = useState<Section>('banners');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/mobile/config')
      .then(r => r.json())
      .then(setConfig);
  }, []);

  async function save() {
    if (!config) return;
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/mobile/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setMsg(res.ok ? '✅ Saved! App will pick up changes within 5 minutes.' : '❌ Save failed — check your secret.');
  }

  function update(key: string, value: unknown) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-6">App Content Admin</h1>
          <p className="text-sm text-gray-500 mb-4">Enter your ADMIN_SECRET to continue</p>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            onKeyDown={e => e.key === 'Enter' && setAuthed(true)}
          />
          <button
            onClick={() => setAuthed(true)}
            className="w-full bg-green-700 text-white rounded-lg py-2 text-sm font-semibold"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return <div className="p-8 text-gray-500">Loading config…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📱 App Content Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Changes go live in the app within 5 minutes — no Play Store update needed.</p>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm">{msg}</span>}
            <button
              onClick={save}
              disabled={saving}
              className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving…' : '💾 Save & Publish'}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-44 flex-shrink-0">
            <nav className="space-y-1">
              {SECTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                    section === s ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s === 'settings' ? '⚙️ Settings' :
                   s === 'banners' ? '🖼️ Banners' :
                   s === 'trending' ? '🔥 Trending' :
                   s === 'deals' ? '🏷️ Deals' :
                   s === 'promos' ? '🎁 Promos' :
                   s === 'categories' ? '📂 Categories' :
                   s === 'quick_actions' ? '⚡ Quick Actions' :
                   s === 'features' ? '🚩 Feature Flags' :
                   s === 'nav' ? '🧭 Nav Labels' :
                   s === 'popup' ? '💬 Popup' : s}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow p-6">
            {section === 'banners' && <BannersEditor config={config} update={update} />}
            {section === 'trending' && <ListEditor title="Trending Destinations" configKey="trending" fields={['name','country','image','price','duration']} config={config} update={update} />}
            {section === 'deals' && <ListEditor title="Flash Deals" configKey="deals" fields={['title','subtitle','image','originalPrice','salePrice','discount','seats','category','badge','whatsappMsg']} config={config} update={update} />}
            {section === 'promos' && <ListEditor title="Promo Codes" configKey="promos" fields={['emoji','code','title','sub']} config={config} update={update} />}
            {section === 'categories' && <ListEditor title="Browse Categories" configKey="categories" fields={['emoji','label','id']} config={config} update={update} />}
            {section === 'stats' && <StatsEditor config={config} update={update} />}
            {section === 'quick_actions' && <QuickActionsEditor config={config} update={update} />}
            {section === 'features' && <FeatureFlagsEditor config={config} update={update} />}
            {section === 'nav' && <NavLabelsEditor config={config} update={update} />}
            {section === 'popup' && <PopupEditor config={config} update={update} />}
            {section === 'settings' && <SettingsEditor config={config} update={update} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Banners editor ────────────────────────────────────────────────────────────
function BannersEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const banners = (config.banners as string[]) ?? [];
  const labels = (config.bannerLabels as string[]) ?? [];

  function setUrl(i: number, v: string) {
    const n = [...banners]; n[i] = v; update('banners', n);
  }
  function setLabel(i: number, v: string) {
    const n = [...labels]; n[i] = v; update('bannerLabels', n);
  }
  function add() {
    update('banners', [...banners, '']);
    update('bannerLabels', [...labels, '']);
  }
  function remove(i: number) {
    update('banners', banners.filter((_, j) => j !== i));
    update('bannerLabels', labels.filter((_, j) => j !== i));
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">🖼️ Hero Banners</h2>
      <p className="text-xs text-gray-500 mb-4">These images appear in the home screen banner carousel. Use full image URLs (Unsplash, Cloudinary, etc.).</p>
      <div className="space-y-4">
        {banners.map((url, i) => (
          <div key={i} className="border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">Slide {i + 1}</span>
              <button onClick={() => remove(i)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
            </div>
            {url && <img src={url} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />}
            <input
              value={url} onChange={e => setUrl(i, e.target.value)}
              placeholder="Image URL (https://...)"
              className="w-full border rounded-lg px-3 py-1.5 text-xs mb-2"
            />
            <input
              value={labels[i] ?? ''} onChange={e => setLabel(i, e.target.value)}
              placeholder="Label (e.g. Taj Mahal, Agra)"
              className="w-full border rounded-lg px-3 py-1.5 text-xs"
            />
          </div>
        ))}
        <button onClick={add} className="text-sm text-green-700 font-semibold hover:underline">+ Add banner</button>
      </div>
    </div>
  );
}

// ── Generic list editor ───────────────────────────────────────────────────────
function ListEditor({ title, configKey, fields, config, update }: {
  title: string; configKey: string; fields: string[];
  config: Record<string, unknown>; update: (k: string, v: unknown) => void;
}) {
  const items = (config[configKey] as Record<string, unknown>[]) ?? [];

  function setField(i: number, field: string, v: unknown) {
    const n = items.map((item, j) => j === i ? { ...item, [field]: v } : item);
    update(configKey, n);
  }
  function add() {
    update(configKey, [...items, Object.fromEntries(fields.map(f => [f, '']))]);
  }
  function remove(i: number) {
    update(configKey, items.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const n = [...items];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    update(configKey, n);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">#{i + 1}</span>
              <button onClick={() => move(i, -1)} className="text-xs text-gray-400 hover:text-gray-700">↑</button>
              <button onClick={() => move(i, 1)} className="text-xs text-gray-400 hover:text-gray-700">↓</button>
              <button onClick={() => remove(i)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
            </div>
            {typeof item.image === 'string' && item.image && <img src={item.image} alt="" className="w-full h-28 object-cover rounded-lg mb-3" />}
            <div className="grid grid-cols-2 gap-2">
              {fields.map(f => (
                <div key={f} className={f === 'image' || f === 'whatsappMsg' || f === 'subtitle' ? 'col-span-2' : ''}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{f}</label>
                  {f === 'seats' ? (
                    <input
                      type="number"
                      value={item[f] as number ?? 0}
                      onChange={e => setField(i, f, parseInt(e.target.value))}
                      className="w-full border rounded-lg px-3 py-1.5 text-xs"
                    />
                  ) : (
                    <input
                      value={item[f] as string ?? ''}
                      onChange={e => setField(i, f, e.target.value)}
                      placeholder={f}
                      className="w-full border rounded-lg px-3 py-1.5 text-xs"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={add} className="text-sm text-green-700 font-semibold hover:underline">+ Add item</button>
      </div>
    </div>
  );
}

// ── Stats editor ──────────────────────────────────────────────────────────────
function StatsEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const stats = (config.stats as Record<string, string>) ?? {};
  function set(k: string, v: string) { update('stats', { ...stats, [k]: v }); }
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Stats Bar</h2>
      <p className="text-xs text-gray-500 mb-4">Displayed as the 4-number trust strip below the hero banner.</p>
      <div className="grid grid-cols-2 gap-4">
        {[['travellers','Happy Travellers (e.g. 25,000+)'],['rating','Google Rating (e.g. 4.9★)'],['destinations','Destinations (e.g. 150+)'],['since','Est. Year (e.g. 2022)']].map(([k, label]) => (
          <div key={k}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input value={stats[k] ?? ''} onChange={e => set(k, e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quick Actions editor ───────────────────────────────────────────────────────
function QuickActionsEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const actions = (config.quickActions as Record<string, string>[]) ?? [];

  function setField(i: number, field: string, v: string) {
    const n = actions.map((a, j) => j === i ? { ...a, [field]: v } : a);
    update('quickActions', n);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">⚡ Quick Actions Grid</h2>
      <p className="text-xs text-gray-500 mb-4">The 8-icon grid on the home screen. Icon names use Material Icons (e.g. flight, hotel, beach_access, directions_bus, directions_car, flight_land, auto_awesome, local_offer).</p>
      <div className="space-y-3">
        {actions.map((action, i) => (
          <div key={i} className="border rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 mb-2 block">Action {i + 1}</span>
            <div className="grid grid-cols-2 gap-2">
              {['icon', 'label', 'route'].map(f => (
                <div key={f} className={f === 'route' ? 'col-span-2' : ''}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{f}</label>
                  <input
                    value={action[f] ?? ''}
                    onChange={e => setField(i, f, e.target.value)}
                    placeholder={f}
                    className="w-full border rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color (hex)</label>
                <div className="flex gap-2">
                  <input
                    value={action.color ?? '#006CE4'}
                    onChange={e => setField(i, 'color', e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                  <input
                    type="color"
                    value={action.color ?? '#006CE4'}
                    onChange={e => setField(i, 'color', e.target.value)}
                    className="h-8 w-10 border rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature Flags editor ───────────────────────────────────────────────────────
const FLAG_LABELS: Record<string, string> = {
  tabFlights:   'Search tab: Flights',
  tabHotels:    'Search tab: Hotels',
  tabHolidays:  'Search tab: Holidays',
  tabAIPlanner: 'Search tab: AI Planner',
  showFlights:  'Show Flights quick action',
  showHotels:   'Show Hotels quick action',
  showVisa:     'Show Visa Guide',
  showWishlist: 'Show Wishlist',
  showReviews:  'Show Reviews screen',
  showBlogs:    'Show Blogs screen',
  showCashback: 'Show Cashback / WanderLoot',
};

function FeatureFlagsEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const flags = (config.featureFlags as Record<string, boolean>) ?? {};

  function toggle(key: string, val: boolean) {
    update('featureFlags', { ...flags, [key]: val });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">🚩 Feature Flags</h2>
      <p className="text-xs text-gray-500 mb-4">Toggle features ON or OFF instantly — no app update needed. Disabled features are hidden from users.</p>
      <div className="space-y-3">
        {Object.entries(FLAG_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 font-mono">{key}</p>
            </div>
            <button
              onClick={() => toggle(key, !(flags[key] ?? true))}
              className={`relative w-12 h-6 rounded-full transition-colors ${(flags[key] ?? true) ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${(flags[key] ?? true) ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Nav Labels editor ──────────────────────────────────────────────────────────
function NavLabelsEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const NAV_FIELDS = [
    { key: 'navHomeLabel',    default: 'Home',     desc: 'Bottom nav — Home tab' },
    { key: 'navTripsLabel',   default: 'My Trips', desc: 'Bottom nav — My Trips tab' },
    { key: 'navOffersLabel',  default: 'Offers',   desc: 'Bottom nav — centre Offers button' },
    { key: 'navPlannerLabel', default: 'AI Plan',  desc: 'Bottom nav — AI Planner tab' },
    { key: 'navProfileLabel', default: 'Profile',  desc: 'Bottom nav — Profile tab' },
  ];
  const HERO_FIELDS = [
    { key: 'heroTitle', default: 'Find Your Perfect\nHoliday', desc: 'Hero card main title (use \\n for line break)' },
    { key: 'heroPill1', default: '25,000+ Trips',      desc: 'Hero pill 1' },
    { key: 'heroPill2', default: '4.9★ Rated',          desc: 'Hero pill 2' },
    { key: 'heroPill3', default: '150+ Destinations',   desc: 'Hero pill 3' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">🧭 Nav Labels & Hero Text</h2>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Bottom Navigation Labels</h3>
      <div className="space-y-3 mb-6">
        {NAV_FIELDS.map(({ key, default: def, desc }) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{desc}</label>
            <input
              value={(config[key] as string) ?? def}
              onChange={e => update(key, e.target.value)}
              placeholder={def}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
      <hr className="mb-6" />
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Hero Card Text</h3>
      <div className="space-y-3">
        {HERO_FIELDS.map(({ key, default: def, desc }) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{desc}</label>
            <input
              value={(config[key] as string) ?? def}
              onChange={e => update(key, e.target.value)}
              placeholder={def}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Popup editor ───────────────────────────────────────────────────────────────
function PopupEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const hasPopup = !!(config.popupTitle as string);
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">💬 App Popup / Modal</h2>
      <p className="text-xs text-gray-500 mb-4">
        Shows a modal on app launch when Title + Message are set. Leave Title empty to hide the popup.
        {hasPopup && <span className="ml-1 text-green-600 font-semibold">● Currently active</span>}
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Popup Title (leave empty to disable)</label>
          <input value={(config.popupTitle as string) ?? ''} onChange={e => update('popupTitle', e.target.value)}
            placeholder="e.g. 🎉 Monsoon Sale is Live!"
            className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Message</label>
          <textarea value={(config.popupMessage as string) ?? ''} onChange={e => update('popupMessage', e.target.value)}
            placeholder="e.g. Book any trip this week and get ₹5,000 off + free airport transfers."
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">CTA Button Text</label>
          <input value={(config.popupCta as string) ?? ''} onChange={e => update('popupCta', e.target.value)}
            placeholder="e.g. Explore Deals"
            className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">CTA Route (in-app route, e.g. /offers)</label>
          <input value={(config.popupRoute as string) ?? ''} onChange={e => update('popupRoute', e.target.value)}
            placeholder="e.g. /offers"
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
        </div>
        {hasPopup && (
          <button
            onClick={() => { update('popupTitle', ''); update('popupMessage', ''); update('popupCta', ''); update('popupRoute', ''); }}
            className="text-sm text-red-500 hover:underline"
          >
            Clear popup (disable it)
          </button>
        )}
      </div>
    </div>
  );
}

// ── Settings editor ───────────────────────────────────────────────────────────
function SettingsEditor({ config, update }: { config: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">⚙️ App Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Announcement Banner (leave empty to hide)</label>
          <input value={(config.announcement as string) ?? ''} onChange={e => update('announcement', e.target.value)}
            placeholder="e.g. 🎉 Summer Sale — 30% off all bookings!"
            className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Announcement Background Color (hex)</label>
          <div className="flex gap-2">
            <input value={(config.announcementColor as string) ?? '#DC2626'} onChange={e => update('announcementColor', e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono" />
            <input type="color" value={(config.announcementColor as string) ?? '#DC2626'}
              onChange={e => update('announcementColor', e.target.value)}
              className="h-10 w-12 border rounded-lg cursor-pointer" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Flash Sale Banner Text</label>
          <input value={(config.flashSaleText as string) ?? ''} onChange={e => update('flashSaleText', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="showFlashSale" checked={(config.showFlashSale as boolean) ?? true}
            onChange={e => update('showFlashSale', e.target.checked)} className="w-4 h-4" />
          <label htmlFor="showFlashSale" className="text-sm text-gray-700">Show Flash Sale banner on home screen</label>
        </div>
        <hr />
        <div>
          <label className="block text-xs text-gray-500 mb-1">WhatsApp Number</label>
          <input value={(config.whatsappNumber as string) ?? ''} onChange={e => update('whatsappNumber', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Contact Email</label>
          <input value={(config.contactEmail as string) ?? ''} onChange={e => update('contactEmail', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
          <input value={(config.phone as string) ?? ''} onChange={e => update('phone', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
        </div>
      </div>
    </div>
  );
}
