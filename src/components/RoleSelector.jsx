import { ROLES } from '../constants/translations';

function RoleSelector({ currentRole, currentLang, onRoleChange }) {
  return (
    <div className="bg-saffron-50 p-1 m-2 rounded-xl flex justify-between gap-1 overflow-x-auto" id="roleSelector">
      {Object.values(ROLES).map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onRoleChange(role.id)}
          className={`role-btn flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 ${
            role.id === currentRole
              ? 'bg-white text-saffron-700 shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
          }`}
          data-role={role.id}
        >
          <i className={`ph-fill ${role.icon} text-lg mb-0.5`}></i>
          <span>{role[currentLang].label}</span>
        </button>
      ))}
    </div>
  );
}

export default RoleSelector;

