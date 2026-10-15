export interface Stat {
  id?: number;
  label: string;
  value: number;
  suffix?: string | null;
  order?: number;
}

export interface StatItem extends Stat {
  id: number;
  suffix: string;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
