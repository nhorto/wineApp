// app/winery/[id].js (Winery Detail Page)
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import wineries from '../../data/wineries_with_coordinates_and_id.json';

export default function WineryDetail() {
  const { id } = useLocalSearchParams();
  const winery = wineries.find(w => w.id == id);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{winery.name}</Text>
      <Text>{winery.address}</Text>
      <Text>{winery.website}</Text>
    </View>
  );
}