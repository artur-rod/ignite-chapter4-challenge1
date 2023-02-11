import { container } from 'tsyringe';

import { IUsersRepository } from '../../modules/users/repositories/IUsersRepository';
import { UsersRepository } from '../../modules/users/repositories/UsersRepository';

import { IStatementsRepository } from '../../modules/statements/repositories/IStatementsRepository';
import { StatementsRepository } from '../../modules/statements/repositories/StatementsRepository';
import { TransfersRepository } from '../../modules/transfers/repositories/implementations/TransfersRepository';
import { ITransfersRepository } from '../../modules/transfers/repositories/ITransfersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IStatementsRepository>(
  'StatementsRepository',
  StatementsRepository
);

container.registerSingleton<ITransfersRepository>(
  'TransfersRepository',
  TransfersRepository
);
