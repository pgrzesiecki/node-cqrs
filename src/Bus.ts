import { Message, MessageBus, MessageHandler } from './Contracts';
import { MessageBusException } from './Exceptions';

export class Bus<C extends Message, H extends MessageHandler<C>> implements MessageBus<C, H> {

    private bus = new Map<string, H>();

    public execute(message: C): Promise<any> {
        const messageName = this.getObjectName(message);
        const handler = this.bus.get(messageName);
        if (!handler) {
            return Promise.reject(new MessageBusException(`Can not find handler for ${messageName}`));
        }

        return handler.handle(message);
    }

    public bindHandler(handler: H, command: new () => void, overwrite: boolean = true): this {
        const messageName = command.name;
        if (this.bus.has(messageName) && !overwrite) {
            throw new MessageBusException(`Can not overwrite exists binding for ${messageName}.`);
        }

        this.bus.set(messageName, handler);
        return this;
    }

    private getObjectName(command: C): string {
        return Object.getPrototypeOf(command).constructor.name as string;
    }
}
