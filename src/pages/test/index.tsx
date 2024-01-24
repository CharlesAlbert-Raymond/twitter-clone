import Card from "./card";

export default function Test() {
  const charles = {
    name: "Albert",
    description: "Expert en programmation.",
    age: 27,
    height: 120,
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <Card.Name name={charles.name} />
        <Card.Description description={charles.description} />
        <Card.Age age={charles.age} />
        <Card.Height height={charles.height} />
      </Card>
    </div>
  );
}
