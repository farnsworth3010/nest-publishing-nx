import { User, UserRO } from '@app/contracts/user/user.entity';
import { Controller, Get, Query, Redirect, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { UserService } from '../user/user.service';
import { GoogleService } from './google.service';

@ApiTags( 'auth' )
@Controller( 'auth' )
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly userService: UserService,
  ) { }

  @Get( 'google' )
  @Redirect()
  googleAuth(): { url: string } {
    return this.googleService.getOAuth2ClientUrl();
  }

  @Get( 'google/callback' )
  async googleAuthCallback( @Query( 'code' ) code: string ): Promise<UserRO> {
    if ( !code ) {
      throw new UnauthorizedException( 'Authorization code is missing' );
    }

    const googleUser = await this.googleService.getAuthClientData( code );

    return new Promise( ( resolve, reject ) => {
      this.userService.findOrCreateByGoogle( googleUser ).pipe(
        map( ( userRO: UserRO ) => {
          const token = this.userService.generateJWT( userRO.user as unknown as User );
          return {
            user: {
              ...userRO.user,
              token,
            },
          };
        } ),
      ).subscribe( {
        next: resolve,
        error: reject,
      } );
    } );
  }
}
