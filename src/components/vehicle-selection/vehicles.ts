export interface Vehicle {
  id: string;
  name: string;
  plate: string;
}

export const vehicles: Vehicle[] = [
  { id: "1", name: "Fiat Toro", plate: "ABC-1234" },
  { id: "2", name: "Chevrolet Onix", plate: "XYZ-9988" },
  { id: "3", name: "Volkswagen Nivus", plate: "DEF-7777" },
  { id: "4", name: "Toyota Corolla", plate: "GHI-4444" },
];
