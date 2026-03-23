export function useAdminUser(user) {
  const role = user?.name ?? null;
  return {
    role,
    isPokemon: role === 'Pokemon',
    isObezyankaa: role === 'obezyankaa',
    isHr778: role === 'hr778',
    isManager: role === 'manager',
  };
}
