import { inject, injectable } from "tsyringe";
import { Transfer } from "../../../transfers/entities/Transfer";
import { ITransfersRepository } from "../../../transfers/repositories/ITransfersRepository";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface IResponse {
  balance: number;
  statement: (Statement | Transfer)[];
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const { balance } = await this.statementsRepository.getUserBalance(user_id);
    const statements = await this.statementsRepository.getUserStatementsOperations(user_id)
    const transfers = await this.transfersRepository.getSenderUserTransfers(user_id)

    const allStatements = [...statements, ...transfers]

    return { balance, statement: allStatements } as IResponse;
  }
}
