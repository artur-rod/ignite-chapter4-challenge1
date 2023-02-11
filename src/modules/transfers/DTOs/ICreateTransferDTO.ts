export interface ICreateTransferDTO {
  recipient_id: string;
  sender_id: string;
  amount: number;
  description: string;
}