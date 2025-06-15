
import { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SectionAccordionProps {
  open: boolean
  setOpen: (v: boolean) => void
  label: string
  requests: any[]
  icon: ReactNode
  emptyTitle: string
  emptyMessage: string
  isIncoming: boolean
  renderRequestRow: (request: any, isIncoming: boolean, isLast: boolean) => ReactNode
  searchQuery: string
}

const SectionAccordion = ({
  open,
  setOpen,
  label,
  requests,
  icon,
  emptyTitle,
  emptyMessage,
  isIncoming,
  renderRequestRow,
  searchQuery
}: SectionAccordionProps) => (
  <section className="bg-white rounded-2xl mb-6 shadow-sm px-0">
    <header
      className={
        `flex items-center justify-between px-6 cursor-pointer select-none py-4` +
        ` relative transition-all duration-300` +
        (open ? ` border-b-2 border-gray-200` : ``)
      }
      style={{
        borderBottomWidth: open ? 2 : 0,
        borderBottomColor: open ? "#e5e7eb" : "transparent",
        transition: "border-bottom-color 0.3s, border-bottom-width 0.3s"
      }}
      onClick={() => setOpen(!open)}
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${label} header`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{label}</h2>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${isIncoming ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {requests.length}
        </span>
      </div>
      <span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-200" /> : <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />}
      </span>
    </header>
    <div className={`transition-all duration-200 ease-in ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
      <div className="px-6 pb-2 pt-1">
        <div>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3">{icon}</div>
              <h4 className="text-gray-800 text-base font-medium mb-1">{emptyTitle}</h4>
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No requests match your search.' : emptyMessage}
              </p>
            </div>
          ) : (
            requests.map((request, idx) =>
              renderRequestRow(request, isIncoming, idx === requests.length - 1)
            )
          )}
        </div>
      </div>
    </div>
  </section>
);

export default SectionAccordion;
