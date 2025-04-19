// app/(tabs)/wines.js (FlatList & Search)
import { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';

const sampleWines = [{ id: '1', name: 'Chardonnay', winery: 'Golden Vineyards' }];

export default function Wines() {
  const [search, setSearch] = useState('');

  const filteredWines = sampleWines.filter(wine => wine.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput placeholder="Search Wines..." value={search} onChangeText={setSearch} style={{ padding: 10, borderWidth: 1 }} />
      <FlatList
        data={filteredWines}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={{ padding: 10 }}>{item.name} - {item.winery}</Text>}
      />
    </View>
  );
}