import { Logger } from 'winston';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Prisma, PrismaClient } from '@prisma/client';

const clientOptions = {
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
} satisfies Prisma.PrismaClientOptions;

@Injectable()
export class PrismaService
  extends PrismaClient<typeof clientOptions>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(clientOptions);
  }
  onModuleInit() {
    this.$on('info', (e) => {
      this.logger.info(e);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e);
    });
    this.$on('error', (e) => {
      this.logger.error(e);
    });
    this.$on('query', (e) => {
      this.logger.info(e);
    });
  }
}
