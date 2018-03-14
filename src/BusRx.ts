import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Bus } from "./Bus";
import { Message, MessageBus, MessageBusRx, MessageHandler } from "./Contracts";

export class BusRx<C extends Message, H extends MessageHandler<C>>
    extends Observable<C>
    implements MessageBusRx<C, H> {

    private subject$ = new Subject<C>();
    private bus: MessageBus<C, H>;

    public constructor(bus?: MessageBus<C, H>) {
        super();
        this.source = this.subject$ as any;
        this.bus = bus || new Bus();
    }

    public execute(message: C): Promise<any> {
        const result = this.bus.execute(message);
        if (!this.subject$.isStopped) {
            this.subject$.next(message);
        }
        return result;
    }

    public bindHandler(handler: H, command: { new(): void }, overwrite: boolean = false): this {
        this.bus.bindHandler(handler, command, overwrite);
        return this;
    }

    public complete() {
        this.subject$.complete();
    }
}
