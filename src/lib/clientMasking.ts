export function maskCandidateName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Candidate";
  if (parts.length === 1) {
    return `${parts[0].charAt(0).toUpperCase()}***`;
  }
  return `${parts.map((p) => p.charAt(0).toUpperCase()).join(" ")} ***`;
}

export function canViewClientContact(planAllowsContact: boolean, isUnlocked: boolean): boolean {
  return planAllowsContact || isUnlocked;
}

export function displayCandidateName(
  name: string,
  planAllowsContact: boolean,
  isUnlocked: boolean
): string {
  return canViewClientContact(planAllowsContact, isUnlocked) ? name : maskCandidateName(name);
}
