export interface Challenge {
    _id?: string;
    title: string;
    description: string; 
    goalType: string;
    goalValue: string;
    reward: number;
    startDate: Date;
    endDate: Date;
}