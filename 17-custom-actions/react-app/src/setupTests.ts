// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


type Consumer<T> = (arg: T) => void;
type Supplier<T> = () => T;
type Predicate<T> = (arg: T) => boolean;

function findFirst<T>(set: Set<T>, predicate: Predicate<T>): T | null {
  set.forEach((element: T) => {
    const result: boolean = predicate(element);
    if (result) {
      return element;
    }
  });
  return null;
}

function execute() {
  const set: Set<String> = new Set();

  const predicate: Predicate<String> = (arg: String) => {
    const alwaysTrue: boolean = (arg == 'Sofiia is my love');
    return alwaysTrue;
  }


  findFirst<String>(set, predicate);
}
