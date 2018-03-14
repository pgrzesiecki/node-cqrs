import { Bus } from "./Bus";
import { Message, MessageHandler } from "./Contracts";
import { MessageBusException } from "./Exceptions";

let bus: Bus<Message, MessageHandler<Message>>;

beforeEach(() => {
    bus = new Bus<Message, MessageHandler<Message>>();
});

test("should throw exception when handler for message is not found", async () => {
    const messageStub = {} as Message;
    return bus.execute(messageStub).catch((e) => expect(e).toBeInstanceOf(MessageBusException));
});

test("should use bind handler for message", () => {

    const MessageStub1 = class implements Message {};
    const MessageStub2 = class implements Message {};
    const MessageStub3 = class implements Message {};

    bus.bindHandler({handle: () => Promise.resolve("One")} as MessageHandler<Message>, MessageStub1);
    bus.bindHandler({handle: () => Promise.resolve("Two")} as MessageHandler<Message>, MessageStub2);
    bus.bindHandler({handle: () => Promise.resolve("Three")} as MessageHandler<Message>, MessageStub3);

    return bus
        .execute(new MessageStub2())
        .then((result: string) => expect(result).toEqual("Two"));
});

test("should update handler if overwrite flag is set", () => {
    const MessageStub1 = class implements Message {};

    bus.bindHandler({handle: () => Promise.resolve("One")} as MessageHandler<Message>, MessageStub1);
    bus.bindHandler({handle: () => Promise.resolve("Two")} as MessageHandler<Message>, MessageStub1);

    return bus
        .execute(new MessageStub1())
        .then((result: string) => expect(result).toEqual("Two"));
});

test("should throw exception when handler is already defined and we can not overwrite it", () => {
    const testFunction = () => {
        const MessageStub1 = class implements Message {};

        bus.bindHandler({handle: () => Promise.resolve("One")} as MessageHandler<Message>, MessageStub1, false);
        bus.bindHandler({handle: () => Promise.resolve("Two")} as MessageHandler<Message>, MessageStub1, false);
    };

    expect(testFunction).toThrow(MessageBusException);
});
