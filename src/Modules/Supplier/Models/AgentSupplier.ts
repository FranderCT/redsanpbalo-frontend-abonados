
export interface AgentSupplier {
  Id?: number;
  Name: string;
  Surname1?: string;
  Surname2?: string;
  Email?: string;
  PhoneNumber?: string;
  SupplierId: number;
}

export const newAgentInitialState : AgentSupplier = {
  Name : '',
  Surname1 : '',
  Surname2: '',
  Email: '',
  PhoneNumber: '',
  SupplierId: 0
}