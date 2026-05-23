import { useAuthStore } from "../stores/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  const signOut = async () => {
    await logout();
  };

  return { user, isSignedIn, isLoading, signOut, hydrate };
}
