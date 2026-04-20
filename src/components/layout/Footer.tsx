
import { LayoutContainer } from './LayoutContainer';

export function Footer() {
  return (
    <footer
      className="
        border-t
        bg-background
      "
    >
      <LayoutContainer>
        <div
          className="
            flex flex-col items-center justify-center gap-4
            py-6
            md:h-24 md:flex-row
          "
        >
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built with ❤️ by Mockify Team. © {new Date().getFullYear()} All
            rights reserved.
          </p>
        </div>
      </LayoutContainer>
    </footer>
  );
}
