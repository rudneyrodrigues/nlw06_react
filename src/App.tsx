import { useState } from 'react';

import { Button } from './components/Button';

export function App() {
  const [counter, setCounter] = useState(0);

  function handleCount() {
    setCounter(counter + 1);
  };

  return (
    <>
      <Button handleCount={handleCount}>
        {counter}
      </Button>
    </>
  );
}
