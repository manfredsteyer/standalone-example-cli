# Experiment 2: Explicit Signals and Mutables


## Experiments

- [Experiment 1: Hidden Signals and Mutables](https://github.com/manfredsteyer/standalone-example-cli/tree/nest)
- Experiment 2: Explicit Signals and Mutables (this one)
- [Experiment 3: Nested Angular Signals with the SolidJS Store](https://github.com/manfredsteyer/standalone-example-cli/tree/solid)
- [Experiment 4: Store with Explicit Signals and ideas from SolidJS](https://github.com/manfredsteyer/standalone-example-cli/tree/signal-store)

## What's this experiment about?

✅ Convert objects into object with nested signals

✅ Get signal-based fine-grained change detection

✅ Just declare your state with the ``nest`` function:

```typescript
@Component({ ... })
export class FlightSearchComponent {
    state = nest({
        from: 'Hamburg',
        to: 'Graz',
        urgent: false,
        flights: [
            { id: 17, ... }, 
            {id: 18, ...}
        ] as Flight[],
        basket: {
            3: true,
            5: true,
        },
    });

    [...]
}
```

This results in a typed structure of nested signals:

```typescript
for(let flightSignal of this.state.flights()) {
  console.log('id', flightSignal().id());
}
```

## How to try it out?

The application uses a trick to visualize the change detection. Each updated flight blinks red:

![Updated flights blink](./app.png)

1. Start the Angular app
2. Click the ``flights`` menu item on the left 
3. Search for flights
4. All flights blink because they need to be data bound
5. Click "Delay 1st flight"
6. Only the 1st flight blinks


## How does it work?

✅ ``nest`` returns a ``DeepSignal`` -- an typed object with nested signals

✅ This ``DeepSignal`` creates signals for its properties on demand


## How is this different from other approaches?

✅ This is an experiment for lightweight management of signals without any store library (with all advantages and disadvantages not using stores comes with)

✅ Mutable data structures are supported


## Credits

✅ My GDE fellow [Chau Tran](https://twitter.com/Nartc1410) first came up with a store implementation that created signals on demand.  

✅ My colleagues [Michael Egger-Zikes](https://twitter.com/MikeZks) and [Rainer Hahnekamp](https://twitter.com/rainerhahnekamp) for several good discussions and valuable critical feedback.


## Open Questions

✅ We need to check for edge cases 

