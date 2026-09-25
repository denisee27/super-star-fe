import { useState } from "react";
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, Settings, UserCog, ClipboardList } from "lucide-react";
import Logo from "./Logo.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inquiries", label: "Data Inquiry", icon: Users },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

const SUPER_ADMIN_ITEMS = [
  { id: "users", label: "Pengguna", icon: UserCog },
  // { id: "logs", label: "Log Aktivitas", icon: ClipboardList },
];

export default function Sidebar({ activeView, onViewChange, onLogout, collapsed, onToggle, isSuperAdmin }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const allItems = isSuperAdmin ? [...NAV_ITEMS, ...SUPER_ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <aside
      className={`flex flex-col h-full bg-deep-blue text-white transition-all duration-300 ${collapsed ? "w-16" : "w-56"} shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/10 h-16 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && <Logo variant="white" height={24} />}
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {allItems.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-sm font-medium
                ${active ? "bg-superstar-blue text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors font-sans text-sm font-medium"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        title="Konfirmasi Keluar"
        message="Kamu akan keluar dari sesi admin ini. Lanjutkan?"
        confirmLabel="Ya, Keluar"
        variant="danger"
      />
    </aside>
  );
}
