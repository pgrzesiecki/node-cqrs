[![Build Status](https://travis-ci.org/pgrzesiecki/node-cqrs.svg?branch=master)](https://travis-ci.org/pgrzesiecki/node-cqrs)

# Simple CQRS package for NodeJS ecosystem

Command Query Responsibility Segregation for NodeJS ecosystem.    
If you do not have any idea what is CQRS please read nice [article](https://martinfowler.com/bliki/CQRS.html) created by Martin Fowler.

This package provided nothing more than simple CQRS implemented with MessageBus and possible to observe with RxJS.

## Installation

```sh
npm install clean-cqrs --save
```

## Usage

First of all you have to create own command. Command is nothing more like data transfer object without logic. 
For example command to register new account with provided id and name can look like below:

```typescript
import { Command } from 'clean-cqrs';
class RegisterUserCommand implements Command {
    public constructor(public id: number,
                       public name: string) {
    }
}
```

for command must exists command handler (this should be relation **one-to-one**). For example registration process can 
look like this:
```typescript
import { CommandHandler } from 'clean-cqrs';
class RegisterUserCommandHandler implements CommandHandler {
    public constructor(private userService: any) {
    }

    public async handle(command: RegisterUserCommand): Promise<boolean> {
        try {
            await userService.registerAccount({id: command.id, username: command.name});
            await userService.sendNotificationToAdmins(command.id);
            return true;
        } catch (e) {
            return false;
        }
    }
}
```

now we have to connect **Command** with **CommandHandler**.
**All connections should be created one in process lifetime and before command goes to execution**

```typescript
import { Bus, Command, CommandHandler } from 'clean-cqrs';
const bus = new Bus<Command, CommandHandler>();
bus.bindHandler(new RegisterUserCommandHandler(new UserService()), RegisterUserCommand);

bus.execute( new RegisterNewUserCommand(1, 'Agnieszka'))
    .then(() => console.log('Registered!'))
    .catch((e) => console.warn('Registration failed!'));
```

## Possibilities

### Command / Query interfaces

By default two interfaces group are provided and can be used:
```typescript
import { Command, CommandHandler } from 'clean-cqrs'; // for commands
import { Query, QueryHandler } from 'clean-cqrs'; // for queries
```

Technically there is no differences between them but this separation approach simplify and organize flow in application.

Both of them extends same abstraction layer:

```typescript
import { Message, MessageHandler } from 'clean-cqrs'; // for commands
```

### Command / Query buses

You should use two different bus instances for commands and queries.

```typescript
const commandBus = new Bus<Command, CommandHandler>();
const queryBus = new Bus<Query, QueryHandler>();
```

### Observable Bus with RxJS

There is possibility to create observable Bus using RxJS.

```typescript
// create directly
const observableBus = new BusRx<Command, CommandHandler>();

// or use your existing instance (types must fit)
const commandBus = new Bus<Command, CommandHandler>();
const observableBus = new BusRx<Command, CommandHandler>(commandBus);

// subscribe to bus and listen for any command flowing through the message bus
observableBus.subscribe(
    (command) => console.log(command),
    (error) => console.warn(error),
    () => console.log('stream closed')
);
```

## Test
 
```sh
npm test
npm run lint
```

[ISC License](https://opensource.org/licenses/ISC)
