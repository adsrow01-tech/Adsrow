import { supabase, isSupabaseConfigured } from "./supabase";

const NOT_CONFIGURED = new Error("Supabase is not configured.");

// Authorisation is enforced by the database (RLS + SECURITY DEFINER RPC).
// This helper only decides what the UI renders; every dashboard query would
// fail ("row-level security") for non-admins even if the UI skipped it.
export async function isCurrentUserAdmin() {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_current_user_admin");
  if (error) return false;
  return Boolean(data);
}

async function selectTable(table, columns, query = {}) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, data: null, error: NOT_CONFIGURED };
  let builder = supabase.from(table).select(columns);
  if (query.eq) builder = builder.eq(query.eq.column, query.eq.value);
  if (query.order) builder = builder.order(query.order.column, { ascending: query.order.ascending ?? false });
  const { data, error } = await builder;
  return { ok: !error, data, error };
}

// Lightweight column reads for the Overview KPIs; the aggregate math happens in
// the component so one round trip powers every card and the activity chart.
export function fetchAdminOverviewData() {
  return Promise.all([
    selectTable("requests", "id, request_type, status, created_at"),
    selectTable("screens", "id, status"),
    selectTable("profiles", "user_id, created_at, last_sign_in_at"),
  ]);
}

export function fetchAdminRequests(requestType) {
  return selectTable("requests", "id, request_type, name, email, phone, message, details, status, created_at, updated_at", {
    eq: { column: "request_type", value: requestType },
    order: { column: "created_at", ascending: false },
  });
}

export function fetchAdminScreens() {
  return selectTable("screens", "id, name, location, owner, status, created_at", {
    order: { column: "created_at", ascending: false },
  });
}

export function fetchAdminUsers() {
  return Promise.all([
    selectTable("profiles", "user_id, email, display_name, created_at, last_sign_in_at, email_confirmed, status", {
      order: { column: "created_at", ascending: false },
    }),
    selectTable("admin_users", "user_id"),
  ]);
}

export async function updateAdminRequestStatus(requestId, status, adminUserId) {
  if (!isSupabaseConfigured || !supabase) return { ok: false, error: NOT_CONFIGURED };
  const { error } = await supabase
    .from("requests")
    .update({ status, updated_by: adminUserId })
    .eq("id", requestId);
  return { ok: !error, error };
}
