import { SKILLS, SKILL_CATEGORIES } from '../config/constants';

function SkillSelector({ selected, onToggle }) {
  return (
    <div className="space-y-6">
      {Object.entries(SKILL_CATEGORIES).map(([category, skillIds]) => (
        <div key={category}>
          <h4 className="text-sm text-gray-400 mb-3">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {skillIds.map(id => (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className={`skill-badge px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selected.includes(id) ? 'selected text-white' : 'text-gray-300'
                }`}
              >
                {SKILLS[id]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillSelector;
