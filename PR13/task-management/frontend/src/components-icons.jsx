import React from 'react'
const paths={Activity:<><path d="M3 12h4l3-8 4 16 3-8h4"/></>,ArrowDownWideNarrow:<><path d="M3 6h12M3 11h8M3 16h4M19 4v16m-4-4 4 4 4-4"/></>,Bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,CalendarDays:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></>,Check:<path d="m5 12 4 4L19 6"/>,CheckCheck:<><path d="m18 6-7 7-3-3"/><path d="m5 12 4 4L21 4"/></>,ChevronDown:<path d="m6 9 6 6 6-6"/>,Circle:<circle cx="12" cy="12" r="9"/>,CircleCheck:<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,Clock3:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,Command:<><path d="M9 7V5a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v14a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2V7"/></>,FolderKanban:<><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 10v6m4-6v3m4-3v5"/></>,LayoutDashboard:<><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></>,ListTodo:<><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1 1 2-2m-3 7 1 1 2-2m-3 7 1 1 2-2"/></>,Menu:<><path d="M4 6h16M4 12h16M4 18h16"/></>,MoreHorizontal:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,Plus:<path d="M12 5v14M5 12h14"/>,Search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,SlidersHorizontal:<><path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></>,Sparkles:<><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="m19 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></>,Trash2:<><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></>,X:<path d="m18 6-12 12M6 6l12 12"/>}
export function Icon({ name, size = 18, width, height, style, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width ?? size}
      height={height ?? size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block', flex: '0 0 auto', ...style }}
      {...props}
    >
      {paths[name] || paths.Circle}
    </svg>
  )
}
export const Activity=props=><Icon name="Activity" {...props}/>;export const ArrowDownWideNarrow=props=><Icon name="ArrowDownWideNarrow" {...props}/>;export const Bell=props=><Icon name="Bell" {...props}/>;export const CalendarDays=props=><Icon name="CalendarDays" {...props}/>;export const Check=props=><Icon name="Check" {...props}/>;export const CheckCheck=props=><Icon name="CheckCheck" {...props}/>;export const ChevronDown=props=><Icon name="ChevronDown" {...props}/>;export const Circle=props=><Icon name="Circle" {...props}/>;export const CircleCheck=props=><Icon name="CircleCheck" {...props}/>;export const Clock3=props=><Icon name="Clock3" {...props}/>;export const Command=props=><Icon name="Command" {...props}/>;export const FolderKanban=props=><Icon name="FolderKanban" {...props}/>;export const LayoutDashboard=props=><Icon name="LayoutDashboard" {...props}/>;export const ListTodo=props=><Icon name="ListTodo" {...props}/>;export const Menu=props=><Icon name="Menu" {...props}/>;export const MoreHorizontal=props=><Icon name="MoreHorizontal" {...props}/>;export const Plus=props=><Icon name="Plus" {...props}/>;export const Search=props=><Icon name="Search" {...props}/>;export const SlidersHorizontal=props=><Icon name="SlidersHorizontal" {...props}/>;export const Sparkles=props=><Icon name="Sparkles" {...props}/>;export const Trash2=props=><Icon name="Trash2" {...props}/>;export const X=props=><Icon name="X" {...props}/>;
