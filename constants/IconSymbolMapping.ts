import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const IconSymbolMapping = {
  // See MaterialIcons here: https://icons.expo.fyi
  account: 'person.crop.circle.fill',
} as Partial<
  Record<import('expo-symbols').SymbolViewProps['name'], React.ComponentProps<typeof MaterialIcons>['name']>
>;

export default IconSymbolMapping;
