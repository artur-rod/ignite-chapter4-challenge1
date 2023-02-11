import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ICreateTransferDTO } from "../../DTOs/ICreateTransferDTO";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";

enum OperationType {
  TRANSFER = "transfer"
}

@injectable()
class CreateTransferUseCase {
  constructor (
    @inject("TransfersRepository")
    private transfersRepository: ITransfersRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ recipient_id, sender_id, amount, description }: ICreateTransferDTO) {
    const recipient = await this.usersRepository.findById(recipient_id)
    if (!recipient) {
      throw new AppError("Recipient not found")
    }

    const getSenderBalance = await this.statementsRepository.getUserBalance(sender_id)
    if (amount > getSenderBalance.balance) {
      throw new AppError("Insufficient funds")
    }

    const transfer = await this.transfersRepository.create({
      recipient_id, sender_id, amount, description
    })

    await this.statementsRepository.create({
      user_id: sender_id,
      type: "transfer" as OperationType,
      amount,
      description
    })

    return transfer
  }
}

export { CreateTransferUseCase };


