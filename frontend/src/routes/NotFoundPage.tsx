import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl">This page doesn't exist</h1>
      <Link to="/" className="mt-4 inline-block text-sky underline underline-offset-4">Go to the home page</Link>
    </section>
  );
}
