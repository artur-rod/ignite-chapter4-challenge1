import { ICreateTransferDTO } from "../../DTOs/ICreateTransferDTO";
import { Transfer } from "../../entities/Transfer";
import { ITransfersRepository } from "../ITransfersRepository";

class InMemoryTransfersRepository implements ITransfersRepository {
  private transfers: Transfer[] = []

  async create({recipient_id, sender_id, amount, description}: ICreateTransferDTO): Promise<Transfer> {
    const transfer = new Transfer()

    Object.assign(transfer, {
      user_id: recipient_id,
      sender_id,
      amount,
      description,
      type: "transfer"
    })

    this.transfers.push(transfer)
    return transfer
  }

  async getSenderUserTransfers(sender_id: string): Promise<Transfer[]> {
    return this.transfers.filter(transfer => transfer.sender_id === sender_id)
  }
}

export { InMemoryTransfersRepository };
