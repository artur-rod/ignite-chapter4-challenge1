import { AppError } from "../../../../shared/errors/AppError"
import { User } from "../../../users/entities/User"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Use Case", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let createStatementUseCase: CreateStatementUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    user = await usersRepository.create({
      name: "Name Lastname", 
      email: "name.lastname@email.com", 
      password: "password123"
    })

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "Test Deposit 0"
    })
  })

  it("Should be able to create a new deposit statement", async () => {
    const balance = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "Test Deposit 1"
    })

    expect(balance).toHaveProperty("id")
  })

  it("Should be able to create a new withdraw statement", async () => {
    const balance = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "Test Withdraw 1"
    })

    expect(balance).toHaveProperty("id")
  })

  it("Should not be able to create a new withdraw statement when the user has insufficient fund", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: "withdraw" as OperationType,
        amount: 300,
        description: "Test Withdraw 2"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to create a statement to a nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "nonexistentId" as string,
        type: "deposit" as OperationType,
        amount: 100,
        description: "Test"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})