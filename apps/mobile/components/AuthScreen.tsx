import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/auth-store";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";

type AuthMode = "login" | "register";

export function AuthScreen() {
  const { user, isSignedIn, logout } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");

  if (isSignedIn) {
    return (
      <View style={styles.signedIn}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#3b82f6" />
          </View>
          <View>
            <Text style={styles.username}>{user?.username ?? user?.email}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => void logout()}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#f87171" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === "login") {
    return (
      <LoginScreen onNavigateToRegister={() => setMode("register")} />
    );
  }

  return (
    <RegisterScreen onNavigateToLogin={() => setMode("login")} />
  );
}

const styles = StyleSheet.create({
  signedIn: { flex: 1, backgroundColor: "#020617", padding: 24, justifyContent: "center", gap: 24 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1e293b", borderRadius: 12, padding: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#1e3a5f", alignItems: "center", justifyContent: "center" },
  username: { fontSize: 18, fontWeight: "700", color: "#fff" },
  email: { fontSize: 13, color: "#64748b", marginTop: 2 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155", borderRadius: 10, paddingVertical: 13 },
  logoutText: { color: "#f87171", fontSize: 15, fontWeight: "600" },
});
