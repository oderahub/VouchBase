import { useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import Header from './components/Header';
import Stats from './components/Stats';
import RegisterForm from './components/RegisterForm';
import BuilderCard from './components/BuilderCard';
import Leaderboard from './components/Leaderboard';
import { useVouchBaseContract } from './hooks/useVouchBaseContract';
import { CHAIN_ID } from './config/constants';

function App() {
  // AppKit hooks
  const { address, isConnected, chainId } = useAppKitAccount();
  const contract = useVouchBaseContract();

  // App state
  const [isRegistered, setIsRegistered] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  const [builders, setBuilders] = useState([]);
  const [stats, setStats] = useState({ builders: 0, vouches: 0, skills: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('home'); // home, register, leaderboard, profile

  // Check registration when account changes
  useEffect(() => {
    if (isConnected && address && contract) {
      checkRegistration(contract, address);
    } else {
      setIsRegistered(false);
      setMyProfile(null);
    }
  }, [isConnected, address, contract]);

  // Load stats and builders when contract ready
  useEffect(() => {
    if (contract) {
      loadStats();
      loadBuilders();
    }
  }, [contract]);

  // Network check
  useEffect(() => {
    if (isConnected && chainId !== CHAIN_ID) {
      setError(`Please switch to Base network (Chain ID: ${CHAIN_ID})`);
    } else if (error && error.includes('switch to Base')) {
      setError(null);
    }
  }, [chainId, isConnected]);

  const checkRegistration = async (contract, address) => {
    try {
      const builder = await contract.builders(address);
      if (builder[8]) { // exists field
        setIsRegistered(true);
        await loadMyProfile(contract, address);
      } else {
        setIsRegistered(false);
        setMyProfile(null);
      }
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  const loadMyProfile = async (contract, address) => {
    try {
      const [username, github, twitter, registeredAt, credibilityScore, vouchesReceived, vouchesGiven] =
        await contract.getBuilder(address);

      const [skillIds, vouchCounts] = await contract.getSkillsWithVouches(address);

      setMyProfile({
        wallet: address,
        username,
        github,
        twitter,
        registeredAt: Number(registeredAt),
        credibilityScore: Number(credibilityScore),
        vouchesReceived: Number(vouchesReceived),
        vouchesGiven: Number(vouchesGiven),
        skills: skillIds.map((id, i) => ({
          id: Number(id),
          vouches: Number(vouchCounts[i])
        }))
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const loadStats = async () => {
    if (!contract) return;
    try {
      const [builderCount, vouchCount, skillCount] = await Promise.all([
        contract.getBuilderCount(),
        contract.totalVouches(),
        contract.totalSkillsClaimed()
      ]);
      setStats({
        builders: Number(builderCount),
        vouches: Number(vouchCount),
        skills: Number(skillCount)
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadBuilders = async () => {
    if (!contract) return;
    try {
      const addresses = await contract.getBuilders(0, 50);
      const builderData = await Promise.all(
        addresses.map(async (addr) => {
          const [username, github, twitter, registeredAt, credibilityScore, vouchesReceived, vouchesGiven] =
            await contract.getBuilder(addr);
          const [skillIds, vouchCounts] = await contract.getSkillsWithVouches(addr);

          return {
            wallet: addr,
            username,
            github,
            twitter,
            registeredAt: Number(registeredAt),
            credibilityScore: Number(credibilityScore),
            vouchesReceived: Number(vouchesReceived),
            vouchesGiven: Number(vouchesGiven),
            skills: skillIds.map((id, i) => ({
              id: Number(id),
              vouches: Number(vouchCounts[i])
            }))
          };
        })
      );

      // Sort by credibility score
      builderData.sort((a, b) => b.credibilityScore - a.credibilityScore);
      setBuilders(builderData);
    } catch (err) {
      console.error('Error loading builders:', err);
    }
  };

  const handleRegister = async ({ username, github, twitter, skills }) => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);

      const registerFee = await contract.registerFee();
      const skillFee = await contract.addSkillFee();
      const totalFee = registerFee + (skillFee * BigInt(skills.length));

      const tx = await contract.register(username, github, twitter, skills, {
        value: totalFee
      });

      await tx.wait();
      setIsRegistered(true);
      await loadMyProfile(contract, address);
      await loadStats();
      setView('profile');

    } catch (err) {
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction cancelled');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient ETH for transaction');
      } else {
        setError(err.shortMessage || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVouch = async (builderAddress, skillId) => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);

      const vouchFee = await contract.vouchFee();
      const tx = await contract.vouch(builderAddress, skillId, {
        value: vouchFee
      });

      await tx.wait();

      // Reload data
      await Promise.all([
        loadBuilders(),
        loadStats(),
        address && loadMyProfile(contract, address)
      ]);

    } catch (err) {
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction cancelled');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient ETH for transaction');
      } else {
        setError(err.shortMessage || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="animated-bg"></div>

      <Header />

      <main className="pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          {view === 'home' && (
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Prove Your Skills<br />
                <span className="text-base-blue glow-text">On-Chain</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                The decentralized credential system for Base builders.
                Register your skills, get vouched by peers, build your reputation.
              </p>

              <Stats stats={stats} />

              {!isConnected ? (
                <p className="text-gray-400">Connect your wallet to get started</p>
              ) : isRegistered ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setView('profile')}
                    className="btn-primary px-8 py-4 rounded-xl font-semibold"
                  >
                    View My Profile
                  </button>
                  <button
                    onClick={() => setView('leaderboard')}
                    className="px-8 py-4 rounded-xl font-semibold border border-white/20 hover:border-white/40 transition-colors"
                  >
                    Explore Builders
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setView('register')}
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  Register as Builder
                </button>
              )}
            </div>
          )}

          {/* Register View */}
          {view === 'register' && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setView('home')}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
              >
                ← Back
              </button>
              <h2 className="text-3xl font-bold mb-8">Register as Builder</h2>
              <div className="card rounded-2xl p-8">
                <RegisterForm onRegister={handleRegister} loading={loading} />
              </div>
            </div>
          )}

          {/* Profile View */}
          {view === 'profile' && myProfile && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setView('home')}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
              >
                ← Back
              </button>
              <h2 className="text-3xl font-bold mb-8">My Profile</h2>
              <BuilderCard
                builder={myProfile}
                onVouch={handleVouch}
                currentAccount={address}
              />
            </div>
          )}

          {/* Leaderboard View */}
          {view === 'leaderboard' && (
            <div>
              <button
                onClick={() => setView('home')}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
              >
                ← Back
              </button>
              <h2 className="text-3xl font-bold mb-8">Top Builders</h2>
              <Leaderboard
                builders={builders}
                onVouch={handleVouch}
                currentAccount={address}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="fixed bottom-6 right-6 bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-xl max-w-md z-50">
              <div className="flex justify-between items-start">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="ml-4 text-xl leading-none">×</button>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="card p-8 rounded-2xl text-center">
                <div className="w-12 h-12 border-4 border-base-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Processing transaction...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>Built on Base 🔵</p>
      </footer>
    </div>
  );
}

export default App;
