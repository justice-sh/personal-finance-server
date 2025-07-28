// export type NestedKeys<T> = T extends object
//   ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedKeys<T[K]>}` : never }[keyof T]
//   : never;

// export type NestedValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
//   ? Head extends keyof T
//     ? Tail extends NestedKeys<T[Head]>
//       ? NestedValue<T[Head], Tail>
//       : never
//     : never
//   : K extends keyof T
//     ? T[K]
//     : never;

// Path type: Generates all possible dot-separated string literals for a given object T
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object // Only recurse if the property is an object
          ? `${K}.${Path<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

// ValueOfPath type: Resolves the type of a property given an object T and its path K
export type ValueOfPath<T, K extends string> = K extends keyof T
  ? T[K] // If K is a direct key, return its type
  : K extends `${infer Head}.${infer Tail}` // If K has dots, go deeper
    ? Head extends keyof T
      ? T[Head] extends object // Ensure the head points to an object for further nesting
        ? ValueOfPath<T[Head], Tail>
        : never // Head exists but is not an object, so Tail cannot be a nested key
      : never // Head does not exist in T
    : never; // K is not a direct key and doesn't have dots (e.g., an invalid path)

// === NEW HELPER TYPE ===
// This type is the key to inferring the precise K.
// It creates a union of all paths `K` for which `ValueOfPath<T, K>` is *exactly* `V`.
// We use `[V] extends [ValueOfPath<T, K>]` and `[ValueOfPath<T, K>] extends [V]`
// for strict equality check, preventing unions where a type is assignable but not identical.
export type ExactPathForValue<T, V> = {
  [K in Path<T>]: [V] extends [ValueOfPath<T, K>] ? ([ValueOfPath<T, K>] extends [V] ? K : never) : never;
}[Path<T>];
