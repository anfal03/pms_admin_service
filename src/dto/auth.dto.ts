
import { IsNotEmpty, MinLength, IsEmail, IsEnum, isEmpty, isBoolean } from 'class-validator';

export class LoginAuthDto {

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly cus_mobileno: string;

    @IsNotEmpty()
    readonly phone_os: string;

    @IsNotEmpty()
    readonly phone_brand: string;

    @IsNotEmpty()
    readonly device_id: string;

    @IsNotEmpty()
    readonly phone_model: string;

}

export class RefreshAuthDto {

    @IsNotEmpty()
    readonly refresh_token: string;

    @IsNotEmpty()
    readonly phone_os: string;

    @IsNotEmpty()
    readonly phone_brand: string;

    @IsNotEmpty()
    readonly device_id: string;

    @IsNotEmpty()
    readonly phone_model: string;
}
