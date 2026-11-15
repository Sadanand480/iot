import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Blocks,
  Bot, Check, CheckCircle2, ChevronDown, CircleHelp, Cloud, Code2,
  Command, Compass, CreditCard, Database, ExternalLink, Filter, Gauge,
  Globe2, LayoutDashboard, Layers3, LifeBuoy, LogOut, Menu, MoreHorizontal,
  Plus, Search, Settings2, ShieldCheck, Sparkles, Terminal, TrendingUp,
  Users, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";

const initialServices = [
  { id: "svc-01", name: "Weather Intelligence", publisher: "Atmos Labs", category: "Data & Analytics", description: "Hyperlocal forecasts and weather signals for smarter, real-time decisions.", endpoint: "https://api.atmos.example/v1", color: "blue", icon: "globe", status: "Operational", usage: "18.4k", rating: "4.9", tags: ["REST API", "Real-time"], created: "2 days ago" },
  { id: "svc-02", name: "Demand Forecast AI", publisher: "Northstar AI", category: "AI & Machine Learning", description: "Predict demand patterns with a flexible forecasting engine built for scale.", endpoint: "https://api.northstar.example/v2", color: "violet", icon: "bot", status: "Operational", usage: "12.8k", rating: "4.8", tags: ["Machine learning", "Analytics"], created: "4 days ago" },
  { id: "svc-03", name: "SecurePay Gateway", publisher: "Moneta Systems", category: "Finance", description: "A developer-first payment interface with built-in risk signals and webhooks.", endpoint: "https://api.moneta.example/payments", color: "green", icon: "shield", status: "Operational", usage: "9.2k", rating: "4.7", tags: ["Payments", "Secure"], created: "1 week ago" },
  { id: "svc-04", name: "Vision Object Detect", publisher: "PixelForge", category: "AI & Machine Learning", description: "Fast image analysis endpoints for object detection and visual automation.", endpoint: "https://api.pixelforge.example/vision", color: "orange", icon: "layers", status: "Operational", usage: "7.6k", rating: "4.9", tags: ["Computer vision", "API"], created: "1 week ago" },
  { id: "svc-05", name: "NotifyFlow", publisher: "Connectly", category: "Communication", description: "Send transactional notifications across email and application channels.", endpoint: "https://api.connectly.example/notify", color: "pink", icon: "zap", status: "Degraded", usage: "5.1k", rating: "4.6", tags: ["Messaging", "Webhooks"], created: "2 weeks ago" },
  { id: "svc-06", name: "Retail Data Stream", publisher: "DataNest", category: "Data & Analytics", description: "A unified stream of retail signals for dashboards and data pipelines.", endpoint: "https://api.datanest.example/stream", color: "cyan", icon: "database", status: "Operational", usage: "4.3k", rating: "4.8", tags: ["Data", "Streaming"], created: "2 weeks ago" }
];

const activitySeed = [
  { text: "Weather Intelligence", action: "subscription renewed", time: "2 min ago", icon: "check" },
  { text: "Demand Forecast AI", action: "new version published", time: "18 min ago", icon: "spark" },
  { text: "SecurePay Gateway", action: "health check passed", time: "42 min ago", icon: "shield" },
  { text: "Vision Object Detect", action: "subscription created", time: "1 hr ago", icon: "plus" }
];

const usageData = [
  { day: "Mon", calls: 2800 }, { day: "Tue", calls: 3600 }, { day: "Wed", calls: 3100 },
  { day: "Thu", calls: 4800 }, { day: "Fri", calls: 4300 }, { day: "Sat", calls: 5600 }, { day: "Sun", calls: 6900 }
];

const categoryData = [
  { name: "AI / ML", value: 38, fill: "#8b7cff" },
  { name: "Data", value: 27, fill: "#54d6bd" },
  { name: "Finance", value: 19, fill: "#f4b96a" },
  { name: "Other", value: 16, fill: "#5ba8ff" }
];

const pageMeta = {
  Overview: { eyebrow: "WORKSPACE OVERVIEW", title: "Your cloud, in focus.", subtitle: "A clear view of your services, usage, and integrations." },
  "Explore services": { eyebrow: "SERVICE CATALOG", title: "Find your next building block.", subtitle: "Discover APIs and integrations built by the community." },
  "My subscriptions": { eyebrow: "YOUR INTEGRATIONS", title: "Everything connected.", subtitle: "Manage the services your applications depend on." },
  "My services": { eyebrow: "PUBLISHER STUDIO", title: "Build once. Reach everyone.", subtitle: "Publish and manage the services you share with the ecosystem." },
  Analytics: { eyebrow: "USAGE INTELLIGENCE", title: "Signals behind the scenes.", subtitle: "Understand service activity and the health of your workspace." },
  Settings: { eyebrow: "WORKSPACE PREFERENCES", title: "Make it yours.", subtitle: "Manage your profile and workspace preferences." }
};

function load(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function ServiceIcon({ type = "globe", size = 21 }) {
  const props = { size, strokeWidth: 1.8 };
  const map = {
    globe: <Globe2 {...props} />, bot: <Bot {...props} />, shield: <ShieldCheck {...props} />,
    layers: <Layers3 {...props} />, zap: <Zap {...props} />, database: <Database {...props} />,
    code: <Code2 {...props} />, cloud: <Cloud {...props} />
  };
  return map[type] || <Blocks {...props} />;
}

function StatCard({ label, value, change, sub, icon: Icon, tint }) {
  return (
    <motion.div className="stat-card" whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <div className="stat-top"><span className="stat-label">{label}</span><span className={`stat-icon ${tint}`}><Icon size={18}/></span></div>
      <div className="stat-value-row"><strong>{value}</strong><span className="stat-change"><ArrowUpRight size={13}/>{change}</span></div>
      <div className="stat-sub">{sub}</div>
    </motion.div>
  );
}

function ServiceCard({ service, isSubscribed, onToggle, onDetails, compact = false }) {
  return (
    <motion.article className={`service-card ${compact ? "compact" : ""}`} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <div className="service-card-head">
        <div className={`service-art ${service.color}`}><ServiceIcon type={service.icon} size={23}/></div>
        <button className="icon-button subtle" aria-label="More options" onClick={() => onDetails(service)}><MoreHorizontal size={19}/></button>
      </div>
      <div className="service-title-row">
        <h3>{service.name}</h3>
        <span className={`status-dot ${service.status === "Degraded" ? "warn" : ""}`} title={service.status}/>
      </div>
      <div className="publisher-line"><span className="publisher-avatar">{service.publisher.slice(0, 1)}</span> by {service.publisher}<span className="verified"><Check size={10}/></span></div>
      <p className="service-description">{service.description}</p>
      <div className="tag-row">{service.tags.slice(0, 2).map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
      {!compact && <div className="service-metrics"><span><Activity size={14}/>{service.usage} calls</span><span><span className="star">★</span>{service.rating}</span></div>}
      <div className="service-card-footer">
        <button className={`btn ${isSubscribed ? "btn-subscribed" : "btn-primary"} btn-small`} onClick={() => onToggle(service.id)}>
          {isSubscribed ? <><CheckCircle2 size={15}/> Subscribed</> : <><Plus size={15}/> Subscribe</>}
        </button>
        <button className="text-action" onClick={() => onDetails(service)}>View details <ArrowRight size={14}/></button>
      </div>
    </motion.article>
  );
}

function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    const close = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <motion.div className={`modal ${wide ? "modal-wide" : ""}`} initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .18 }}>
      {children}
    </motion.div>
  </div>;
}

function PublishModal({ onClose, onPublish }) {
  const [form, setForm] = useState({ name: "", publisher: "Your Workspace", category: "AI & Machine Learning", description: "", endpoint: "", icon: "code" });
  const [error, setError] = useState("");
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.publisher.trim() || !form.description.trim()) {
      setError("Please fill in the service name, publisher, and description."); return;
    }
    if (form.endpoint && !/^https?:\/\//i.test(form.endpoint)) {
      setError("Endpoint should start with https:// or http://."); return;
    }
    onPublish({ ...form, id: `svc-${Date.now()}`, name: form.name.trim(), publisher: form.publisher.trim(), description: form.description.trim(), color: ["blue","violet","green","orange","pink","cyan"][Math.floor(Math.random()*6)], status: "Operational", usage: "0", rating: "New", tags: ["New service", "REST API"], created: "Just now" });
  }
  return <Modal onClose={onClose} wide>
    <div className="modal-heading"><div><span className="eyebrow">PUBLISHER STUDIO</span><h2>Publish a service</h2><p>Make your service discoverable to connected applications.</p></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div>
    <form className="publish-form" onSubmit={submit}>
      <label>Service name <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Crop Health Prediction API" autoFocus/></label>
      <div className="form-two">
        <label>Publisher / organization <input value={form.publisher} onChange={e => update("publisher", e.target.value)} placeholder="Your organization"/></label>
        <label>Category <select value={form.category} onChange={e => update("category", e.target.value)}><option>AI & Machine Learning</option><option>Data & Analytics</option><option>Finance</option><option>Communication</option><option>Agriculture</option><option>Weather</option><option>Other</option></select></label>
      </div>
      <label>Description <textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Explain what the service does and who it's for." rows={3}/></label>
      <label>API endpoint <span className="optional">Optional</span><input value={form.endpoint} onChange={e => update("endpoint", e.target.value)} placeholder="https://api.yourdomain.com/v1"/></label>
      {error && <div className="form-error">{error}</div>}
      <div className="form-footer"><span className="form-hint"><ShieldCheck size={15}/> You can update details after publishing.</span><div className="button-group"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" type="submit"><Cloud size={16}/> Publish service</button></div></div>
    </form>
  </Modal>;
}

function DetailModal({ service, isSubscribed, onToggle, onClose }) {
  return <Modal onClose={onClose}>
    <div className="detail-top"><div className={`service-art large ${service.color}`}><ServiceIcon type={service.icon} size={28}/></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div>
    <span className="eyebrow">{service.category}</span><h2 className="detail-title">{service.name}</h2>
    <div className="publisher-line"><span className="publisher-avatar">{service.publisher.slice(0, 1)}</span> Published by {service.publisher}<span className="verified"><Check size={10}/></span></div>
    <p className="detail-description">{service.description}</p>
    <div className="detail-stats"><div><span>Availability</span><strong className="availability"><i/> {service.status}</strong></div><div><span>Monthly calls</span><strong>{service.usage}</strong></div><div><span>Rating</span><strong>★ {service.rating}</strong></div></div>
    <div className="endpoint-label">API ENDPOINT</div><div className="endpoint-box"><code>{service.endpoint || "No endpoint provided"}</code><button className="icon-button" title="Copy endpoint" onClick={() => service.endpoint && navigator.clipboard?.writeText(service.endpoint)}><Code2 size={16}/></button></div>
    <div className="tag-row detail-tags">{service.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
    <button className={`btn ${isSubscribed ? "btn-subscribed" : "btn-primary"} full-width`} onClick={() => onToggle(service.id)}>{isSubscribed ? <><CheckCircle2 size={16}/> Subscribed — click to unsubscribe</> : <><Plus size={16}/> Subscribe to service</>}</button>
    <p className="modal-footnote">Demo note: example endpoints are placeholders, not live production APIs.</p>
  </Modal>;
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [services, setServices] = useState(() => load("cloudhub_services_v1", initialServices));
  const [subscribed, setSubscribed] = useState(() => load("cloudhub_subscriptions_v1", ["svc-01", "svc-03"]));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All services");
  const [sort, setSort] = useState("Recommended");
  const [showPublish, setShowPublish] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [profileName, setProfileName] = useState(() => load("cloudhub_profile_v1", "Alex Morgan"));
  const [profileEmail, setProfileEmail] = useState(() => load("cloudhub_email_v1", "alex@workspace.dev"));

  useEffect(() => localStorage.setItem("cloudhub_services_v1", JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem("cloudhub_subscriptions_v1", JSON.stringify(subscribed)), [subscribed]);
  useEffect(() => localStorage.setItem("cloudhub_profile_v1", JSON.stringify(profileName)), [profileName]);
  useEffect(() => localStorage.setItem("cloudhub_email_v1", JSON.stringify(profileEmail)), [profileEmail]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const navGroups = [
    { label: "WORKSPACE", items: [{ label: "Overview", icon: LayoutDashboard }, { label: "Explore services", icon: Compass, count: services.length }, { label: "My subscriptions", icon: Blocks, count: subscribed.length }, { label: "My services", icon: Cloud }] },
    { label: "INSIGHTS", items: [{ label: "Analytics", icon: Activity }] },
    { label: "PREFERENCES", items: [{ label: "Settings", icon: Settings2 }] }
  ];
  const filteredServices = useMemo(() => {
    let list = services.filter(s => {
      const q = query.toLowerCase();
      const matchesQuery = !q || [s.name, s.publisher, s.category, s.description, ...(s.tags || [])].join(" ").toLowerCase().includes(q);
      const matchesCategory = category === "All services" || s.category === category;
      return matchesQuery && matchesCategory;
    });
    if (sort === "Most popular") list = [...list].sort((a,b) => parseFloat(b.usage.replace("k","")) - parseFloat(a.usage.replace("k","")));
    if (sort === "Recently added") list = [...list].reverse();
    return list;
  }, [services, query, category, sort]);
  const ownedServices = services.filter(s => s.publisher.toLowerCase() === profileName.toLowerCase() || s.publisher.toLowerCase() === "your workspace");
  const mySubscriptions = services.filter(s => subscribed.includes(s.id));
  const currentMeta = pageMeta[page] || pageMeta.Overview;

  function toggleSubscribe(id) {
    const wasSubscribed = subscribed.includes(id);
    setSubscribed(prev => wasSubscribed ? prev.filter(x => x !== id) : [...prev, id]);
    const svc = services.find(s => s.id === id);
    setToast(wasSubscribed ? `Unsubscribed from ${svc?.name || "service"}` : `Subscribed to ${svc?.name || "service"}`);
  }
  function publishService(form) {
    setServices(prev => [form, ...prev]);
    setShowPublish(false);
    setPage("My services");
    setToast(`${form.name} is now published`);
  }

  const goTo = (item) => { setPage(item); setMobileNav(false); setQuery(""); setCategory("All services"); };
  const nav = <div className="sidebar-inner">
    <div className="brand"><div className="brand-mark"><Cloud size={22} strokeWidth={2.4}/></div><span>cloud<span>hub</span></span><span className="brand-version">BETA</span></div>
    <div className="workspace-switch"><div className="workspace-icon">N</div><div className="workspace-meta"><strong>Northstar Studio</strong><span>Free workspace</span></div><ChevronDown size={15}/></div>
    {navGroups.map(group => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item => <button key={item.label} onClick={() => goTo(item.label)} className={`nav-item ${page === item.label ? "active" : ""}`}><item.icon size={18}/><span>{item.label}</span>{item.count !== undefined && <span className="nav-count">{item.count}</span>}</button>)}</div>)}
    <div className="sidebar-spacer"/>
    <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Unlock more power</strong><p>Scale your integrations with Pro tools.</p><button onClick={() => setToast("Pro workspace options are coming soon.")}>Explore Pro <ArrowRight size={13}/></button><div className="upgrade-glow"/></div>
    <button className="nav-item help-item" onClick={() => setToast("Help center: documentation is included in the project README.")}><CircleHelp size={18}/><span>Help & support</span></button>
    <div className="sidebar-profile"><div className="profile-avatar">{(profileName || "A").slice(0,1).toUpperCase()}</div><div className="profile-info"><strong>{profileName || "Alex Morgan"}</strong><span>Workspace admin</span></div><button className="icon-button sidebar-more" onClick={() => setProfileOpen(!profileOpen)}><MoreHorizontal size={18}/></button></div>
    {profileOpen && <div className="profile-popover"><button onClick={() => { goTo("Settings"); setProfileOpen(false); }}><Settings2 size={15}/> Profile settings</button><button onClick={() => { setToast("You are signed in to this local demo."); setProfileOpen(false); }}><LogOut size={15}/> Account status</button></div>}
  </div>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>{nav}</aside>
    {mobileNav && <div className="mobile-scrim" onClick={() => setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)}><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div></div>
        <div className="topbar-right">
          <div className="global-search"><Search size={16}/><input value={query} onChange={e => { setQuery(e.target.value); if (page === "Overview") setPage("Explore services"); }} placeholder="Search services..." /><kbd>⌘ K</kbd></div>
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up — no new notifications.")}><Bell size={18}/><i/></button>
          <button className="top-avatar" onClick={() => goTo("Settings")}>{(profileName || "A").slice(0,1).toUpperCase()}</button>
        </div>
      </header>

      <div className="content-wrap">
        <div className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-line"/>{currentMeta.eyebrow}</div><h1>{currentMeta.title}</h1><p>{currentMeta.subtitle}</p></div>
          <div className="heading-actions"><button className="btn btn-ghost" onClick={() => setToast("Workspace status: all core systems operational.")}><Activity size={16}/> System status <span className="live-dot"/></button><button className="btn btn-primary" onClick={() => setShowPublish(true)}><Plus size={17}/> Publish a service</button></div>
        </div>

        {page === "Overview" && <>
          <div className="welcome-banner"><div className="banner-orb orb-one"/><div className="banner-orb orb-two"/><div className="banner-content"><div className="banner-pill"><Sparkles size={13}/> YOUR WORKSPACE AT A GLANCE</div><h2>Good to see you, {profileName.split(" ")[0] || "there"} <span>✦</span></h2><p>Your integrations are looking healthy. Here’s what’s happening across your cloud workspace.</p><button onClick={() => goTo("Explore services")} className="banner-link">Explore service catalog <ArrowRight size={15}/></button></div><div className="banner-illustration"><div className="illustration-ring ring-a"/><div className="illustration-ring ring-b"/><div className="illustration-cloud"><Cloud size={52}/><span className="cloud-spark spark-a">✦</span><span className="cloud-spark spark-b">✧</span></div><div className="float-chip chip-a"><CheckCircle2 size={14}/> All systems go</div><div className="float-chip chip-b"><Zap size={14}/> Low latency</div></div></div>
          <div className="section-title-row"><div><h2>Workspace overview</h2><p>Performance snapshot for the last 7 days</p></div><button className="select-like" onClick={() => goTo("Analytics")}>Last 7 days <ChevronDown size={14}/></button></div>
          <div className="stats-grid">
            <StatCard label="Total services" value={services.length.toString().padStart(2,"0")} change="+12.8%" sub="vs. previous 7 days" icon={Blocks} tint="tint-purple"/>
            <StatCard label="Active subscriptions" value={subscribed.length.toString().padStart(2,"0")} change="+8.4%" sub="Across your applications" icon={Layers3} tint="tint-green"/>
            <StatCard label="API requests" value="24.8k" change="+18.2%" sub="Across all connected services" icon={Activity} tint="tint-blue"/>
            <StatCard label="Uptime" value="99.98%" change="+0.02%" sub="Average service availability" icon={Gauge} tint="tint-orange"/>
          </div>
          <div className="dashboard-grid">
            <section className="panel usage-panel"><div className="panel-heading"><div><h3>API usage</h3><p>Requests across connected services</p></div><button className="icon-button" onClick={() => goTo("Analytics")}><MoreHorizontal size={19}/></button></div><div className="usage-summary"><strong>24,812</strong><span className="positive"><ArrowUpRight size={14}/> 18.2%</span><span className="usage-summary-note">vs. last week</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={usageData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8173ff" stopOpacity={0.24}/><stop offset="95%" stopColor="#8173ff" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#edf0f7" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b93a8", fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b93a8", fontSize: 11 }} tickFormatter={v => `${v/1000}k`}/><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6e9f2", boxShadow: "0 8px 25px #18234712", fontSize: 12 }}/><Area type="monotone" dataKey="calls" stroke="#8173ff" strokeWidth={2.5} fill="url(#usageGradient)" activeDot={{ r: 5, strokeWidth: 0 }}/></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-dot purple-dot"/> API requests</span><span className="chart-period"><span className="legend-dot pale-dot"/> Daily total</span></div></section>
            <section className="panel category-panel"><div className="panel-heading"><div><h3>Service distribution</h3><p>Catalog by category</p></div><button className="icon-button" onClick={() => goTo("Explore services")}><ArrowUpRight size={17}/></button></div><div className="donut-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={4} stroke="none"/><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6e9f2", fontSize: 12 }} formatter={(value) => [`${value}%`, "Share"]}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{services.length}</strong><span>services</span></div></div><div className="category-legend">{categoryData.map(x => <div key={x.name}><span><i style={{background:x.fill}}/>{x.name}</span><strong>{x.value}%</strong></div>)}</div></section>
          </div>
          <div className="section-title-row featured-row"><div><h2>Popular services</h2><p>Community favorites picked for your workspace</p></div><button className="text-action" onClick={() => goTo("Explore services")}>Browse catalog <ArrowRight size={15}/></button></div>
          <div className="service-grid">{services.slice(0,3).map(s => <ServiceCard key={s.id} service={s} isSubscribed={subscribed.includes(s.id)} onToggle={toggleSubscribe} onDetails={setSelectedService}/>)}</div>
          <div className="bottom-grid"><section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Latest updates from your workspace</p></div><button className="text-action" onClick={() => setToast("Showing the latest workspace activity.")}>View all <ArrowRight size={14}/></button></div><div className="activity-list">{activitySeed.map((a,i)=><div className="activity-item" key={a.text}><div className={`activity-icon act-${a.icon}`}>{a.icon==="check"?<CheckCircle2 size={15}/>:a.icon==="spark"?<Sparkles size={15}/>:a.icon==="shield"?<ShieldCheck size={15}/>:<Plus size={15}/>}</div><div className="activity-copy"><p><strong>{a.text}</strong> {a.action}</p><span>{a.time}</span></div><button className="icon-button tiny" onClick={() => setToast(`Activity: ${a.text} — ${a.action}.`)}><ArrowUpRight size={15}/></button></div>)}</div></section><section className="integration-card"><div className="integration-badge"><Terminal size={17}/><span>DEVELOPER CORNER</span></div><h3>Built for builders.</h3><p>Connect services to your application with a developer-friendly workflow.</p><div className="code-snippet"><div className="code-head"><span/><span/><span/><small>quickstart.js</small><button onClick={() => {navigator.clipboard?.writeText('const client = new CloudHub({ apiKey: \"YOUR_API_KEY\" });\\nconst services = await client.services.list();');setToast("Quickstart snippet copied.");}} title="Copy snippet"><Code2 size={13}/></button></div><pre><span className="code-purple">const</span> client = <span className="code-blue">new</span> CloudHub(&#123;{"\n"}  apiKey: <span className="code-green">'YOUR_API_KEY'</span>{"\n"}&#125;);{"\n"}<span className="code-purple">await</span> client.services.<span className="code-yellow">list</span>();</pre></div><button className="integration-link" onClick={() => setToast("Developer documentation can be added as the next project milestone.")}>Explore developer docs <ArrowRight size={14}/></button></section></div>
        </>}

        {page === "Explore services" && <><div className="catalog-toolbar"><div className="catalog-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by service, publisher, or keyword"/></div><div className="catalog-controls"><label className="select-wrapper"><Filter size={15}/><select value={category} onChange={e=>setCategory(e.target.value)}><option>All services</option>{[...new Set(services.map(s=>s.category))].sort().map(c=><option key={c}>{c}</option>)}</select><ChevronDown size={14}/></label><label className="select-wrapper"><select value={sort} onChange={e=>setSort(e.target.value)}><option>Recommended</option><option>Most popular</option><option>Recently added</option></select><ChevronDown size={14}/></label></div></div><div className="catalog-info"><span><strong>{filteredServices.length}</strong> services found</span><span><i className="live-dot"/> Live catalog preview</span></div>{filteredServices.length ? <div className="service-grid">{filteredServices.map(s=><ServiceCard key={s.id} service={s} isSubscribed={subscribed.includes(s.id)} onToggle={toggleSubscribe} onDetails={setSelectedService}/>)}</div> : <div className="empty-state"><div><Search size={25}/></div><h3>No services found</h3><p>Try a different keyword or category filter.</p><button className="btn btn-ghost" onClick={()=>{setQuery("");setCategory("All services");}}>Clear filters</button></div>}</>}

        {page === "My subscriptions" && <><div className="subscription-summary"><div className="subsum-icon"><Layers3 size={21}/></div><div><strong>{mySubscriptions.length} connected services</strong><p>Your selected services are ready to integrate into your application.</p></div><button className="btn btn-secondary" onClick={()=>goTo("Explore services")}><Plus size={15}/> Add service</button></div>{mySubscriptions.length ? <div className="service-grid">{mySubscriptions.map(s=><ServiceCard key={s.id} service={s} isSubscribed onToggle={toggleSubscribe} onDetails={setSelectedService}/>)}</div> : <div className="empty-state"><div><Blocks size={25}/></div><h3>No subscriptions yet</h3><p>Explore the catalog and subscribe to services your application needs.</p><button className="btn btn-primary" onClick={()=>goTo("Explore services")}>Explore services <ArrowRight size={15}/></button></div>}</>}

        {page === "My services" && <><div className="subscription-summary"><div className="subsum-icon green-sub"><Cloud size={21}/></div><div><strong>{ownedServices.length} published services</strong><p>Manage the services published by your workspace.</p></div><button className="btn btn-primary" onClick={()=>setShowPublish(true)}><Plus size={15}/> New service</button></div>{ownedServices.length ? <div className="table-panel"><div className="table-head"><span>Service</span><span>Category</span><span>Status</span><span>Subscribers</span><span>Updated</span></div>{ownedServices.map(s=><div className="table-row" key={s.id}><div className="table-service"><div className={`mini-service-icon ${s.color}`}><ServiceIcon type={s.icon} size={17}/></div><div><strong>{s.name}</strong><span>{s.publisher}</span></div></div><span className="table-category">{s.category}</span><span><i className={`status-dot ${s.status==="Degraded"?"warn":""}`}/> <span className="table-status">{s.status}</span></span><span>{subscribed.includes(s.id)?"1":"0"} subscribers</span><span>{s.created}</span><button className="icon-button table-more" onClick={()=>setSelectedService(s)}><MoreHorizontal size={18}/></button></div>)}</div> : <div className="empty-state"><div><Cloud size={25}/></div><h3>Make your first service public</h3><p>Publish a service and make it discoverable to other builders.</p><button className="btn btn-primary" onClick={()=>setShowPublish(true)}><Plus size={15}/> Publish a service</button></div>}</>}

        {page === "Analytics" && <><div className="stats-grid"><StatCard label="API requests" value="24.8k" change="+18.2%" sub="vs. previous 7 days" icon={Activity} tint="tint-purple"/><StatCard label="Avg. response" value="128 ms" change="-6.1%" sub="Faster than last week" icon={Zap} tint="tint-green"/><StatCard label="Success rate" value="99.7%" change="+0.3%" sub="Request success ratio" icon={CheckCircle2} tint="tint-blue"/><StatCard label="Active services" value={services.filter(s=>s.status==="Operational").length.toString()} change="+2" sub="Operational right now" icon={Cloud} tint="tint-orange"/></div><div className="panel analytics-chart"><div className="panel-heading"><div><h3>Request volume</h3><p>API requests by day · last 7 days</p></div><span className="chart-badge"><span className="live-dot"/> Sample data</span></div><div className="large-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={usageData} margin={{top:15,right:15,left:0,bottom:0}}><defs><linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8173ff" stopOpacity={0.3}/><stop offset="100%" stopColor="#8173ff" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid stroke="#edf0f7" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:"#8b93a8",fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"#8b93a8",fontSize:12}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e6e9f2"}}/><Area type="monotone" dataKey="calls" stroke="#8173ff" strokeWidth={3} fill="url(#analyticsGradient)"/></AreaChart></ResponsiveContainer></div></div><div className="insight-row"><div className="insight-card"><div className="insight-icon violet-insight"><TrendingUp size={19}/></div><div><strong>Usage is trending up</strong><p>Request volume increased 18.2% compared to the previous week.</p></div></div><div className="insight-card"><div className="insight-icon green-insight"><ShieldCheck size={19}/></div><div><strong>Workspace health is strong</strong><p>Most listed demo services currently report operational status.</p></div></div></div><p className="data-disclaimer">Analytics values are illustrative sample data for the project demo, not production telemetry.</p></>}

        {page === "Settings" && <div className="settings-layout"><section className="panel settings-panel"><div className="settings-heading"><div className="settings-avatar">{(profileName||"A").slice(0,1).toUpperCase()}</div><div><h3>Personal profile</h3><p>Update the details shown in your workspace.</p></div></div><form onSubmit={e=>{e.preventDefault();setToast("Profile preferences saved.");}} className="settings-form"><label>Display name<input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Your name"/></label><label>Email address<input type="email" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} placeholder="you@example.com"/></label><label>Workspace name<input value="Northstar Studio" readOnly/></label><div className="settings-save"><span><ShieldCheck size={14}/> Stored locally in this browser</span><button className="btn btn-primary" type="submit">Save changes</button></div></form></section><section className="panel settings-panel"><h3>Workspace preferences</h3><p className="settings-description">Project demo configuration</p><div className="setting-row"><div className="setting-row-icon"><Bell size={17}/></div><div><strong>Activity notifications</strong><span>Show a toast when key workspace actions happen</span></div><span className="toggle enabled"><i/></span></div><div className="setting-row"><div className="setting-row-icon"><ShieldCheck size={17}/></div><div><strong>Safe demo mode</strong><span>Sample endpoints only — no API calls are sent</span></div><span className="setting-status">Enabled</span></div><div className="setting-row"><div className="setting-row-icon"><Database size={17}/></div><div><strong>Storage</strong><span>Browser localStorage</span></div><span className="setting-status">Local</span></div></section></div>}

        <footer className="app-footer"><div><span className="footer-brand"><Cloud size={14}/> cloudhub</span><span>© 2026 CloudHub workspace</span></div><div><span><i className="live-dot"/> All systems operational</span><button onClick={()=>setToast("CloudHub React demo · Vite + React + Recharts.")}>About this demo</button><button onClick={()=>setToast("Check README.md for setup and deployment instructions.")}>Documentation</button></div></footer>
      </div>
    </main>
    <AnimatePresence>{showPublish && <PublishModal onClose={()=>setShowPublish(false)} onPublish={publishService}/>}</AnimatePresence>
    <AnimatePresence>{selectedService && <DetailModal service={selectedService} isSubscribed={subscribed.includes(selectedService.id)} onToggle={toggleSubscribe} onClose={()=>setSelectedService(null)}/>}</AnimatePresence>
    <AnimatePresence>{toast && <motion.div className="toast" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast("")}><X size={14}/></button></motion.div>}</AnimatePresence>
  </div>;
}
