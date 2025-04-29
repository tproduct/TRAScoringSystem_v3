import { Select, createListCollection, Portal } from "@chakra-ui/react";

const CustomSelect = ({ contents, handler, defaultValue, width, name, bg, color }) => {
  const collections = createListCollection({
    items: contents.items,
  });

  return (
    <Select.Root
      variant="outline"
      collection={collections}
      width={width}
      size="xs"
      defaultValue={[defaultValue]}
      onValueChange={(e) => {
        handler(contents.key, e.value[0]);
      }}
      name={name}
    >
      <Select.HiddenSelect />
      <Select.Control >
        <Select.Trigger bg={bg}>
          <Select.ValueText placeholder={contents.title} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal >
        <Select.Positioner>
          <Select.Content bg={bg}>
            {collections.items.map((collection) => (
              <Select.Item item={collection} key={collection.value}>
                {collection.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default CustomSelect;
