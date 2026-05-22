import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "../stores/auth-store";

export function AuthScreen() {
  const { user, isSignedIn, login, register, logout, isLoading } =
    useAuthStore();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Signed in as {user?.username ?? user?.email}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => void logout()}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const submit = async () => {
    setError(null);
    try {
      if (mode === "signIn") {
        await login({ email, password });
      } else {
        await register({ email, username, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      {mode === "signUp" && (
        <TextInput
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={styles.button}
        disabled={isLoading}
        onPress={() => void submit()}
      >
        <Text style={styles.buttonText}>
          {isLoading
            ? "Working..."
            : mode === "signIn"
              ? "Sign In"
              : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
      >
        <Text style={styles.toggle}>
          {mode === "signIn"
            ? "No account? Sign up"
            : "Already have an account? Sign in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: 8 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  error: { color: "red" },
  toggle: { textAlign: "center", marginTop: 8, color: "#2196F3" },
});
