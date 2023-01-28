import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("Show User Profile Use Case", () => {
  let showUserProfileUseCase: ShowUserProfileUseCase
  let createUserUseCase: CreateUserUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("Should be able te return a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Name Lastname",
      email: "name.lastname@email.com",
      password: "Password123"
    })

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile).toHaveProperty("id")
    expect(userProfile).toEqual(user)
  })

  it("Should not be able to show profile of a nonexistent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("nonexistentId")
    }).rejects.toBeInstanceOf(AppError)
  })
})