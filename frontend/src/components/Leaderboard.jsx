import BuilderCard from './BuilderCard';

function Leaderboard({ builders, onVouch, currentAccount }) {
  return (
    <div className="space-y-4">
      {builders.map((builder, index) => (
        <div key={builder.wallet} className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'bg-white/10'
          }`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <BuilderCard
              builder={builder}
              onVouch={onVouch}
              currentAccount={currentAccount}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
