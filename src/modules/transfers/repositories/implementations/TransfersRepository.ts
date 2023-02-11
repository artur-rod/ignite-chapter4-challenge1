import { getRepository, Repository } from "typeorm";
import { ICreateTransferDTO } from "../../DTOs/ICreateTransferDTO";
import { Transfer } from "../../entities/Transfer";
import { ITransfersRepository } from "../ITransfersRepository";

class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfer>

  constructor() {
    this.repository = getRepository(Transfer)
  }

  async create({recipient_id, sender_id, amount, description}: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.repository.create({
      user_id: recipient_id,
      sender_id,
      amount,
      description,
      type: "transfer"
    })

    await this.repository.save(transfer)
    return transfer
  }

  async getSenderUserTransfers(sender_id: string): Promise<Transfer[]> {
    return this.repository.find({ sender_id })
  }
}

export { TransfersRepository };
