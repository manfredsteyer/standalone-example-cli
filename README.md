# Experiment 4: Store with Explicit Signals and ideas from SolidJS


## Experiments

- [Experiment 1: Hidden Signals and Mutables](https://github.com/manfredsteyer/standalone-example-cli/tree/nest)
- [Experiment 2: Explicit Signals and Mutables](https://github.com/manfredsteyer/standalone-example-cli/tree/nest)
- [Experiment 3: Nested Angular Signals with the SolidJS Store](https://github.com/manfredsteyer/standalone-example-cli/tree/solid)
- Experiment 4: Store with Explicit Signals and ideas from SolidJS (this here)

## What's This Experiment About?

✅ Providing a store following ideas from SolidJS

✅ However, as usual in Angular, the Signals are made **explicit** (no proxies!)

✅ The store uses nested Signals for a fine-grained reactivity

✅ The nested Signals are created on demand

✅ The read data is read/only, preventing readers from corrupting the state


**Creating the Store**

```typescript
store = createStore({
    criteria: {
        from: 'Hamburg',
        to: 'Graz',
        urgent: false,
    },
    flights: [] as Flight[],
    basket: {
        3: true,
        5: true,
    } as Record<number, boolean>,
});
```

**Selecting Values**

```typescript
flights = this.store.select((s) => s.flights);
criteria = this.store.select((s) => s.criteria());
basket = this.store.select((s) => s.basket);

flightRoute = computed(
    () => this.criteria.from() + ' to ' + this.criteria.to()
);
```

**Updating the Store**

```typescript
this.store.update((s) => s.flights, flights);

[...]

this.store.update(
    (s) => s.flights()[0]().date,
    (date) => addMinutes(date, 15)
);
```

**Alternative Syntax for Updating**

This syntax, inspired by SolidJS, is shorter, and the used properties are type safe (!).

```typescript
this.store.update('flights', flights);

[...]

this.store.update(
    'flights', 0, 'date', 
    (date) => addMinutes(date, 15));
```

**Alternative Syntax for Selecting**

```typescript
const date = this.store.select('flights', 0, 'date')

// Respective lambda syntax:
// const date = this.store.select(s => s.flights()[0]().date)
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


## Credits

✅ My GDE fellow [Chau Tran](https://twitter.com/Nartc1410) first came up with a store implementation that created signals on demand.  

✅ My colleagues [Michael Egger-Zikes](https://twitter.com/MikeZks) and [Rainer Hahnekamp](https://twitter.com/rainerhahnekamp) for several good discussions and valuable critical feedback.

✅ Thanks to [Ryan Carniato](https://twitter.com/RyanCarniato), who is not only a great community member but also the principal author of SolidJS and mastermind for Signals.

## Open Questions

✅ We need to check for edge cases 
