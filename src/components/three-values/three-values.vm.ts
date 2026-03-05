import { signal, WritableSignal } from '@angular/core';

export class ThreeValuesViewModel {
  a = signal<number>(2);
  b = signal<number>(3);
  c = signal<number>(5);

  setA(value: number) {
    this.set(this.a, value);
  }

  setB(value: number) {
    this.set(this.b, value);
  }

  setC(value: number) {
    this.set(this.c, value);
  }

  private set(signal: WritableSignal<number>, value: number) {
    const clamped = Math.max(0, Math.min(10, Math.round(value)));
    const others = [this.a, this.b, this.c].filter((k) => k !== signal);

    const remainder = 10 - clamped;

    const otherTotal = others.reduce((s, k) => s + k(), 0);

    if (otherTotal === 0) {
      // Split remainder evenly
      const base = Math.floor(remainder / others.length);
      const extra = remainder % others.length;
      others.forEach((k, i) => {
        k.set(base + (i < extra ? 1 : 0));
      });
    } else {
      // Distribute proportionally, then fix rounding
      let assigned = 0;
      others.forEach((k) => {
        k.set(Math.floor((k() / otherTotal) * remainder));
        assigned += k();
      });
      // Add rounding leftover to the first other that can take it
      let leftover = remainder - assigned;
      for (const k of others) {
        if (leftover <= 0) break;
        k.set(k() + 1);
        leftover--;
      }
    }

    signal.set(clamped);
  }
}
