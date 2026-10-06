import { Link } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firstName } from "@/lib/account";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";
import { useLogout } from "./account-shell";

/** Icône compte du header : lien de connexion, ou menu déroulant une fois connecté. */
export function AccountMenu() {
  const { hydrated, isLoggedIn, user } = useAuth();
  const logout = useLogout();
  const iconBtn = "relative grid h-11 w-11 place-items-center rounded-full hover:bg-surface";

  // Rendu serveur et non connecté : même lien (aucun écart d'hydratation).
  if (!hydrated || !isLoggedIn || !user) {
    return (
      <Link to="/compte/connexion" className={iconBtn} aria-label={t.account.open}>
        <User className="h-5 w-5" aria-hidden />
      </Link>
    );
  }
  const name = firstName(user.name);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-11 items-center gap-1.5 rounded-full px-2 hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring sm:px-3" aria-label={t.account.menu(name)}>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-hidden>{name.charAt(0).toUpperCase()}</span>
        <span className="hidden max-w-24 truncate text-sm font-semibold sm:inline">{name}</span>
        <ChevronDown className="hidden h-4 w-4 sm:block" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2">
          <Link to="/compte"><LayoutDashboard className="h-4 w-4" aria-hidden />{t.account.title}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2">
          <Link to="/compte/commandes"><Package className="h-4 w-4" aria-hidden />{t.account.links.orders}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} className="cursor-pointer rounded-xl py-2 text-primary-deep focus:text-primary-deep">
          <LogOut className="h-4 w-4" aria-hidden />{t.account.links.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
