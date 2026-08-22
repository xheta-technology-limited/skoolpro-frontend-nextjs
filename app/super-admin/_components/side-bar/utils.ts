import {
  Home,
  UserEdit,
  Wallet,
  Book,
  Book1,
  Building,
  Hospital,
  Bookmark,
  Car,
  Buildings,
  DirectNotification,
  Setting2,
  Logout,
  type Icon,
} from "iconsax-reactjs";

const ICON_BY_HREF: Record<string, Icon> = {
  "/dashboard": Home,
  "/dashboard/users": UserEdit,
  "/dashboard/fees": Wallet,
  "/dashboard/curriculum": Book,
  "/dashboard/exams": Book1,
  "/dashboard/hostel": Building,
  "/dashboard/health": Hospital,
  "/dashboard/library": Bookmark,
  "/dashboard/transport": Car,
  "/dashboard/onboarding": Buildings,
  "/dashboard/notifications": DirectNotification,
  "/dashboard/settings": Setting2,
};

export function getNavIcon(
  icon: React.ElementType | null,
  href: string
): React.ElementType {
  if (icon) return icon;
  if (href === "") return Logout;
  return ICON_BY_HREF[href] ?? Home;
}
