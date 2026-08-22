import { createElement } from "react";
import {
  Home,
  UserEdit,
  MoneyChange,
  Book,
  Book1,
  Building,
  Hospital,
  Bookmark,
  Car,
  DirectNotification,
  Building4,
  Setting2,
  LogoutCurve,
  type Icon,
  type IconProps,
} from "iconsax-reactjs";

const ICON_DEFAULT_PROPS = { variant: "Bulk", size: 24 } as const;

function withIconDefaults(IconComponent: Icon): Icon {
  function Wrapped(props: IconProps) {
    return createElement(IconComponent, { ...props, ...ICON_DEFAULT_PROPS });
  }
  return Wrapped;
}

const ICON_BY_HREF: Record<string, Icon> = {
  "/dashboard": withIconDefaults(Home),
  "/dashboard/users": withIconDefaults(UserEdit),
  "/dashboard/fees": withIconDefaults(MoneyChange),
  "/dashboard/curriculum": withIconDefaults(Book1),
  "/dashboard/exams": withIconDefaults(Book),
  "/dashboard/hostel": withIconDefaults(Building),
  "/dashboard/health": withIconDefaults(Hospital),
  "/dashboard/library": withIconDefaults(Bookmark),
  "/dashboard/transport": withIconDefaults(Car),
  "/dashboard/onboarding": withIconDefaults(Building4),
  "/dashboard/notifications": withIconDefaults(DirectNotification),
  "/dashboard/settings": withIconDefaults(Setting2),
};

const LOGOUT_ICON = withIconDefaults(LogoutCurve);
const FALLBACK_ICON = withIconDefaults(Home);

export function getNavIcon(
  icon: React.ElementType | null,
  href: string
): React.ElementType {
  if (icon) return icon;
  if (href === "") return LOGOUT_ICON;
  return ICON_BY_HREF[href] ?? FALLBACK_ICON;
}
