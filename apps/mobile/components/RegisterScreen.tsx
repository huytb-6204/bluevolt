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

const passwordRules = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
];

interface Props {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: Props) {
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!form.email || !form.username || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!passwordRules.every((r) => r.test(form.password))) {
      setError("Mật khẩu chưa đủ điều kiện.");
      return;
    }
    try {
      await register({
        email: form.email,
        username: form.username,
        password: form.password,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.");
      setError(Array.isArray(msg) ? (msg[0] ?? null) : msg);
    }
  };

  const update = (key: keyof typeof form) => (v: string) => {
    setForm((p) => ({ ...p, [key]: v }));
    setError(null);
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

        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Đăng ký để bắt đầu sử dụng BlueVolt.</Text>

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
          onChangeText={update("email")}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Text style={styles.label}>Tên người dùng</Text>
        <TextInput
          style={styles.input}
          placeholder="nguyenvana"
          placeholderTextColor="#475569"
          value={form.username}
          onChangeText={update("username")}
          autoCapitalize="none"
          autoComplete="username"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            value={form.password}
            onChangeText={update("password")}
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
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

        {/* Password strength */}
        {passwordFocused && form.password.length > 0 && (
          <View style={styles.rulesBox}>
            {passwordRules.map((rule) => {
              const passed = rule.test(form.password);
              return (
                <View key={rule.label} style={styles.ruleRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={passed ? "#4ade80" : "#334155"}
                  />
                  <Text style={[styles.ruleText, passed && styles.rulePass]}>
                    {rule.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Xác nhận mật khẩu</Text>
        <TextInput
          style={[
            styles.input,
            form.confirmPassword.length > 0 && {
              borderColor:
                form.confirmPassword === form.password ? "#16a34a" : "#dc2626",
            },
          ]}
          placeholder="••••••••"
          placeholderTextColor="#475569"
          value={form.confirmPassword}
          onChangeText={update("confirmPassword")}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btn, isLoading && styles.btnDisabled]}
          onPress={() => void handleSubmit()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Tạo tài khoản</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.linkText}>Đăng nhập</Text>
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
  rulesBox: { gap: 4, marginBottom: 8 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ruleText: { fontSize: 12, color: "#334155" },
  rulePass: { color: "#4ade80" },
  btn: { backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginBottom: 24, marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerRow: { flexDirection: "row", justifyContent: "center" },
  footerText: { color: "#64748b", fontSize: 14 },
  linkText: { color: "#3b82f6", fontSize: 14, fontWeight: "600" },
});
