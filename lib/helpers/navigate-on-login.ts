type Role = "super-admin";

const roleRoutes: Record<Role, string> = {
  "super-admin": "/super-admin",
};

type RouterLike = {
  replace: (href: string) => void;
};

export function navigateOnLogin(role: string, router: RouterLike) {
  const route = roleRoutes[role as Role];

  if (!route) return;

  router.replace(route);
}
