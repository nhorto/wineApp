// app/(tabs)/map.js (Enhanced Map Screen with Search)
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import wineries from '../../data/wineries_with_coordinates_and_id.json';
import { Ionicons } from '@expo/vector-icons';

export default function Map() {
  const [searchText, setSearchText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const mapRef = useRef(null);
  const router = useRouter();

  // Convert the wineries object format to an array for easier filtering
  const wineriesArray = Object.keys(wineries.id).map(key => ({
    id: wineries.id[key],
    name: wineries.name[key],
    address: wineries.address[key],
    website: wineries.website[key],
    latitude: wineries.latitude[key],
    longitude: wineries.longitude[key]
  })).filter(winery => winery.latitude && winery.longitude); // Filter out any entries without coordinates

  // Filter wineries based on search text
  const filteredWineries = searchText.length > 0 
    ? wineriesArray.filter(winery => 
        winery.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleSelectWinery = (winery) => {
    setSearchText('');
    // Animate map to the winery location
    mapRef.current?.animateToRegion(
      {
        latitude: winery.latitude,
        longitude: winery.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  };

  const handleWineryPress = (winery) => {
    router.push({
      pathname: `/winery/${winery.id}`,
      params: { 
        log: true  // Flag to indicate we want to log a visit
      }
    });
  };

  const onRegionChangeComplete = (region) => {
    setZoomLevel(region.latitudeDelta);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a winery..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#777" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Dropdown */}
      {searchText.length > 0 && filteredWineries.length > 0 && (
        <FlatList
          data={filteredWineries.slice(0, 5)} // Limit to 5 results for better UX
          keyExtractor={(item) => item.id.toString()}
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleSelectWinery(item)}
            >
              <Text style={styles.dropdownItemText}>{item.name}</Text>
              <Text style={styles.dropdownItemSubtext}>{item.address}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.5, // Center on Virginia
          longitude: -79.5,
          latitudeDelta: 2.5,
          longitudeDelta: 2.5,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
      >
        {wineriesArray.map((winery) => (
          <Marker 
            key={winery.id} 
            coordinate={{ 
              latitude: winery.latitude, 
              longitude: winery.longitude 
            }}
            pinColor="#8E2DE2" // Wine-colored pin
          >
            <Callout tooltip onPress={() => handleWineryPress(winery)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{winery.name}</Text>
                <Text style={styles.calloutAddress}>{winery.address}</Text>
                <View style={styles.calloutButton}>
                  <Text style={styles.calloutButtonText}>Log Visit</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: '#8E2DE2',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
