import { CaretRight, Moon, Bell, Gear } from "../../icons/index"
import Logo from "../../assets/Logo.png"

export function Navbar({ title = 'Dashboard', hasNotification = true }) {

  const actions = [
    { icon: Moon, size: 18 },
    { icon: Gear, size: 18 },
    { icon: Bell, size: 18, isBell: true },
  ]

  return (
    <nav className="bg-secondary-50 px-8 py-3 flex items-center justify-between border-b border-b-secondary-300">
      
      <div className="flex items-center gap-3">
        <h1 className="flex items-center font-normal text-secondary-500">
          <span className='order-2 text-base'>{title}</span>
          <CaretRight size={16} weight="bold" />
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((Item, index) => {
          const Icon = Item.icon

          return (
            <button
              key={index}
              className="relative bg-primary-50 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-primary-200"
            >
              <Icon size={Item.size} className="text-primary-600" />

              {Item.isBell && hasNotification && (
                <span className="absolute top-1/5 right-2.25 w-1.25 h-1.25 bg-red-500 rounded-full"></span>
              )}
            </button>
          )
        })}

        <div className="flex items-center gap-2 ml-2">
          <img
            src={Logo} 
            alt="Profile"
            className="w-8.25 h-8.25 rounded-full object-cover"
          />

          <div className="text-left">
            <p className="text-sm font-medium text-secondary-700">
              Olivia Buckhorton
            </p>
            <p className="text-xs font-normal text-secondary-500">
              Admin
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}