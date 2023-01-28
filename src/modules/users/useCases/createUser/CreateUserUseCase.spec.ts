import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User Use Case", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("Should be able to create a new User", async () => {
    const createUser = await createUserUseCase.execute({
      name: "Name Lastname",
      email: "name.lastname@email.com",
      password: "Password123"
    })

    expect(createUser).toHaveProperty("id")
    expect(createUser.name).toBe("Name Lastname")
    expect(createUser.email).toBe("name.lastname@email.com")
  })

  it("Should not be able to create a user with an existent email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Name Lastname",
        email: "name.lastname@email.com",
        password: "Password123"
      })

      await createUserUseCase.execute({
        name: "Name Lastname",
        email: "name.lastname@email.com",
        password: "Password123"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})