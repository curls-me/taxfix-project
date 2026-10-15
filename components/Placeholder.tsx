export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted">Coming soon</p>
    </div>
  );
}
