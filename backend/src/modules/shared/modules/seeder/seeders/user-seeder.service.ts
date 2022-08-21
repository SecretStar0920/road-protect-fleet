import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { User, UserType } from '@entities';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { CreateUserDto } from '@modules/user/controllers/user.controller';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserSeederService extends BaseSeederService<User> {
    protected seederName: string = 'User';

    constructor(private createUserService: CreateUserService) {
        super();
    }

    async setSeedData() {
        this.seedData = [
            {
                email: 'liam@entrostat.com',
                name: 'Liam',
                surname: 'Brooksbank',
                password: 'admin',
                type: UserType.Developer,
            },
            {
                email: 'kerren@entrostat.com',
                name: 'Kerren',
                surname: 'Ortlepp',
                password: 'admin',
                type: UserType.Developer,
            },
            {
                email: 'marion@entrostat.com',
                name: 'Marion',
                surname: 'Heimann',
                password: 'admin',
                type: UserType.Developer,
            },
            {
                email: 'emma@entrostat.com',
                name: 'Emma',
                surname: 'Clark',
                password: 'admin',
                type: UserType.Developer,
            },
            {
                email: 'ore@roadprotect.co.il',
                name: 'Ore',
                surname: 'Goldgamer',
                password: '3WayMarketing2019',
                type: UserType.Admin,
            },
            {
                email: 'regan@entrostat.com',
                name: 'Regan',
                surname: 'van Heerden',
                password: 'admin',
                type: UserType.Developer,
            },
            {
                email: 'tare@entrostat.com',
                name: 'Tare',
                surname: 'Mautsa',
                password: 'admin',
                type: UserType.Developer,
            },
        ];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        email: 'testuserone@roadprotect.co.il',
                        name: 'Test User',
                        surname: 'One',
                        password: 'TestUserOne',
                        type: UserType.Admin,
                        completedSignup: true,
                    },
                    {
                        email: 'testusertwo@roadprotect.co.il',
                        name: 'Test User',
                        surname: 'Two',
                        password: 'TestUserTwo',
                        type: UserType.Admin,
                        completedSignup: true,
                    },
                    {
                        email: 'testuserthree@roadprotect.co.il',
                        name: 'Test User',
                        surname: 'Three',
                        password: 'TestUserThree',
                        type: UserType.Admin,
                        completedSignup: true,
                    },
                ],
            ];
        }
    }

    async seedItemFunction(item) {
        item = plainToClass(CreateUserDto, item);
        return this.createUserService.createUser(item);
    }
}
