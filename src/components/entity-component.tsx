import React from "react";

type EntityComponentProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonRef?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

const EntityComponent = (props: EntityComponentProps) => {
  return (
    <div className="">
      <div>
        <h1>{props.title}</h1>
      </div>
    </div>
  );
};

export default EntityComponent;
