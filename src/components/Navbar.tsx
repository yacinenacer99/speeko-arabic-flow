const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-cairo text-foreground">Speeko</h1>
        <div className="bg-muted rounded-full px-4 py-1.5 text-sm font-cairo font-bold text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          ع / EN
        </div>
      </div>
    </nav>
  );
};

export default Navbar;