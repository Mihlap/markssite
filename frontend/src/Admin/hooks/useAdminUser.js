export function useAdminUser(user) {
  const role = String(user?.name ?? user?.userName ?? '').trim();

  const isPokemon = role === 'Pokemon';
  const isObezyankaa = role === 'obezyankaa';
  const isHr778 = role === 'hr778';
  const isManager = role === 'manager';

  return {
    role,
    isPokemon,
    isObezyankaa,
    isHr778,
    isManager,
    canDelete: isObezyankaa || isPokemon,
    canEdit: isObezyankaa || isManager || isPokemon,
    canAdd: !isHr778,
    canDrag: !isHr778,
  };
}
