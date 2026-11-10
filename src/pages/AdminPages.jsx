import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Briefcase, LayoutDashboard, LifeBuoy, MessageSquare, MonitorSmartphone, RefreshCw, Search, Settings, ShieldAlert, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchAdminOverviewData, fetchAdminRequests, fetchAdminScreens, fetchAdminUsers, isCurrentUserAdmin, updateAdminRequestStatus } from "../lib/adminData";

const DAY_MS = 24 * 60 * 60 * 1000;

const ADMIN_SECTIONS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "contact", label: "Advertiser Enquiries", icon: MessageSquare },
  { id: "partner", label: "Venue Partner Requests", icon: Briefcase },
  { id: "support", label: "Creative Support", icon: LifeBuoy },
  { id: "screens", label: "Screens", icon: MonitorSmartphone },
  { id: "users", label: "Users", icon: UsersRound },
  { id: "settings", label: "Settings", icon: Settings },
];
const REQUEST_SECTIONS = ["contact", "partner", "support"];
const REQUEST_SECTION_TITLES = { contact: "Advertiser enquiries", partner: "Venue partner requests", support: "Creative support requests" };
const STATUS_LABEL = { pending: "Pending", in_progress: "In progress", resolved: "Resolved", live: "Live", inactive: "Inactive", active: "Active", suspended: "Suspended" };

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const withinLastDays = (value, days) => Boolean(value) && Date.now() - new Date(value).getTime() <= days * DAY_MS;

function AdminBadge({ status }) {
  return <span className="admin-badge" data-status={status}>{STATUS_LABEL[status] ?? status}</span>;
}

function useAdminPageMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    let robotsTag = document.querySelector('meta[name="robots"]');
    const createdTag = !robotsTag;
    const previousContent = robotsTag?.getAttribute("content");
    document.title = "Adsrow Admin · Internal";
    if (createdTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute("content", "noindex, nofollow");
    return () => {
      document.title = previousTitle;
      if (createdTag) robotsTag.remove();
      else if (previousContent !== null) robotsTag.setAttribute("content", previousContent);
    };
  }, []);
}

function AdminPageHead({ title, note, action }) {
  return <div className="admin-page-head"><div><h1>{title}</h1>{note && <p>{note}</p>}</div>{action}</div>;
}

function AdminError({ error, onRetry }) {
  const raw = error?.message ?? "Unknown database error.";
  // The migrations that create the dashboard tables may not be applied yet.
  const notReady = /row-level security|schema cache|does not exist|Could not find/i.test(raw);
  return (
    <div className="admin-alert" role="alert">
      <ShieldAlert size={20} />
      <div>
        <strong>{notReady ? "Database structures are not ready yet." : "The dashboard could not load this data."}</strong>
        <p>{notReady ? "Apply the prepared migrations in supabase/migrations before using the dashboard." : raw}</p>
      </div>
      {onRetry && <button type="button" className="button admin-refresh" onClick={onRetry}>Retry <RefreshCw size={15} /></button>}
    </div>
  );
}

function AdminEmpty({ title, note }) {
  return <div className="admin-empty"><strong>{title}</strong>{note && <p>{note}</p>}</div>;
}

function AdminSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="admin-tablewrap" aria-busy="true" aria-label="Loading dashboard data">
      <table className="admin-table">
        <thead><tr>{Array.from({ length: cols }, (_, index) => <th key={index}><span className="admin-skeleton" style={{ width: "70%" }} /></th>)}</tr></thead>
        <tbody>{Array.from({ length: rows }, (_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: cols }, (_, colIndex) => <td key={colIndex}><span className="admin-skeleton" style={{ width: `${60 + ((rowIndex + colIndex) % 3) * 15}%` }} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function AdminToolbar({ query, onQuery, placeholder, status, onStatus, statuses, sortDescending, onSortToggle, sortLabel }) {
  return (
    <div className="admin-toolbar">
      <label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>
      <label className="admin-select">Status
        <select value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="all">All</option>
          {statuses.map((value) => <option key={value} value={value}>{STATUS_LABEL[value] ?? value}</option>)}
        </select>
      </label>
      {sortLabel && <button type="button" className="admin-sort" onClick={onSortToggle}>Date: {sortDescending ? "newest first" : "oldest first"}</button>}
    </div>
  );
}

/* ------------------------------- Overview -------------------------------- */

function buildDailyCounts(requests) {
  const today = new Date();
  const buckets = [];
  for (let index = 13; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - index);
    buckets.push({ start: date.getTime(), label: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), count: 0 });
  }
  for (const request of requests) {
    const time = new Date(request.created_at).getTime();
    if (time >= buckets[0].start) {
      const dayIndex = Math.floor((time - buckets[0].start) / DAY_MS);
      if (dayIndex < buckets.length) buckets[dayIndex].count += 1;
    }
  }
  return buckets;
}

function AdminKpiCard({ kicker, value, note }) {
  return <div className="admin-card"><span className="admin-card-kicker">{kicker}</span><strong className="admin-card-value">{value.toLocaleString("en-IN")}</strong>{note && <span className="admin-card-note">{note}</span>}</div>;
}

function AdminRequestsChart({ requests }) {
  const buckets = buildDailyCounts(requests);
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  return <div className="admin-chart" role="img" aria-label={`Requests received per day over the last 14 days, highest ${max}`}>
    {buckets.map((bucket, index) => <div key={bucket.label} className="admin-chart-col" title={`${bucket.label}: ${bucket.count} request${bucket.count === 1 ? "" : "s"}`}>
      <div className="admin-chart-zone"><span className="admin-chart-bar" style={{ height: `${Math.max((bucket.count / max) * 100, bucket.count ? 8 : 3)}%` }} data-active={bucket.count > 0 || undefined} /></div>
      <span className="admin-chart-label">{index % 2 === 0 ? bucket.label : "\u00A0"}</span>
    </div>)}
  </div>;
}

function AdminOverviewView() {
  const [state, setState] = useState({ loading: true, error: null, requests: [], screens: [], profiles: [] });
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let current = true;
    setState((existing) => ({ ...existing, loading: true, error: null }));
    fetchAdminOverviewData().then(([requests, screens, profiles]) => {
      if (!current) return;
      const error = requests.error ?? screens.error ?? profiles.error;
      setState({ loading: false, error, requests: requests.data ?? [], screens: screens.data ?? [], profiles: profiles.data ?? [] });
    });
    return () => { current = false; };
  }, [reloadKey]);

  if (state.loading) return <><AdminPageHead title="Dashboard overview" note="Loading live statistics…" /><AdminSkeleton rows={6} cols={4} /></>;
  if (state.error) return <><AdminPageHead title="Dashboard overview" note="Live statistics are unavailable." /><AdminError error={state.error} onRetry={() => setReloadKey((value) => value + 1)} /></>;

  const byType = (type) => state.requests.filter((request) => request.request_type === type);
  const contact = byType("contact"), partner = byType("partner"), support = byType("support");
  const pendingOf = (list) => list.filter((item) => item.status === "pending").length;
  const unresolvedOf = (list) => list.filter((item) => item.status !== "resolved").length;
  const contactPending = pendingOf(contact), partnerPending = pendingOf(partner), supportPending = pendingOf(support);
  const unresolvedTotal = unresolvedOf(contact) + unresolvedOf(partner) + unresolvedOf(support);
  const userCount = state.profiles.length;
  const newUserCount = state.profiles.filter((profile) => withinLastDays(profile.created_at, 30)).length;
  const activeUserCount = state.profiles.filter((profile) => withinLastDays(profile.last_sign_in_at, 30)).length;
  const liveScreens = state.screens.filter((screen) => screen.status === "live").length;
  const pendingScreens = state.screens.filter((screen) => screen.status === "pending").length;
  const inactiveScreens = state.screens.filter((screen) => screen.status === "inactive").length;

  return <>
    <AdminPageHead title="Dashboard overview" note="Every number is read live from Supabase — nothing is hardcoded." action={<button type="button" className="button admin-refresh" onClick={() => setReloadKey((value) => value + 1)}>Refresh <RefreshCw size={15} /></button>} />
    <h2 className="admin-group-title">Requests</h2>
    <section className="admin-cards">
      <AdminKpiCard kicker="Advertiser enquiries" value={contact.length} note={`unresolved ${unresolvedOf(contact)}`} />
      <AdminKpiCard kicker="Venue partner requests" value={partner.length} note={`unresolved ${unresolvedOf(partner)}`} />
      <AdminKpiCard kicker="Creative support requests" value={support.length} note={`unresolved ${unresolvedOf(support)}`} />
      <AdminKpiCard kicker="Total requests" value={state.requests.length} note="all request types" />
    </section>
    <h2 className="admin-group-title">Screens</h2>
    <section className="admin-cards">
      <AdminKpiCard kicker="Total screens" value={state.screens.length} note="screen inventory" />
      <AdminKpiCard kicker="Live screens" value={liveScreens} note="confirmed by database status" />
      <AdminKpiCard kicker="Pending screens" value={pendingScreens} note="awaiting activation" />
      <AdminKpiCard kicker="Inactive screens" value={inactiveScreens} note="paused or retired" />
    </section>
    <h2 className="admin-group-title">Users</h2>
    <section className="admin-cards">
      <AdminKpiCard kicker="Registered users" value={userCount} note="total accounts" />
      <AdminKpiCard kicker="New in last 30 days" value={newUserCount} note="by registration date" />
      <AdminKpiCard kicker="Active in last 30 days" value={activeUserCount} note="by latest sign-in" />
    </section>
    <h2 className="admin-group-title">Pending work</h2>
    <section className="admin-cards">
      <AdminKpiCard kicker="Pending advertiser enquiries" value={contactPending} note="status: pending" />
      <AdminKpiCard kicker="Pending partner requests" value={partnerPending} note="status: pending" />
      <AdminKpiCard kicker="Pending support requests" value={supportPending} note="status: pending" />
      <AdminKpiCard kicker="Unresolved total" value={unresolvedTotal} note="pending + in progress" />
    </section>
    <h2 className="admin-group-title">Requests · last 14 days</h2>
    <section className="admin-panel">
      <AdminRequestsChart requests={state.requests} />
    </section>
  </>;
}

/* ------------------------------- Requests -------------------------------- */

function AdminRequestsView({ requestType, userId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAscending, setSortAscending] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let current = true;
    setState((existing) => ({ ...existing, loading: true, error: null }));
    fetchAdminRequests(requestType).then((result) => {
      if (!current) return;
      setState({ loading: false, error: result.error, rows: result.data ?? [] });
    });
    return () => { current = false; };
  }, [reloadKey, requestType]);

  const rows = state.rows
    .filter((row) => statusFilter === "all" || row.status === statusFilter)
    .filter((row) => {
      if (!query.trim()) return true;
      const haystack = `${row.name} ${row.email} ${row.phone} ${row.message}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .toSorted((left, right) => (sortAscending ? new Date(left.created_at) - new Date(right.created_at) : new Date(right.created_at) - new Date(left.created_at)));

  async function setStatus(row, next) {
    if (row.status === next) return;
    setSavingId(row.id);
    setSaveError(null);
    const result = await updateAdminRequestStatus(row.id, next, userId);
    setSavingId(null);
    if (result.error) { setSaveError(result.error); return; }
    setState((existing) => ({ ...existing, rows: existing.rows.map((item) => (item.id === row.id ? { ...item, status: next } : item)) }));
  }

  if (state.loading) return <><AdminPageHead title={REQUEST_SECTION_TITLES[requestType]} note="Loading live records..." /><AdminSkeleton rows={6} cols={6} /></>;
  return <>
    <AdminPageHead title={REQUEST_SECTION_TITLES[requestType]} note="Records are submitted by the public enquiry forms and stored in the requests table." />
    {state.error && <AdminError error={state.error} onRetry={() => setReloadKey((value) => value + 1)} />}
    {!state.error && <>
      <AdminToolbar query={query} onQuery={setQuery} placeholder="Search name, email, phone or message" status={statusFilter} onStatus={setStatusFilter} statuses={["pending", "in_progress", "resolved"]} sortDescending={!sortAscending} onSortToggle={() => setSortAscending((value) => !value)} sortLabel="date" />
      {saveError && <div className="admin-alert" role="alert"><ShieldAlert size={20} /><div><strong>Could not update the status.</strong><p>{saveError.message ?? "The database rejected the change."}</p></div></div>}
      {rows.length === 0
        ? (query || statusFilter !== "all")
          ? <AdminEmpty title="No matching records." note="Adjust the search or status filter." />
          : <AdminEmpty title="No requests recorded yet." note="Public form submissions will appear here as they arrive." />
        : <div className="admin-tablewrap"><table className="admin-table">
      <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Message</th><th scope="col">Submitted</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
      <tbody>{rows.map((row) => <AdminRequestRow key={row.id} row={row} expanded={expandedId === row.id} onToggle={() => setExpandedId(expandedId === row.id ? null : row.id)} saving={savingId === row.id} onSetStatus={(next) => setStatus(row, next)} />)}</tbody>
    </table></div>}
    </>}
  </>;
}

function AdminRequestRow({ row, expanded, onToggle, saving, onSetStatus }) {
  return <>
    <tr>
      <td data-title="Name">{row.name || "—"}</td>
      <td data-title="Email">{row.email || "—"}</td>
      <td data-title="Phone">{row.phone || "—"}</td>
      <td data-title="Message"><span className="admin-message-cell">{row.message || "—"}</span></td>
      <td data-title="Submitted">{formatDateTime(row.created_at)}</td>
      <td data-title="Status"><AdminBadge status={row.status} /></td>
      <td data-title="Actions"><button type="button" className="admin-link" aria-expanded={expanded} onClick={onToggle}>{expanded ? "Close" : "View"}</button></td>
    </tr>
    {expanded && <tr className="admin-detail-row"><td colSpan={7}>
      <div className="admin-detail">
        <p><strong>Message</strong><br />{row.message || "—"}</p>
        {row.details && Object.keys(row.details).length > 0 && (
          <p><strong>Extra details</strong><br />{Object.entries(row.details).filter(([, value]) => value != null && value !== "").map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "—"}</p>
        )}
        <p><strong>Record</strong><br />ID #{row.id} · last updated {formatDateTime(row.updated_at)}</p>
        <div className="admin-status-picker" aria-label="Set request status">
          <span>Status:</span>
          {["pending", "in_progress", "resolved"].map((next) => (
            <button key={next} type="button" disabled={saving || row.status === next} data-current={row.status === next || undefined} onClick={() => onSetStatus(next)}>{STATUS_LABEL[next]}</button>
          ))}
        </div>
      </div>
    </td></tr>}
  </>;
}

/* ------------------------------- Screens --------------------------------- */

function AdminScreensView() {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    let current = true;
    setState((existing) => ({ ...existing, loading: true, error: null }));
    fetchAdminScreens().then((result) => {
      if (!current) return;
      setState({ loading: false, error: result.error, rows: result.data ?? [] });
    });
    return () => { current = false; };
  }, [reloadKey]);

  const rows = state.rows
    .filter((row) => statusFilter === "all" || row.status === statusFilter)
    .filter((row) => !(query.trim()) || `${row.name} ${row.location} ${row.owner}`.toLowerCase().includes(query.trim().toLowerCase()));

  if (state.loading) return <><AdminPageHead title="Screens" note="Loading the screen inventory…" /><AdminSkeleton rows={6} cols={6} /></>;
  return <>
    <AdminPageHead title="Screens" note="A screen is counted as live only when its database status says so." />
    {state.error && <AdminError error={state.error} onRetry={() => setReloadKey((value) => value + 1)} />}
    {!state.error && <>
      <AdminToolbar query={query} onQuery={setQuery} placeholder="Search name, location or owner" status={statusFilter} onStatus={setStatusFilter} statuses={["live", "pending", "inactive"]} />
      {rows.length === 0
        ? (query || statusFilter !== "all")
          ? <AdminEmpty title="No matching screens." note="Adjust the search or status filter." />
          : <AdminEmpty title="The screen inventory is empty." note="Once the screens table is populated, every screen record will appear here." />
        : <div className="admin-tablewrap"><table className="admin-table">
          <thead><tr><th scope="col">ID</th><th scope="col">Screen name</th><th scope="col">Location</th><th scope="col">Owner</th><th scope="col">Created</th><th scope="col">Status</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.id}><td data-title="ID">#{row.id}</td><td data-title="Name">{row.name || "—"}</td><td data-title="Location">{row.location || "—"}</td><td data-title="Owner">{row.owner || "—"}</td><td data-title="Created">{formatDate(row.created_at)}</td><td data-title="Status"><AdminBadge status={row.status} /></td></tr>)}</tbody>
        </table></div>}
    </>}
  </>;
}

/* -------------------------------- Users ---------------------------------- */

function AdminUsersView() {
  const [state, setState] = useState({ loading: true, error: null, rows: [], adminIds: [] });
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => {
    let current = true;
    setState((existing) => ({ ...existing, loading: true, error: null }));
    fetchAdminUsers().then(([profiles, adminGrants]) => {
      if (!current) return;
      const error = profiles.error ?? adminGrants.error;
      setState({ loading: false, error, rows: profiles.data ?? [], adminIds: (adminGrants.data ?? []).map((grant) => grant.user_id) });
    });
    return () => { current = false; };
  }, [reloadKey]);

  const rows = state.rows
    .filter((row) => statusFilter === "all" || row.status === statusFilter)
    .filter((row) => !(query.trim()) || `${row.email} ${row.display_name}`.toLowerCase().includes(query.trim().toLowerCase()));

  if (state.loading) return <><AdminPageHead title="Users" note="Loading registered accounts…" /><AdminSkeleton rows={6} cols={6} /></>;
  return <>
    <AdminPageHead title="Users" note="Account records synced from Supabase Auth. Passwords and tokens are never surfaced here." />
    {state.error && <AdminError error={state.error} onRetry={() => setReloadKey((value) => value + 1)} />}
    {!state.error && <>
      <AdminToolbar query={query} onQuery={setQuery} placeholder="Search email or name" status={statusFilter} onStatus={setStatusFilter} statuses={["active", "suspended"]} />
      {rows.length === 0
        ? (query || statusFilter !== "all")
          ? <AdminEmpty title="No matching users." note="Adjust the search or status filter." />
          : <AdminEmpty title="No registered users yet." note="New accounts will appear here as they sign up." />
        : <div className="admin-tablewrap"><table className="admin-table">
          <thead><tr><th scope="col">Email</th><th scope="col">Registered</th><th scope="col">Last sign-in</th><th scope="col">Confirmed</th><th scope="col">Status</th><th scope="col">Role</th></tr></thead>
          <tbody>{rows.map((row) => <AdminUserRow key={row.user_id} row={row} isAdmin={state.adminIds.includes(row.user_id)} expanded={expandedId === row.user_id} onToggle={() => setExpandedId(expandedId === row.user_id ? null : row.user_id)} />)}</tbody>
        </table></div>}
    </>}
  </>;
}

function AdminUserRow({ row, isAdmin, expanded, onToggle }) {
  return <>
    <tr>
      <td data-title="Email">{row.email || "—"}</td>
      <td data-title="Registered">{formatDate(row.created_at)}</td>
      <td data-title="Last sign-in">{formatDate(row.last_sign_in_at)}</td>
      <td data-title="Confirmed">{row.email_confirmed ? "Yes" : "No"}</td>
      <td data-title="Status"><AdminBadge status={row.status} /></td>
      <td data-title="Role">{isAdmin ? "Admin" : "User"}</td>
    </tr>
    {expanded && <tr className="admin-detail-row"><td colSpan={6}><div className="admin-detail">
      <p><strong>Account ID</strong><br />{row.user_id}</p>
      {row.display_name && <p><strong>Display name</strong><br />{row.display_name}</p>}
      <p><strong>Latest sign-in</strong><br />{formatDateTime(row.last_sign_in_at)}</p>
    </div></td></tr>}
  </>;
}

/* ------------------------------- Settings -------------------------------- */

function AdminSettingsView({ user }) {
  return <>
    <AdminPageHead title="Settings" note="Administrative context for this dashboard session." />
    <section className="admin-panel">
      <h2>Signed-in administrator</h2>
      <p className="admin-kv"><span>Email</span><strong>{user.email}</strong></p>
      <p className="admin-kv"><span>Account ID</span><strong>{user.id}</strong></p>
      <p className="admin-kv"><span>Email status</span><strong>{user.email_confirmed_at ? "Verified" : "Unverified"}</strong></p>
    </section>
    <section className="admin-panel">
      <h2>Where this data comes from</h2>
      <p>The overview, requests, screens and user pages read directly from the <code>requests</code>, <code>screens</code>, <code>profiles</code> and <code>admin_users</code> tables. Nothing is cached or hardcoded.</p>
      <p>Access is enforced by Supabase row-level security: every query is checked against the <code>admin_users</code> grants table, so a non-admin account with the page open still cannot read any dashboard row.</p>
      <p>Admin status can only be granted from the database console with service-role access; there is no page or API that can promote an account.</p>
    </section>
    <section className="admin-panel">
      <h2>Related Adsrow links</h2>
      <p><Link to="/" className="admin-link">Public website</Link></p>
    </section>
  </>;
}

/* ------------------------------ Entry point ------------------------------ */

export function ProtectedAdminPage() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null = checking with the database
  useAdminPageMeta();
  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    let current = true;
    isCurrentUserAdmin().then((result) => { if (current) setIsAdmin(result); });
    return () => { current = false; };
  }, [userId]);

  if (loading || (user && isAdmin === null)) {
    return <div className="admin-gate"><p>Checking your credentials…</p></div>;
  }
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent("/admin")}`} replace />;
  if (!user.email_confirmed_at) return <Navigate to={`/login?message=${encodeURIComponent("Please verify your email before opening the dashboard.")}`} replace />;
  if (!isAdmin) {
    return <div className="admin-gate">
      <ShieldAlert size={26} />
      <h1>Access restricted</h1>
      <p>This area is reserved for Adsrow administrators. If you believe you should have access, contact Adsrow support.</p>
      <p className="admin-gate-account">Signed in as {user.email}</p>
      <Link to="/" className="button">← Back to Adsrow</Link>
    </div>;
  }
  return <AdminDashboard user={user} />;
}

function AdminDashboard({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("page");
  const section = ADMIN_SECTIONS.some((entry) => entry.id === requested) ? requested : "overview";
  function openSection(id) {
    setSearchParams(id === "overview" ? {} : { page: id });
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand" aria-label="Adsrow home"><img src="/brand/adsrow-logo-white.png" alt="Adsrow" width={149} height={32} /></Link>
        <nav className="admin-nav" aria-label="Admin sections">
          {ADMIN_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className="admin-nav-item" aria-current={section === id ? "page" : undefined} onClick={() => openSection(id)}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span>Signed in as</span>
          <strong>{user.email}</strong>
        </div>
      </aside>
      <main className="admin-main">
        {REQUEST_SECTIONS.includes(section) ? <AdminRequestsView key={section} requestType={section} userId={user.id} />
          : section === "screens" ? <AdminScreensView />
          : section === "users" ? <AdminUsersView />
          : section === "settings" ? <AdminSettingsView user={user} />
          : <AdminOverviewView />}
      </main>
    </div>
  );
}
