function Stats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
      {[
        { label: 'Builders', value: stats.builders },
        { label: 'Vouches', value: stats.vouches },
        { label: 'Skills Claimed', value: stats.skills }
      ].map((stat, i) => (
        <div key={i} className="card rounded-2xl p-6 text-center">
          <div className="stat-value text-4xl font-bold mb-2">{stat.value}</div>
          <div className="text-gray-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Stats;
