'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';

export function DataProvider({ children }) {
  const { token } = useAuth();
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [aboutImage, setAboutImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, carRes, bikeRes, gRes, hRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/cities`),
        fetch(`${API_BASE}/locations`),
        fetch(`${API_BASE}/cars`),
        fetch(`${API_BASE}/bikes`),
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/hero`),
        fetch(`${API_BASE}/about/image`),
      ]);

      if (cRes.ok) setCities(await cRes.json());
      if (lRes.ok) setLocations(await lRes.json());
      if (carRes.ok) setCars(await carRes.json());
      if (bikeRes.ok) setBikes(await bikeRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (hRes.ok) setHeroImages(await hRes.json());
      if (aRes.ok) {
        const data = await aRes.json();
        setAboutImage(data.img);
      }
    } catch (error) {
      console.error('Failed to load data', error);
      // Ensure arrays are at least empty on error
      setHeroImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // Run once on mount

  // ... (Add helper functions for Cities, Locations, Cars, Bikes, Gallery are assumed to exist below, we just insert Hero/About helpers)

  const addHeroImage = async (url) => {
    try {
      const res = await fetch(`${API_BASE}/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        const newImg = await res.json();
        setHeroImages(prev => [...prev, newImg]); // { id, url }
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const removeHeroImage = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/hero/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      if (res.ok) {
        setHeroImages(prev => prev.filter(img => img.id !== id));
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const updateAboutImage = async (url) => {
    try {
      const res = await fetch(`${API_BASE}/about/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ img: url })
      });
      if (res.ok) {
        const data = await res.json();
        setAboutImage(data.img);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const deleteAboutImage = async () => {
    try {
      const res = await fetch(`${API_BASE}/about/image`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      if (res.ok) {
        setAboutImage(null);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };



  const addCity = async (name) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return false;
    setCities((prev) => [...prev, name]);
    return true;
  };

  const removeCity = async (name) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/cities/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (!res.ok) return false;
    setCities((prev) => prev.filter((c) => c !== name));
    return true;
  };

  const addLocation = async (name) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return false;
    setLocations((prev) => [...prev, name]);
    return true;
  };

  const removeLocation = async (name) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/locations/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (!res.ok) return false;
    setLocations((prev) => prev.filter((l) => l !== name));
    return true;
  };

  const addCar = async (car) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(car),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setCars((prev) => [...prev, data]);
    return true;
  };

  const updateCar = async (id, updates) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ ...updates, name: updates.name || '' }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setCars((prev) => prev.map((c) => (c.id === id ? data : c)));
    return true;
  };

  const deleteCar = async (id) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (!res.ok) return false;
    setCars((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  const addBike = async (bike) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/bikes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(bike),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setBikes((prev) => [...prev, data]);
    return true;
  };

  const updateBike = async (id, updates) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ ...updates, name: updates.name || '' }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setBikes((prev) => prev.map((b) => (b.id === id ? data : b)));
    return true;
  };

  const deleteBike = async (id) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (!res.ok) return false;
    setBikes((prev) => prev.filter((b) => b.id !== id));
    return true;
  };

  const addGalleryImage = async (url) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) return false;
    setGallery((prev) => [...prev, url]);
    return true;
  };

  const removeGalleryImage = async (url) => {
    if (!token) return false;
    const res = await fetch(`${API_BASE}/gallery?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (!res.ok) return false;
    setGallery((prev) => prev.filter((g) => g !== url));
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        cities,
        locations,
        cars,
        bikes,
        gallery,
        heroImages,
        aboutImage,
        addCity,
        removeCity,
        addLocation,
        removeLocation,
        addCar,
        updateCar,
        deleteCar,
        addBike,
        updateBike,
        deleteBike,
        addGalleryImage,
        removeGalleryImage,
        addHeroImage,
        removeHeroImage,
        updateAboutImage,
        deleteAboutImage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside DataProvider');
  return context;
};
