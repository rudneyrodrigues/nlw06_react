type ButtonProps = {
  handleCount: () => void;
  children: number;
}

export function Button({ handleCount, children }: ButtonProps) {
  return (
    <button onClick={handleCount}>
      {children}
    </button>
  );
}