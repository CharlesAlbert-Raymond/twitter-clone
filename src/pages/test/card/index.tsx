interface CardNameProps {
    name?: string;
    }

const CardName = ({ name }: CardNameProps) => {
    return (
        <div>
            <p>{name}</p>
        </div>
    );
}

interface CardDescriptionProps {
    description?: string;
}

const CardDescription = ({ description }: CardDescriptionProps) => {
    return (
        <div>
            <p>{description}</p>
        </div>
    );
}

interface CardAgeProps {
    age?: number;
}

const CardAge = ({ age }: CardAgeProps) => {
    return (
        <div>
            <p>{age}</p>
        </div>
    );
}

interface CardHeightProps {
    height?: number;
}

const CardHeight = ({ height }: CardHeightProps) => {
    return (
        <div>
            <p>{height}</p>
        </div>
    );
}

interface CardProps {
  children?: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return <div>{children}</div>;
};

Card.Name = CardName;
Card.Description = CardDescription;
Card.Age = CardAge;
Card.Height = CardHeight;

export default Card;
