import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { QueryFailedError } from 'typeorm';

export interface DbErrorPayload {
  code: string;
  message: string;
  detail?: string;
}

export function handleTypeOrmError( error: unknown, logger?: Logger ): never {
  if ( logger ) logger.error( 'Database error', error as any );

  const driverError: any = ( error as any )?.driverError ?? ( error as any );
  const sqlState: string | undefined = driverError?.code ?? ( error as any )?.code;

  const isFKViolation =
    sqlState === '23503' ||
    ( error instanceof QueryFailedError && /violates foreign key constraint/.test( ( error as any )?.message ?? '' ) );

  if ( isFKViolation ) {
    const payload: DbErrorPayload = {
      code: 'FOREIGN_KEY_VIOLATION',
      message:
        'Cannot delete resource: related entities reference this record. Remove dependent records first.',
      detail: ( driverError?.detail as string ) ?? undefined,
    };

    throw new RpcException( payload );
  }

  throw error as any;
}
