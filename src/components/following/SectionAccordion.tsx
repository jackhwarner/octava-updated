
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
  <section className="bg-white rounded-2xl mb-6 shadow-sm px-2 sm:px-4 transition-[box-shadow] duration-200">
    <header
      className={`
        flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none
        group
        ${open ? '' : ''}
        relative transition-all duration-300`}
      style={{
        transition: "border-bottom-color 0.4s cubic-bezier(0.4,0,0.2,1), border-bottom-width 0.4s cubic-bezier(0.4,0,0.2,1)"
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
        {/* Animation on the arrow as well */}
        <ChevronDown
          className={`
            w-5 h-5 text-gray-400 transition-transform duration-300
            ${open ? 'rotate-180' : ''}
          `}
        />
      </span>
      {/* Underline animation */}
      <span
        className={`
          pointer-events-none absolute left-0 bottom-0 w-full h-0.5
          bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200
          transition-[opacity,transform] duration-400 ease-in-out
          ${open
            ? 'opacity-100 scale-x-100'
            : 'opacity-0 scale-x-75'
          }
          origin-bottom-left
        `}
        style={{
          zIndex: 0
        }}
      />
    </header>
    <div
      className={`
        transition-[max-height,opacity,padding] duration-400 ease-in-out
        overflow-hidden
        ${open
          ? "max-h-[2000px] opacity-100 py-3"
          : "max-h-0 opacity-0 py-0"
        }
      `}
      aria-hidden={!open}
    >
      <div className="px-2 sm:px-6 pb-2 pt-1">
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
