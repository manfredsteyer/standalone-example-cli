# Experiment 1: Hidden Signals and Mutables


## Experiments

- Experiment 1: Hidden Signals and Mutables (this one)
- [Experiment 2: Explicit Signals and Mutables](https://github.com/manfredsteyer/standalone-example-cli/tree/nest)
- [Experiment 3: Nested Angular Signals with the SolidJS Store](https://github.com/manfredsteyer/standalone-example-cli/tree/solid)


## What's this experiment about?

✅ Just use ordinary objects (properties) and mutate them

✅ Get signal-based fine-grained change detection

✅ Just declare your state with the ``state`` function:

```typescript
@Component({ ... })
export class FlightSearchComponent {
    state = state({
        from: 'Hamburg',
        to: 'Graz',
        urgent: false,
        flights: [] as Flight[],
        basket: {
            3: true,
            5: true,
        },
    });

    [...]
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

✅ ``state`` returns a proxy

✅ This proxy creates signals for its properties on demand


## How is this different from other approaches?

✅ This is an experiment for lightweight management of signals without any store library (with all advantages and disadvantages not using stores comes with)

✅ Mutable data structures are supported


## Credits

✅ My GDE fellow [Chau Tran](https://twitter.com/Nartc1410) first came up with a store implementation that created signals on demand.  

✅ The usage of Proxies was also inspired by the store implementation found in [SolidJS](https://www.solidjs.com/).


## Open Questions

✅ We need some performance tests, esp. to find out if we create too many Signals.

✅ We need to check for edge cases 
