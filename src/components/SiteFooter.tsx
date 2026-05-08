import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-10 text-center text-xs text-muted-foreground">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <Link to="/sources" className="hover:text-primary">Sources</Link>
        <Link to="/glossary" className="hover:text-primary">Glossary</Link>
        <Link to="/about" className="hover:text-primary">About</Link>
      </nav>
      <div className="mt-5 flex justify-center">
        <ThemeToggle />
      </div>
      <p className="mt-4">Data: REST Countries · World Bank Open Data · UN</p>
    </footer>
  );
}
