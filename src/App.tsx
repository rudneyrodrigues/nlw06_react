import { useState } from 'react';

import { Button } from './components/Button';

export function App() {
  const [counter, setCounter] = useState(0);

  function handleCount() {
    setCounter(counter + 1);
  };

  return (
    <>
      <h1>{counter}</h1>
      <Button handleCount={handleCount} />
    </>
  );
}
