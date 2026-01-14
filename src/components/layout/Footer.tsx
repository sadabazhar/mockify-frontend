export function Footer() {
  return (
    <footer className="border-t py-6 px-12 md:py-0">
      <div className="container flex flex-col justify-center items-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built with ❤️ by Mockify Team. © {new Date().getFullYear()} All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
