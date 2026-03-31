export async function createIntake(data) {
  // Mock API call
  return { id: "PN-" + Date.now(), ...data };
}

export async function fetchIntakeHistory() {
  return [];
}
