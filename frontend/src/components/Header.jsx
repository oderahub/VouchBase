function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-base-gradient rounded-xl flex items-center justify-center glow-blue">
            <span className="text-xl font-bold">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VouchBase</span>
        </div>

        {/* AppKit button - automatically handles connect/disconnect/account display */}
        <appkit-button />
      </div>
    </header>
  );
}

export default Header;
