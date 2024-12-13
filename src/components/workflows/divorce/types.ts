export interface Child {
  age: number;
  custodialParent: 'spouse1' | 'spouse2';
  custodyReason?: string;
}

export interface Asset {
  name: string;
  desiredOwner: 'spouse1' | 'spouse2';
  reason?: string;
}

export interface DivorceFormData {
  spouse1Name: string;
  spouse2Name: string;
  hasChildren: boolean;
  children: Child[];
  clientName: 'spouse1' | 'spouse2';
  assets: Asset[];
  spouse1WorkInfo?: string;
  spouse2WorkInfo?: string;
}