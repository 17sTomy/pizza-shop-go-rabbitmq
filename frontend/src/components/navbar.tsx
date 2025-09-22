import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "./theme-switch";
import { useWebSocketContext } from "../contexts/WebSocketContext";

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
            <Chip
              color={isConnected ? "success" : "danger"}
              size="sm"
              variant="dot"
            >
              {isConnected ? "Conectado" : "Desconectado"}
            </Chip>
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
