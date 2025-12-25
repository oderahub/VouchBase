import { useState } from 'react';
import { SKILLS } from '../config/constants';

function BuilderCard({ builder, onVouch, currentAccount }) {
  const [expanded, setExpanded] = useState(false);

  const isOwnProfile = currentAccount?.toLowerCase() === builder.wallet.toLowerCase();

  return (
    <div className="card rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{builder.username}</h3>
          <p className="font-mono text-xs text-gray-500">
            {builder.wallet.slice(0, 8)}...{builder.wallet.slice(-6)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-base-blue glow-text">{builder.credibilityScore}</div>
          <div className="text-xs text-gray-400">Credibility</div>
        </div>
      </div>

      <div className="flex gap-4 mb-4 text-sm text-gray-400">
        {builder.github && (
          <a href={`https://github.com/${builder.github}`} target="_blank" rel="noopener" className="hover:text-white transition-colors">
            GitHub
          </a>
        )}
        {builder.twitter && (
          <a href={`https://twitter.com/${builder.twitter.replace('@', '')}`} target="_blank" rel="noopener" className="hover:text-white transition-colors">
            Twitter
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {builder.skills.slice(0, expanded ? undefined : 5).map(skill => (
          <div key={skill.id} className="flex items-center gap-2">
            <span className="skill-badge px-3 py-1 rounded-lg text-sm">
              {SKILLS[skill.id]}
            </span>
            <span className="text-xs text-gray-500">{skill.vouches}</span>
            {!isOwnProfile && currentAccount && (
              <button
                onClick={() => onVouch(builder.wallet, skill.id)}
                className="vouch-btn px-2 py-0.5 bg-base-blue/20 hover:bg-base-blue/40 rounded text-xs transition-colors"
              >
                Vouch
              </button>
            )}
          </div>
        ))}
      </div>

      {builder.skills.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-base-blue hover:underline"
        >
          {expanded ? 'Show less' : `+${builder.skills.length - 5} more skills`}
        </button>
      )}

      <div className="flex gap-4 mt-4 pt-4 border-t border-white/5 text-sm text-gray-400">
        <span>{builder.vouchesReceived} vouches received</span>
        <span>{builder.vouchesGiven} vouches given</span>
      </div>
    </div>
  );
}

export default BuilderCard;
