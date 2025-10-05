import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { ThemeSwitch } from "./theme-switch";
import { ConnectionStatus } from "./ConnectionStatus";

export const Navbar = () => {
  const { isConnected } = useWebSocketContext();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <span className="text-2xl">🍕</span>
            <p className="font-bold text-inherit text-xl">Pizza Shop</p>
            <ConnectionStatus isConnected={isConnected} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};


