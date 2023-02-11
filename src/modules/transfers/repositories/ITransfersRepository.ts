import { ICreateTransferDTO } from "../DTOs/ICreateTransferDTO";
import { Transfer } from "../entities/Transfer";

interface ITransfersRepository {
  create(data: ICreateTransferDTO): Promise<Transfer>
  getSenderUserTransfers(sender_id: string): Promise<Transfer[]>
}

export { ITransfersRepository };
