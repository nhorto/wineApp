// app/(tabs)/_layout.js (Tab Navigation)
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default () => (
  <Tabs>
    <Tabs.Screen name="map" options={{ tabBarIcon: ({ color }) => <Ionicons name="map" color={color} size={24} />, title: 'Map' }} />
    <Tabs.Screen name="wines" options={{ tabBarIcon: ({ color }) => <Ionicons name="wine" color={color} size={24} />, title: 'Wines' }} />
    <Tabs.Screen name="wineries" options={{ tabBarIcon: ({ color }) => <Ionicons name="business" color={color} size={24} />, title: 'Wineries' }} />
    <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} />, title: 'Profile' }} />
  </Tabs>
);

// app/(tabs)/map.js (Map with Markers)
import { View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import wineries from '../../data/wineries_with_coordinates_and_id.json';

export default function Map() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ latitude: 37.5, longitude: -79.5, latitudeDelta: 2.5, longitudeDelta: 2.5 }}>
        {wineries.map((winery) => (
          <Marker key={winery.id} coordinate={{ latitude: winery.latitude, longitude: winery.longitude }}>
            <Callout onPress={() => router.push(`/winery/${winery.id}`)}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{winery.name}</Text>
                <Text>{winery.address}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}