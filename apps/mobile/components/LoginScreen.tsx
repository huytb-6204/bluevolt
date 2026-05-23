import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/auth-store";

interface Props {
  onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: Props) {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setError(null);
    try {
      await login(form);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng.");
      setError(Array.isArray(msg) ? (msg[0] ?? null) : msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Ionicons name="flash" size={22} color="#fff" />
          </View>
          <Text style={styles.logoText}>BlueVolt</Text>
        </View>

        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào mừng trở lại!</Text>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#f87171" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#475569"
          value={form.email}
          onChangeText={(v) => {
            setForm((p) => ({ ...p, email: v }));
            setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            value={form.password}
            onChangeText={(v) => {
              setForm((p) => ({ ...p, password: v }));
              setError(null);
            }}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword((p) => !p)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, isLoading && styles.btnDisabled]}
          onPress={() => void handleSubmit()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.linkText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" },
  logoBox: { width: 36, height: 36, backgroundColor: "#2563eb", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 24, fontWeight: "700", color: "#fff", letterSpacing: -0.5 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#64748b", marginBottom: 28 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#450a0a", borderWidth: 1, borderColor: "#7f1d1d", borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: "#f87171", fontSize: 13, flex: 1 },
  label: { fontSize: 14, color: "#cbd5e1", marginBottom: 6, fontWeight: "500" },
  input: { backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: "#fff", marginBottom: 16 },
  passwordRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  eyeBtn: { padding: 13, backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155", borderRadius: 10 },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { color: "#3b82f6", fontSize: 13 },
  btn: { backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginBottom: 24 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerRow: { flexDirection: "row", justifyContent: "center" },
  footerText: { color: "#64748b", fontSize: 14 },
  linkText: { color: "#3b82f6", fontSize: 14, fontWeight: "600" },
});
