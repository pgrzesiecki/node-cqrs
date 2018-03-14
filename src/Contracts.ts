export interface MessageBus<C, H> {
    execute(command: C): Promise<any>;

    bindHandler(handler: H, command: new () => void, overwrite?: boolean): this;
}

export interface MessageBusRx<C, H> extends MessageBus<C, H> {
    complete(): void;
}

export interface Message {}

export interface MessageHandler<T extends Message> {
    handle(command: T): Promise<any>;
}

/**
 * Helpers for TS projects
 */
export interface Command extends Message {}
export interface CommandHandler extends MessageHandler<Command> {}
export interface Query extends Message {}
export interface QueryHandler extends MessageHandler<Query> {}
