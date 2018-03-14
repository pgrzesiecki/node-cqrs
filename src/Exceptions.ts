export class MessageBusException extends Error {
    public constructor(message: string) {
        super(`Message Bus Exception: ${message}`);
    }
}
