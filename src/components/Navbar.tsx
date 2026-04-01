const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-surface-dark border-b border-[hsl(240_12%_15%)]">
      <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-cairo text-primary-foreground">Speeko</h1>
        <div className="bg-[hsl(240_12%_15%)] rounded-full px-4 py-1.5 text-sm font-cairo font-bold text-primary-foreground/80 cursor-pointer hover:text-primary-foreground transition-colors">
          ع / EN
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
