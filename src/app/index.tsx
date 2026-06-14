import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useAuthStore } from '../store';
import { API_URL } from '../lib/api';

function getDeviceId(): string {
  return Constants.installationId ?? `device-${Date.now()}`;
}

function getDeviceName(): string {
  const brand = Constants.deviceName ?? Platform.OS;
  return brand;
}

export default function LoginScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleLogin = async () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          clientType: 'mobile',
          deviceId: getDeviceId(),
          deviceName: getDeviceName(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Login failed');
        setPin('');
        return;
      }

      login(data.user, data.token);
      router.replace('/(tabs)/tables');
    } catch (err) {
      setError('Cannot connect to server');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const NumberButton = ({ num }: { num: string }) => (
    <TouchableOpacity
      style={styles.numButton}
      onPress={() => handlePress(num)}
      disabled={loading}
    >
      <Text style={styles.numText}>{num}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waiter POS Login</Text>
      <Text style={styles.subtitle}>Enter 4-digit PIN</Text>
      
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotActive]} />
        ))}
      </View>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.numpad}>
        <View style={styles.row}>
          <NumberButton num="1" />
          <NumberButton num="2" />
          <NumberButton num="3" />
        </View>
        <View style={styles.row}>
          <NumberButton num="4" />
          <NumberButton num="5" />
          <NumberButton num="6" />
        </View>
        <View style={styles.row}>
          <NumberButton num="7" />
          <NumberButton num="8" />
          <NumberButton num="9" />
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.numButton} onPress={handleBackspace} disabled={loading}>
            <Text style={styles.numText}>⌫</Text>
          </TouchableOpacity>
          <NumberButton num="0" />
          <TouchableOpacity
            style={[styles.numButton, styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>{loading ? '...' : 'OK'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  pinDotActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 14,
  },
  numpad: {
    gap: 16,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  numButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0f172a',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
