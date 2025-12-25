import { useState } from 'react';
import SkillSelector from './SkillSelector';

function RegisterForm({ onRegister, loading }) {
  const [username, setUsername] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [skills, setSkills] = useState([]);

  const toggleSkill = (id) => {
    setSkills(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, github, twitter, skills });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Username *</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="your_username"
          className="input-field w-full px-4 py-3 rounded-xl text-white"
          required
          minLength={3}
          maxLength={20}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">GitHub</label>
          <input
            type="text"
            value={github}
            onChange={e => setGithub(e.target.value)}
            placeholder="github_username"
            className="input-field w-full px-4 py-3 rounded-xl text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Twitter</label>
          <input
            type="text"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            placeholder="@handle"
            className="input-field w-full px-4 py-3 rounded-xl text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-4">Select Your Skills</label>
        <SkillSelector selected={skills} onToggle={toggleSkill} />
      </div>

      <button
        type="submit"
        disabled={loading || !username || skills.length === 0}
        className="btn-primary w-full py-4 rounded-xl font-semibold text-lg"
      >
        {loading ? 'Registering...' : `Register (${(0.0001 + skills.length * 0.00005).toFixed(5)} ETH)`}
      </button>
    </form>
  );
}

export default RegisterForm;
