import { AppError } from "../../../../shared/errors/AppError"
import { User } from "../../../users/entities/User"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation Use Case", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let getStatementOperationUseCase: GetStatementOperationUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    user = await usersRepository.create({
      name: "Name Lastname", 
      email: "name.lastname@email.com", 
      password: "password123"
    })
  })

  it("Should be able to get a statement operation", async () => {
    const operation = await statementsRepository.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "Test Deposit"
    })

    const getOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string, 
      statement_id: operation.id as string
    })

    expect(getOperation).toEqual(operation)
  })

  it("Should not be able to get a nonexistent statement operation", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string, 
        statement_id: "nonexistentId" as string
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should be able to get a statement operation from a nonexistent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "nonexistentId" as string, 
        statement_id: "12345" as string
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})