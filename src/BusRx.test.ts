import { BusRx } from './BusRx';
import { Message, MessageHandler } from './Contracts';

let bus: BusRx<Message, MessageHandler<Message>>;

beforeEach(() => {
    bus = new BusRx<Message, MessageHandler<Message>>();
});

test('should give possibility to subscribe for every messages', (done: () => void) => {

    let nextCount = 0;
    const MessageStub1 = class implements Message {
    };
    const MessageStub2 = class implements Message {
    };
    const MessageStub3 = class implements Message {
    };

    bus.bindHandler({handle: () => Promise.resolve('One')} as MessageHandler<Message>, MessageStub1);
    bus.bindHandler({handle: () => Promise.resolve('Two')} as MessageHandler<Message>, MessageStub2);
    bus.bindHandler({handle: () => Promise.resolve('Three')} as MessageHandler<Message>, MessageStub3);

    bus.subscribe(() => ++nextCount);

    Promise
        .all([bus.execute(new MessageStub1()), bus.execute(new MessageStub2()), bus.execute(new MessageStub3())])
        .then(() => bus.complete())
        .then(() => Promise.all([bus.execute(new MessageStub1()), bus.execute(new MessageStub2())]))
        .then(() => {
            expect(nextCount).toEqual(3);
            done();
        });
});
